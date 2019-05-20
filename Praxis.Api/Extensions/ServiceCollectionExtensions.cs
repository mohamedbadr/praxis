using System;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Praxis.Data;
using Praxis.Service;
using Praxis.Web.Configuration;

namespace Praxis.Api.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static AuthenticationBuilder AddJwtAuthentication(this IServiceCollection service, TokenSettings tokenSettings) =>
           service.AddAuthentication()
          .AddJwtBearer(
            cfg =>
            {
                cfg.RequireHttpsMetadata = false;
                cfg.SaveToken = true;
                cfg.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = tokenSettings.Issuer,
                    ValidAudience = tokenSettings.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenSettings.Key)),
                    ValidateIssuerSigningKey = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

        public static IServiceCollection AddBusiness(this IServiceCollection services)
        {

            services.AddSingleton(ctx => new OrderService(ctx.GetService<IDataContextFactory>()));
            services.AddSingleton(ctx => new ProductService(ctx.GetService<IDataContextFactory>()));

            return services;
        }
    }
}
