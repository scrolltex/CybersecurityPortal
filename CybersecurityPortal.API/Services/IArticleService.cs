using System;
using System.Threading.Tasks;
using CybersecurityPortal.API.Models.Dtos;
using CybersecurityPortal.API.Models.ViewModels;

namespace CybersecurityPortal.API.Services
{
    public interface IArticleService
    {
        Task<PaginatedViewModel<ArticleDto>> GetAll(int pageSize, int pageIndex, Guid? categoryId = null);

        Task<ArticleDto> GetById(Guid id);

        Task<ArticleDto> Add(CreateArticleDto articleDto);

        Task Update(ArticleDto articleDto);

        Task Delete(Guid id);
    }
}