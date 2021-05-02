using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CybersecurityPortal.API.Models.Dtos;

namespace CybersecurityPortal.API.Services
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDto>> GetAll();
        Task<CategoryDto> Add(CategoryDto categoryDto);
        Task Update(CategoryDto categoryDto);
        Task Delete(Guid id);
    }
}