using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CybersecurityPortal.API.Models.ViewModels
{
    public class PaginationRequest
    {
        public int PageSize { get; set; } = 20;
        public int PageIndex { get; set; } = 0;

        public async Task<PaginatedViewModel<T>> ApplyAsync<T>(IQueryable<T> query)
        {
            var totalItems = await query.LongCountAsync();
            var items = await query
                .Skip(PageSize * PageIndex)
                .Take(PageSize)
                .ToListAsync();

            return new PaginatedViewModel<T>
            {
                PageSize = PageSize,
                PageIndex = PageIndex,
                TotalItems = totalItems,
                Items = items
            };
        }
    }
}
