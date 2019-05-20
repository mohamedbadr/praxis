using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Praxis.Data;
using Praxis.Entities;
using Praxis.Entities.Product;

namespace Praxis.Service
{
    public class ProductService : ServiceBase
    {
        private const int PageSize = 10;

        public ProductService(IDataContextFactory dataContextFactory) : base(dataContextFactory)
        {
        }

        public async Task<IEnumerable<Product>> GetAllProducts(int page)
        {
            using (var dc = DataContext())
            {
                return await dc.Products
                    .Include(i => i.Images)
                    .Where(i => i.Status == Status.Active)
                    .OrderBy(i => i.ProductId)
                    .Skip(page * PageSize)
                    .Take(PageSize)
                    .ToListAsync();
            }
        }

        public async Task<IEnumerable<Product>> GetProductsByCompany(string companyId, int page)
        {
            using (var dc = DataContext())
            {
                return await dc.Products
                    .Include(i => i.Images)
                    .Where(i => i.Status == Status.Active)
                    .Where(i => i.CompanyId == companyId)
                    .OrderBy(i => i.ProductId)
                    .Skip(page * PageSize)
                    .Take(PageSize)
                    .ToListAsync();
            }
        }

        public async Task<Product> GetProductById(int productId)
        {
            using (var dc = DataContext())
            {
                return await dc.Products
                    .Include(i => i.Images)
                    .Where(i => i.Status == Status.Active)
                    .SingleOrDefaultAsync(i => i.ProductId == productId);
            }
        }

        public async Task<Product> GetProductForEdit(int productId)
        {
            using (var dc = DataContext())
            {
                return await dc.Products
                    .Where(i => i.Status == Status.Active)
                    .SingleOrDefaultAsync(i => i.ProductId == productId);
            }
        }

        public async Task<Product> AddProduct(Product product)
        {
            using (var dc = DataContext())
            {
                dc.Products.Add(product);
                await dc.SaveChangesAsync();
                return product;
            }
        }

        public async Task<Product> SaveProduct(Product product)
        {
            using (var dc = DataContext())
            {
                dc.SetModified(product);
                await dc.SaveChangesAsync();
                return product;
            }
        }

        public async Task AddProductImage(ProductImage image)
        {
            using (var dc = DataContext())
            {
                dc.ProductImages.Add(image);
                await dc.SaveChangesAsync();
            }
        }

        public async Task DeleteProductImage(int imageId)
        {
            using (var dc = DataContext())
            {
                var image = await dc.ProductImages.SingleOrDefaultAsync(i => i.ProductImageId == imageId);
                if (image == null)
                {
                    return;
                }

                dc.ProductImages.Remove(image);
                await dc.SaveChangesAsync();
            }
        }

        public async Task DeleteProduct(int productId)
        {
            using (var dc = DataContext())
            {
                var product = await dc.Products.SingleOrDefaultAsync(i => i.ProductId == productId);
                if (product == null)
                {
                    return;
                }

                product.Status = Status.Deleted;
                await dc.SaveChangesAsync();
            }
        }

    }
}
