using System.ComponentModel.DataAnnotations;

namespace CybersecurityPortal.API.Models.ViewModels
{
    public class ChangeEmailModel
    {
        [Required]
        public string CurrentPassword { get; set; } = "";

        [Required]
        public string NewEmail { get; set; } = "";
    }
}
