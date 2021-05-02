using System;
using System.Diagnostics;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using CybersecurityPortal.API.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CybersecurityPortal.API.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ApiBehaviorOptions _options;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(
            RequestDelegate next,
            IOptions<ApiBehaviorOptions> options, 
            ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _options = options.Value;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        /// <summary>
        /// Определяет тип исключения и в зависимости от него возвращает статус код на портал
        /// </summary>
        /// <param name="context">HttpContext</param>
        /// <param name="ex">Исключение</param>
        private Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            var code = HttpStatusCode.InternalServerError;
            var error = BuildInnerExceptions(ex);

            switch (ex)
            {
                case NotFoundException:
                    code = HttpStatusCode.NotFound;
                    break;

                case ArgumentException:
                case DomainException:
                    code = HttpStatusCode.BadRequest;
                    break;

                default:
                    _logger.LogError(ex, "Произошла ошибка.");
                    break;
            }

            var statusCode = (int)code;
            var problemDetails = new ProblemDetails
            {
                Title = "An error occurred while processing your request.",
                Detail = error,
                Status = statusCode,
            };

            if (_options.ClientErrorMapping.TryGetValue(statusCode, out var clientErrorData))
            {
                problemDetails.Title ??= clientErrorData.Title;
                problemDetails.Type ??= clientErrorData.Link;
            }

            var traceId = Activity.Current?.Id ?? context.TraceIdentifier;
            if (traceId != null)
            {
                problemDetails.Extensions["traceId"] = traceId;
            }

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = problemDetails.Status.Value;
            return context.Response.WriteAsync(JsonSerializer.Serialize(problemDetails));
        }

        private static string BuildInnerExceptions(Exception exception)
        {
            var inner = exception.InnerException;

            var message = new StringBuilder(exception.Message);

            while (inner != null)
            {
                message.Append($"\n\t{inner.Message}");
                inner = inner.InnerException;
            }

            return message.ToString();
        }
    }
}
