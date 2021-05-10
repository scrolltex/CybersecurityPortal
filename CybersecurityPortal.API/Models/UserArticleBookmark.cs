using System;

namespace CybersecurityPortal.API.Models
{
    public class UserArticleBookmark
    {
        public string UserId { get; set; } = "";

        public virtual User? User { get; set; }

        public Guid ArticleId { get; set; }

        public virtual Article? Article { get; set; }
    }
}
