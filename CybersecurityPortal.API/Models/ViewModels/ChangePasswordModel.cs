using System.ComponentModel.DataAnnotations;

namespace CybersecurityPortal.API.Models.ViewModels
{
    public class ChangePasswordModel
    {
        [Required]
        public string CurrentPassword { get; set; } = "";

        [Required]
        public string NewPassword { get; set; } = "";
    }
}
