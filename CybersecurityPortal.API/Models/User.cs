using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace CybersecurityPortal.API.Models
{
    public class User : IdentityUser
    {
        public virtual ICollection<Article> Articles { get; set; } = new List<Article>();

        public virtual ICollection<UserArticleBookmark> Bookmarks { get; set; } = new List<UserArticleBookmark>();

        public virtual ICollection<UserArticleLike> ArticleLikes { get; set; } = new List<UserArticleLike>();
    }
}
