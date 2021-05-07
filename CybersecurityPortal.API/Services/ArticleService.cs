using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using CybersecurityPortal.API.Exceptions;
using CybersecurityPortal.API.Infrastructure;
using CybersecurityPortal.API.Models;
using CybersecurityPortal.API.Models.Dtos;
using CybersecurityPortal.API.Models.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CybersecurityPortal.API.Services
{
    public class ArticleService : IArticleService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IServiceProvider _serviceProvider;

        public ArticleService(
            DataContext context, 
            IMapper mapper, 
            IServiceProvider serviceProvider)
        {
            _context = context;
            _mapper = mapper;
            _serviceProvider = serviceProvider;
        }

        public async Task<PaginatedViewModel<ArticleDto>> GetAllAsync(PaginationRequest pagination, Guid? categoryId = null)
        {
            var query = _context.Articles
                .Include(x => x.Category)
                .AsQueryable();

            if (categoryId != null)
            {
                query = query.Where(x => x.CategoryId == categoryId);
            }

            var query2 = query
                .ProjectTo<ArticleDto>(_mapper.ConfigurationProvider)
                .OrderByDescending(a => a.CreatedAt)
                .AsQueryable();

            return await pagination.ApplyAsync(query2);
        }

        public async Task<PaginatedViewModel<ArticleDto>> GetByUserAsync(string userName, PaginationRequest pagination)
        {
            var userManager = _serviceProvider.GetRequiredService<UserManager<User>>();
            var user = await userManager.FindByNameAsync(userName);

            if (user == null)
            {
                return new PaginatedViewModel<ArticleDto>();
            }

            var query = _context.Articles
                .Include(x => x.Category)
                .Include(x => x.User)
                .Where(x => x.UserId == user.Id)
                .ProjectTo<ArticleDto>(_mapper.ConfigurationProvider)
                .OrderByDescending(a => a.CreatedAt);

            return await pagination.ApplyAsync(query);
        }

        public async Task<ArticleDto> FindByIdAsync(Guid id)
        {
            var articleDto = await _context.Articles
                .ProjectTo<ArticleDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Id == id);

            return articleDto;
        }

        public async Task<ArticleDto> AddAsync(CreateArticleDto articleDto, string userName)
        {
            if (articleDto == null) 
                throw new ArgumentNullException(nameof(articleDto));

            var userManager = _serviceProvider.GetRequiredService<UserManager<User>>();
            var user = await userManager.FindByNameAsync(userName);

            var article = _mapper.Map<Article>(articleDto);
            article.UserId = user.Id;
            article.CreatedAt = DateTime.Now;
            article.Category = null;
            _context.Articles.Add(article);
            await _context.SaveChangesAsync();

            return _mapper.Map<ArticleDto>(article);
        }

        public async Task UpdateAsync(ArticleDto articleDto)
        {
            if (articleDto == null) 
                throw new ArgumentNullException(nameof(articleDto));

            var article = _mapper.Map<Article>(articleDto);
            article.Category = null;
            _context.Entry(article).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ArticleExists(article.Id))
                {
                    throw new NotFoundException(nameof(Article));
                }

                throw;
            }
        }

        public async Task DeleteAsync(Guid id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article == null)
            {
                throw new NotFoundException(nameof(Article));
            }

            _context.Articles.Remove(article);
            await _context.SaveChangesAsync();
        }

        private bool ArticleExists(Guid id)
        {
            return _context.Articles.Any(e => e.Id == id);
        }
    }
}
