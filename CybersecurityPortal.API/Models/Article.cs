using System;

namespace CybersecurityPortal.API.Models
{
    public class Article
    {
        public Guid Id { get; set; }

        public Guid CategoryId { get; set; }

        public virtual Category? Category { get; set; }

        public string Title { get; set; } = "";

        public string Content { get; set; } = "";

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
