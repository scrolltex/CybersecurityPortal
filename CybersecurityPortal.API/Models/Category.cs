using System;
using System.Collections.Generic;

namespace CybersecurityPortal.API.Models
{
    public class Category
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = "";

        public virtual ICollection<Article> Articles { get; set; } = new List<Article>();
    }
}
