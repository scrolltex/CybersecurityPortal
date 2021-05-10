using System;
using System.Collections.Generic;

namespace CybersecurityPortal.API.Models
{
    public class Article
    {
        public Guid Id { get; set; }

        public string UserId { get; set; } = null!;

        public virtual User? User { get; set; }

        public Guid CategoryId { get; set; }

        public virtual Category? Category { get; set; }

        public string Title { get; set; } = "";

        public string Content { get; set; } = "";

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public virtual ICollection<UserArticleBookmark> UserBookmarks { get; set; } = new List<UserArticleBookmark>();

        public virtual ICollection<UserArticleLike> UserLikes { get; set; } = new List<UserArticleLike>();
    }
}
