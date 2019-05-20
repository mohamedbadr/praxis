using Praxis.Entities.Identity;

namespace Praxis.Api.Models
{
    public class AccountModel
    {
        public string Email { get; set; }

        public string Password { get; set; }

        public UserType UserType { get; set; }

        public string FullName { get; set; }
    }
}
