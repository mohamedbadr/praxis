using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Praxis.Data.Migrations
{
    public partial class SeedRoles : Migration
    {
        readonly List<string> _roles = new List<string>
        {
            "Company",
            "Customer"
        };

        protected override void Up(MigrationBuilder migrationBuilder)
        {
            foreach (var role in _roles)
            {
                migrationBuilder.Sql($"insert into dbo.AspNetRoles ( Id, ConcurrencyStamp, Name, NormalizedName) values ('{Guid.NewGuid()}', LOWER(NEWID()), '{role}', '{role.ToUpper()}');");
            }
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("Delete from dbo.AspNetRoles");
        }
    }
}
