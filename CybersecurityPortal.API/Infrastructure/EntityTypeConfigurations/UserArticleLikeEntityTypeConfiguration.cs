using CybersecurityPortal.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CybersecurityPortal.API.Infrastructure.EntityTypeConfigurations
{
    public class UserArticleLikeEntityTypeConfiguration : IEntityTypeConfiguration<UserArticleLike>
    {
        public void Configure(EntityTypeBuilder<UserArticleLike> builder)
        {
            builder.HasKey(x => new { x.UserId, x.ArticleId });
        }
    }
}
