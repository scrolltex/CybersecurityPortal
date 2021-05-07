using System.ComponentModel.DataAnnotations;

namespace CybersecurityPortal.API.Models.ViewModels
{
    public class ChangePasswordViewModel
    {
        [Required]
        public string CurrentPassword { get; set; } = "";

        [Required]
        public string NewPassword { get; set; } = "";
    }
}
