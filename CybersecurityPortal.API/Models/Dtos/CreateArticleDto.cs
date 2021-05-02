using System;
using System.ComponentModel.DataAnnotations;

namespace CybersecurityPortal.API.Models.Dtos
{
    public class CreateArticleDto
    {
        public Guid CategoryId { get; set; }

        [Required]
        public string Title { get; set; } = "";

        [Required]
        public string Content { get; set; } = "";
    }
}
