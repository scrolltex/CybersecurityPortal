using System;
using System.Threading.Tasks;
using CybersecurityPortal.API.Models.Dtos;
using CybersecurityPortal.API.Models.ViewModels;

namespace CybersecurityPortal.API.Services
{
    public interface IArticleService
    {
        Task<PaginatedViewModel<ArticleDto>> GetAllAsync(PaginationRequest pagination, Guid? categoryId = null);

        Task<PaginatedViewModel<ArticleDto>> GetByUserAsync(string userName, PaginationRequest pagination);

        Task<ArticleDto> FindByIdAsync(Guid id);

        Task<ArticleDto> AddAsync(CreateArticleDto articleDto, string userName);

        Task UpdateAsync(ArticleDto articleDto);

        Task DeleteAsync(Guid id);
    }
}