using System;
using System.Linq;
using System.Threading.Tasks;
using CybersecurityPortal.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace CybersecurityPortal.API.Infrastructure
{
    public static class DataContextSeeder
    {
        public static async Task SeedAsync(DataContext context, IServiceProvider services)
        {
            await SeedIdentity(services);

            if (!context.Categories.Any())
            {
                context.Categories.Add(new Category
                {
                    Name = "Default"
                });
                await context.SaveChangesAsync();
            }
        }

        private static async Task SeedIdentity(IServiceProvider services)
        {
            using var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
            using var userManager = services.GetRequiredService<UserManager<User>>();

            const string adminRoleName = "admin";
            const string moderatorRoleName = "moderator";

            if (!roleManager.Roles.Any())
            {
                await roleManager.CreateAsync(new IdentityRole(adminRoleName));
                await roleManager.CreateAsync(new IdentityRole(moderatorRoleName));
            }

            if (!userManager.Users.Any())
            {
                var user = new User
                {
                    UserName = "admin",
                    Email = "admin@example.com"
                };

                await userManager.CreateAsync(user, "Aa12345");
                await userManager.AddToRoleAsync(user, adminRoleName);
            }
        }
    }
}
