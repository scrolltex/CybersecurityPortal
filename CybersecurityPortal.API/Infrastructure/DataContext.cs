#nullable disable
using CybersecurityPortal.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CybersecurityPortal.API.Infrastructure
{
    public class DataContext : DbContext
    {
        public DbSet<Article> Articles { get; set; }
        public DbSet<Category> Categories { get; set; }

        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }
    }
}
