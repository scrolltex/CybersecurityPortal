using System;
using System.Threading.Tasks;
using CybersecurityPortal.API.Models.Dtos;
using CybersecurityPortal.API.Models.ViewModels;

namespace CybersecurityPortal.API.Services
{
    public interface IArticleService
    {
        Task<PaginatedViewModel<ArticleDto>> GetAllAsync(
            string? currentUserName, 
            PaginationRequest pagination, 
            Guid? categoryId = null);

        Task<PaginatedViewModel<ArticleDto>> GetByUserAsync(
            string? currentUserName, 
            string userName, 
            PaginationRequest pagination);

        Task<PaginatedViewModel<ArticleDto>> GetUserBookmarkedAsync(
            string? currentUserName,
            string userName,
            PaginationRequest pagination);

        Task<PaginatedViewModel<ArticleDto>> SearchAsync(
            string? currentUserName,
            PaginationRequest pagination,
            string searchRequest);

        Task<ArticleDto> FindByIdAsync(string? currentUserName, Guid id);

        Task<ArticleDto> AddAsync(CreateArticleDto articleDto, string userName);

        Task UpdateAsync(ArticleDto articleDto);

        Task DeleteAsync(Guid id);

        Task<bool> ToggleBookmarkAsync(Guid articleId, string userName);

        Task<(bool, int)> ToggleLikeAsync(Guid articleId, string userName);
    }
}