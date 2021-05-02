using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CybersecurityPortal.API.Infrastructure
{
    public static class MigrateDatabaseExtensions
    {
        public static void MigrateContext<TContext>(
            this IApplicationBuilder app, 
            Action<TContext, IServiceProvider>? seeder = null) 
            where TContext : DbContext
        {
            using var scope = app.ApplicationServices.CreateScope();
            var services = scope.ServiceProvider;
            var logger = services.GetRequiredService<ILogger<TContext>>();
            using var context = services.GetRequiredService<TContext>();

            try
            {
                logger.LogInformation("Migrating database associated with context {DbContextName}", typeof(TContext).Name);

                // TODO: context.Database.Migrate();
                context.Database.EnsureCreated();

                seeder?.Invoke(context, services);

                logger.LogInformation("Migrated database associated with context {DbContextName}", typeof(TContext).Name);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while migrating the database used on context {DbContextName}", typeof(TContext).Name);
            }
        }
    }
}
