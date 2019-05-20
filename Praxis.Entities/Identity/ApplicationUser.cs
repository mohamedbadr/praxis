using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Praxis.Entities.Identity
{
    public class ApplicationUser : IdentityUser
    {
        [Required]
        public UserType UserType { get; set; }

        [Required]
        public override string Email { get; set; }

        [Required]
        public string FullName { get; set; }
    }
}
