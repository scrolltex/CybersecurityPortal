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

        public async Task<PaginatedViewModel<ArticleDto>> GetAllAsync(
            string? currentUserName,
            PaginationRequest pagination, 
            Guid? categoryId = null)
        {
            var userManager = _serviceProvider.GetRequiredService<UserManager<User>>();
            var currentUser = currentUserName != null ? await userManager.FindByNameAsync(currentUserName) : null;

            var query = _context.Articles
                .Include(x => x.Category)
                .AsQueryable();

            if (categoryId != null)
            {
                query = query.Where(x => x.CategoryId == categoryId);
            }

            var query2 = query
                .ProjectTo<ArticleDto>(_mapper.ConfigurationProvider, new { currentUserId = currentUser?.Id })
                .OrderByDescending(a => a.CreatedAt)
                .AsQueryable();

            return await pagination.ApplyAsync(query2);
        }

        public async Task<PaginatedViewModel<ArticleDto>> GetByUserAsync(
            string? currentUserName, 
            string userName, 
            PaginationRequest pagination)
        {
            var userManager = _serviceProvider.GetRequiredService<UserManager<User>>();
            var currentUser = currentUserName != null ? await userManager.FindByNameAsync(currentUserName) : null;
            var user = await userManager.FindByNameAsync(userName);

            if (user == null)
            {
                return new PaginatedViewModel<ArticleDto>();
            }

            var query = _context.Articles
                .Include(x => x.Category)
                .Include(x => x.User)
                .Where(x => x.UserId == user.Id)
                .ProjectTo<ArticleDto>(_mapper.ConfigurationProvider, new { currentUserId = currentUser?.Id })
                .OrderByDescending(a => a.CreatedAt);

            return await pagination.ApplyAsync(query);
        }

        public async Task<PaginatedViewModel<ArticleDto>> GetUserBookmarkedAsync(
            string? currentUserName,
            string userName,
            PaginationRequest pagination)
        {
            var userManager = _serviceProvider.GetRequiredService<UserManager<User>>();
            var currentUser = currentUserName != null ? await userManager.FindByNameAsync(currentUserName) : null;
            var user = await userManager.FindByNameAsync(userName);

            if (user == null)
            {
                return new PaginatedViewModel<ArticleDto>();
            }

            var query = _context.Articles
                .Include(x => x.Category)
                .Include(x => x.User)
                .Include(x => x.UserBookmarks)
                .Where(x => x.UserBookmarks.Any(b => b.UserId == user.Id))
                .ProjectTo<ArticleDto>(_mapper.ConfigurationProvider, new { currentUserId = currentUser?.Id })
                .OrderByDescending(a => a.CreatedAt);

            return await pagination.ApplyAsync(query);
        }

        public async Task<PaginatedViewModel<ArticleDto>> SearchAsync(string? currentUserName, PaginationRequest pagination, string searchRequest)
        {
            var userManager = _serviceProvider.GetRequiredService<UserManager<User>>();
            var currentUser = currentUserName != null ? await userManager.FindByNameAsync(currentUserName) : null;

            var query = _context.Articles
                .Include(x => x.Category)
                .Where(x => x.Title.Contains(searchRequest))
                .ProjectTo<ArticleDto>(_mapper.ConfigurationProvider, new { currentUserId = currentUser?.Id })
                .OrderByDescending(a => a.CreatedAt)
                .AsQueryable();

            return await pagination.ApplyAsync(query);
        }

        public async Task<ArticleDto> FindByIdAsync(string? currentUserName, Guid id)
        {
            var userManager = _serviceProvider.GetRequiredService<UserManager<User>>();
            var currentUser = currentUserName != null ? await userManager.FindByNameAsync(currentUserName) : null;

            var articleDto = await _context.Articles
                .ProjectTo<ArticleDto>(_mapper.ConfigurationProvider, new { currentUserId = currentUser?.Id })
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

        public async Task<bool> ToggleBookmarkAsync(Guid articleId, string userName)
        {
            if (string.IsNullOrWhiteSpace(userName))
                throw new ArgumentException("Value cannot be null or whitespace.", nameof(userName));

            if (!ArticleExists(articleId))
                throw new NotFoundException("Статья не найдена");

            var userManager = _serviceProvider.GetRequiredService<UserManager<User>>();
            var user = await userManager.FindByNameAsync(userName);
            if (user == null)
                throw new NotFoundException("Пользователь не найден");

            var existedBookmark = await _context.UserArticleBookmarks.FindAsync(user.Id, articleId);

            bool result;
            if (existedBookmark == null)
            {
                _context.UserArticleBookmarks.Add(new UserArticleBookmark
                {
                    UserId = user.Id,
                    ArticleId = articleId,
                });
                result = true;
            }
            else
            {
                _context.UserArticleBookmarks.Remove(existedBookmark);
                result = false;
            }

            await _context.SaveChangesAsync();

            return result;
        }

        public async Task<(bool, int)> ToggleLikeAsync(Guid articleId, string userName)
        {
            if (string.IsNullOrWhiteSpace(userName))
                throw new ArgumentException("Value cannot be null or whitespace.", nameof(userName));

            if (!ArticleExists(articleId))
                throw new NotFoundException("Статья не найдена");

            var userManager = _serviceProvider.GetRequiredService<UserManager<User>>();
            var user = await userManager.FindByNameAsync(userName);
            if (user == null)
                throw new NotFoundException("Пользователь не найден");

            var existedLike = await _context.UserArticleLikes.FindAsync(user.Id, articleId);

            bool result;
            if (existedLike == null)
            {
                _context.UserArticleLikes.Add(new UserArticleLike
                {
                    UserId = user.Id,
                    ArticleId = articleId,
                });
                result = true;
            }
            else
            {
                _context.UserArticleLikes.Remove(existedLike);
                result = false;
            }

            await _context.SaveChangesAsync();
            var count = await _context.UserArticleLikes.CountAsync(x => x.ArticleId == articleId);

            return (result, count);
        }

        private bool ArticleExists(Guid id)
        {
            return _context.Articles.Any(e => e.Id == id);
        }
    }
}
