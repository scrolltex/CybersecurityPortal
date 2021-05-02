using System;
using System.Linq;
using System.Threading.Tasks;
using CybersecurityPortal.API.Models;

namespace CybersecurityPortal.API.Infrastructure
{
    public static class DataContextSeeder
    {
        public static async Task SeedAsync(DataContext context, IServiceProvider services)
        {
            if (!context.Categories.Any())
            {
                context.Categories.Add(new Category
                {
                    Name = "Default"
                });
                await context.SaveChangesAsync();
            }
        }
    }
}
