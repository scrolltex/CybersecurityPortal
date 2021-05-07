using System.ComponentModel.DataAnnotations;

namespace CybersecurityPortal.API.Models.ViewModels
{
    public class RegisterViewModel
    {
        [Required]
        public string UserName { get; set; } = "";

        [Required] 
        public string Email { get; set; } = "";

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = "";
    }
}
