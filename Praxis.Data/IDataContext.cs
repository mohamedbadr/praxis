using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Praxis.Entities.Order;
using Praxis.Entities.Product;

namespace Praxis.Data
{
    public interface IDataContext : IDisposable
    {
        DbSet<Product> Products { get; set; }
        DbSet<ProductImage> ProductImages { get; set; }
        DbSet<Order> Orders { get; set; }
        DbSet<OrderItem> OrderItems { get; set; }
        DbSet<OrderLog> OrderLogs { get; set; }

        Task<int> SaveChangesAsync();

        void SetModified(object entity);
    }
}
