using System.Collections.Generic;

namespace CybersecurityPortal.API.Models.ViewModels
{
    public class PaginatedViewModel<T>
    {
        public int PageSize { get; init; }
        public int PageIndex { get; init; }
        public long TotalItems { get; init; }
        public IEnumerable<T> Items { get; init; } = new List<T>();
    }
}