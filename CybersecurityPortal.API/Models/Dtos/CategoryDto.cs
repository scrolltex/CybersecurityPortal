using System;
using System.ComponentModel.DataAnnotations;

namespace CybersecurityPortal.API.Models.Dtos
{
    public class CategoryDto
    {
        public Guid? Id { get; set; }

        [Required]
        [StringLength(150)]
        public string Name { get; set; } = "";
    }
}
