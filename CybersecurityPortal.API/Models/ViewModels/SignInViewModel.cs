using System.ComponentModel.DataAnnotations;

namespace CybersecurityPortal.API.Models.ViewModels
{
    public class SignInViewModel
    {
        [Required]
        public string UserName { get; set; } = "";

        [Required]
        public string Password { get; set; } = "";
    }
}
