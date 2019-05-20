using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Praxis.Data;
using Praxis.Entities;
using Praxis.Entities.Identity;

namespace Praxis.Service
{
    public class UserService : ServiceBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UserService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager,
          IDataContextFactory dataContextFactory) : base(dataContextFactory)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public UserService(UserManager<ApplicationUser> userManager, IDataContextFactory dataContextFactory) : base(
          dataContextFactory)
        {
            _userManager = userManager;
        }

        public async Task<IReadOnlyCollection<ApplicationUser>> GetUsers()
        {
            var users = await _userManager.Users
                .OrderBy(i => i.FullName)
                .ToListAsync();

            return users;
        }

        public async Task<ApplicationUser> GetUserById(string userId)
        {
            return await _userManager.Users
              .SingleOrDefaultAsync(i => i.Id == userId);
        }

        public async Task<ApplicationUser> GetUserByUserName(string userName)
        {
            return await _userManager.FindByNameAsync(userName);
        }

        public async Task<ApplicationUser> GetUserByEmail(string email)
        {
            return await _userManager.FindByEmailAsync(email);
        }

        public async Task<IReadOnlyCollection<IdentityRole>> GetRoles()
        {
            return await _roleManager.Roles
              .OrderBy(i => i.Name)
              .ToListAsync();
        }

        public async Task<IReadOnlyCollection<string>> GetUserRoles(ApplicationUser user)
        {
            return (await _userManager.GetRolesAsync(user)).ToList();
        }

        public async Task<IdentityResult> CreateUser(ApplicationUser user, string password)
        {
            return await _userManager.CreateAsync(user, password);
        }

        public async Task SaveUserRoles(ApplicationUser user, IList<string> roles)
        {
            var allRoles = await _roleManager.Roles.ToListAsync();
            var unassignedRoles = allRoles.Where(i => !roles.Contains(i.Name)).Select(i => i.Name);

            foreach (var role in unassignedRoles)
            {
                await _userManager.RemoveFromRoleAsync(user, role);
            }


            foreach (var role in roles)
            {
                await _userManager.AddToRoleAsync(user, role);
            }

            //await _userManager.RemoveFromRolesAsync(user, unassignedRoles);
            //await _userManager.AddToRolesAsync(user, roles);
        }

        public async Task<IdentityResult> SaveUser(ApplicationUser user)
        {
            return await _userManager.UpdateAsync(user);
        }

        public async Task<IdentityResult> ChangePassword(ApplicationUser user, string password)
        {
            await _userManager.RemovePasswordAsync(user);
            return await _userManager.AddPasswordAsync(user, password);
        }

        public async Task<Boolean> CheckPassword(ApplicationUser user, string password)
        {
            return await _userManager.CheckPasswordAsync(user, password);
        }
    }
}
