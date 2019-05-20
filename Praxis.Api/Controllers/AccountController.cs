using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Praxis.Api.Models;
using Praxis.Api.Token;
using Praxis.Data;
using Praxis.Entities.Identity;
using Praxis.Service;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Praxis.Api.Controllers
{
    [Route("api/Account")]
    [AllowAnonymous]
    public class AccountController : BaseController
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserService _userService;
        private readonly TokenFactory _tokenFactory;

        public AccountController(
            IDataContextFactory dataContextFactory,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration config) : base(dataContextFactory)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;

            _userService = new UserService(userManager, roleManager, DataContextFactory);
            _tokenFactory = new TokenFactory(_userService, config);
        }

        [HttpPost]
        public async Task<IActionResult> Register(AccountModel model)
        {
            try
            {
                var user = new ApplicationUser
                {
                    FullName = model.FullName,
                    UserName = model.Email,
                    Email = model.Email,
                    UserType = model.UserType
                };


                var result = await _userService.CreateUser(user, model.Password);
                if (result.Succeeded)
                {
                    user = await _userService.GetUserByUserName(model.Email);
                    await _userService.SaveUserRoles(user, new List<string> { model.UserType.ToString() });
                    var tokenModel = await _tokenFactory.Generate(user);
                    return Ok(tokenModel);
                }

                return InvalidArgumentError("Unexpected error while creating user.");
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return ModelStateError(ModelState);
            }

            var user = await _userManager.FindByNameAsync(model.Username);
            if (user == null)
            {
                return BadRequest("Invalid username or password.");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, true);
            if (!result.Succeeded)
            {
                return BadRequest("Invalid username or password.");
            }

            var tokenModel = await _tokenFactory.Generate(user);
            return Ok(tokenModel);
        }
    }
}