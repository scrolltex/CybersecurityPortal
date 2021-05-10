using CybersecurityPortal.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CybersecurityPortal.API.Infrastructure.EntityTypeConfigurations
{
    public class UserArticleBookmarkEntityTypeConfiguration : IEntityTypeConfiguration<UserArticleBookmark>
    {
        public void Configure(EntityTypeBuilder<UserArticleBookmark> builder)
        {
            builder.HasKey(x => new { x.UserId, x.ArticleId });
        }
    }
}
