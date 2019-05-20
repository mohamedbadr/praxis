using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Praxis.Api.Extensions;
using Praxis.Entities.Identity;
using Praxis.Service;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Praxis.Api.Token
{
    public class TokenFactory
    {
        private readonly IConfiguration _config;
        private readonly UserService _userService;

        public TokenFactory(UserService userService, IConfiguration config)
        {
            _config = config;
            _userService = userService;
        }

        public async Task<TokenModel> Generate(ApplicationUser user)
        {

            var claims = new List<Claim>
            {
                // Unique Id for all Jwt tokes
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                // Issuer
                new Claim(JwtRegisteredClaimNames.Iss, _config["Tokens:Issuer"]),
                // Issued at
                new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToUnixEpochDate().ToString(), ClaimValueTypes.Integer64),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
            };


            var roles = await _userService.GetUserRoles(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim("roles", role));
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Tokens:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var accessTokenDuration = int.Parse(_config["Tokens:AccessTokenDuration"]);

            var token = new JwtSecurityToken(
                issuer: _config["Tokens:Issuer"],
                audience: _config["Tokens:Audience"],
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddMinutes(accessTokenDuration),
                //expires: DateTime.UtcNow.AddSeconds(30),
                signingCredentials: creds);


            return new TokenModel
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                FullName = user.FullName,
                AccessToken = new JwtSecurityTokenHandler().WriteToken(token)
            };
        }
    }
}
