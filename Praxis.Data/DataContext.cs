using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Praxis.Entities;
using Praxis.Entities.Identity;
using Praxis.Entities.Order;
using Praxis.Entities.Product;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Praxis.Data
{
    public class DataContext : IdentityDbContext<ApplicationUser>, IDataContext
    {

        public DbSet<Product> Products { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<OrderLog> OrderLogs { get; set; }

        public DataContext(DbContextOptions options, Claim identity) : base(options)
        {
            Database.SetCommandTimeout(int.MaxValue);
        }

        public DataContext(DbContextOptions options) : base(options)
        {
            Database.SetCommandTimeout(int.MaxValue);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ApplicationUser>(entity => {
                entity.HasIndex(e => e.Email).IsUnique();
            });

            base.OnModelCreating(modelBuilder);
        }

        public async Task<int> SaveChangesAsync()
        {
            var addedEntities = ChangeTracker.Entries()
                .Where(i => i.State == EntityState.Added)
                .Where(i => i.Entity is EntityBase);

            foreach (var entity in addedEntities)
            {
                if (((EntityBase)entity.Entity).Status == default(int))
                {
                    ((EntityBase)entity.Entity).Status = Status.Active;
                }
            }


            return await base.SaveChangesAsync();
        }

        public void SetModified(object entity)
        {
            Entry(entity).State = EntityState.Modified;
        }
    }
}
