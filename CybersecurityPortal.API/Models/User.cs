using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace CybersecurityPortal.API.Models
{
    public class User : IdentityUser
    {
        public ICollection<Article> Articles = new List<Article>();
    }
}
