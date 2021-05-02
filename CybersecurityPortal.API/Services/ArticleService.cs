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
using Microsoft.EntityFrameworkCore;

namespace CybersecurityPortal.API.Services
{
    public class ArticleService : IArticleService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ArticleService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PaginatedViewModel<ArticleDto>> GetAll(int pageSize, int pageIndex, Guid? categoryId = null)
        {
            if (pageSize <= 0) 
                throw new ArgumentOutOfRangeException(nameof(pageSize));

            if (pageIndex < 0) 
                throw new ArgumentOutOfRangeException(nameof(pageIndex));

            var query = _context.Articles
                .Include(x => x.Category)
                .AsQueryable();

            if (categoryId != null)
            {
                query = query.Where(x => x.CategoryId == categoryId);
            }

            var totalItems = await query.LongCountAsync();
            var articles = await query
                .ProjectTo<ArticleDto>(_mapper.ConfigurationProvider)
                .OrderByDescending(a => a.CreatedAt)
                .Skip(pageSize * pageIndex)
                .Take(pageSize)
                .ToListAsync();

            var viewModel = new PaginatedViewModel<ArticleDto>
            {
                PageSize = pageSize,
                PageIndex = pageIndex,
                TotalItems = totalItems,
                Items = articles
            };

            return viewModel;
        }

        public async Task<ArticleDto> GetById(Guid id)
        {
            var articleDto = await _context.Articles
                .ProjectTo<ArticleDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Id == id);

            return articleDto;
        }

        public async Task<ArticleDto> Add(CreateArticleDto articleDto)
        {
            if (articleDto == null) 
                throw new ArgumentNullException(nameof(articleDto));

            var article = _mapper.Map<Article>(articleDto); 
            article.CreatedAt = DateTime.Now;
            article.Category = null;
            _context.Articles.Add(article);
            await _context.SaveChangesAsync();

            return _mapper.Map<ArticleDto>(article);
        }

        public async Task Update(ArticleDto articleDto)
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

        public async Task Delete(Guid id)
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
