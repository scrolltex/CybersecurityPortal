using System;
using System.ComponentModel.DataAnnotations;

namespace CybersecurityPortal.API.Models.Dtos
{
    public class ArticleDto
    {
        public Guid Id { get; set; }

        public UserDto? User { get; set; }

        public Guid CategoryId { get; set; }

        public CategoryDto? Category { get; set; }

        [Required]
        public string Title { get; set; } = "";

        [Required]
        public string Content { get; set; } = "";

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public virtual ArticleStatsDto Stats { get; set; } = new();

        public virtual ArticleUserStateDto UserState { get; set; } = new();
    }
}
