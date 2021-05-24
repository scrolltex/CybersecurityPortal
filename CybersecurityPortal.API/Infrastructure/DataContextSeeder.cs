using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CybersecurityPortal.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CybersecurityPortal.API.Infrastructure
{
    public static class DataContextSeeder
    {
        private static readonly Random Rnd = new();

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

            if (!context.Articles.Any())
            {
                var userManager = services.GetRequiredService<UserManager<User>>();
                var user = await userManager.FindByNameAsync("user");

                const string path = "./Setup/Articles";
                if (!Directory.Exists(path))
                    return;

                var files = Directory.GetFiles(path, "*.md").AsEnumerable();
                files = Shuffle(files);

                var category = await context.Categories.SingleAsync();
                var articles = files.Select(filePath => new Article
                {
                    UserId = user.Id,
                    CategoryId = category.Id,
                    Title = Path.GetFileNameWithoutExtension(filePath),
                    Content = File.ReadAllText(filePath),
                    CreatedAt = GenRandomDate()
                }).ToList();

                context.Articles.AddRange(articles);
                await context.SaveChangesAsync();
            }
        }

        private static async Task SeedIdentity(IServiceProvider services)
        {
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = services.GetRequiredService<UserManager<User>>();

            const string adminRoleName = "admin";

            if (!roleManager.Roles.Any())
            {
                await roleManager.CreateAsync(new IdentityRole(adminRoleName));
            }

            if (!userManager.Users.Any())
            {
                var adminUser = new User
                {
                    UserName = "admin",
                    Email = "admin@cybersecutiry-portal.com"
                };
                await userManager.CreateAsync(adminUser, "Admin12345");
                await userManager.AddToRoleAsync(adminUser, adminRoleName);

                var defaultUser = new User
                {
                    UserName = "user",
                    Email = "user@cybersecutiry-portal.com"
                };
                await userManager.CreateAsync(defaultUser, "User12345");
            }
        }

        private static DateTime GenRandomDate()
        {
            var start = DateTime.Today;
            var range = (int)(DateTime.Now - start).TotalMinutes;
            return start.AddMinutes(Rnd.Next(range));
        }

        public static IEnumerable<T> Shuffle<T>(IEnumerable<T> source)
        {
            var rng = new Random();
            return source.OrderBy(_ => rng.Next());
        }
    }
}
