using System;

namespace CybersecurityPortal.API.Models
{
    public class UserArticleLike
    {
        public string UserId { get; set; } = "";

        public virtual User? User { get; set; }

        public Guid ArticleId { get; set; }

        public virtual Article? Article { get; set; }
    }
}
