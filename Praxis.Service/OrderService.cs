using Microsoft.EntityFrameworkCore;
using Praxis.Data;
using Praxis.Entities;
using Praxis.Entities.Order;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Praxis.Service
{
    public class OrderService : ServiceBase
    {
        public OrderService(IDataContextFactory dataContextFactory) : base(dataContextFactory)
        {
        }

        public async Task<IEnumerable<Order>> GetOrderByCompany(string companyId, OrderStatus status)
        {
            using (var dc = DataContext())
            {
                var query = dc.Orders
                    .Include(i => i.Customer)
                    .Include(i => i.Items)
                    .Where(i => i.CompanyId == companyId)
                    .AsQueryable();

                if (status != OrderStatus.All)
                {
                    query = query.Where(i => i.OrderStatus == status);
                }

                return await query.ToListAsync();
            }
        }

        public async Task<IEnumerable<Order>> GetOrderByCustomer(string customerId)
        {
            using (var dc = DataContext())
            {
                return await dc.Orders
                    .Include(i => i.Company)
                    .Include(i => i.Items)
                    .Where(i => i.CustomerId == customerId)
                    .ToListAsync();
            }
        }

        public async Task<Order> GetOrderById(int orderId)
        {
            using (var dc = DataContext())
            {
                return await dc.Orders
                    .Include(i => i.Company)
                    .Include(i => i.Customer)
                    .Include(i => i.Items).ThenInclude(i => i.Product.Images)
                    .SingleOrDefaultAsync(i => i.OrderId == orderId);
            }
        }

        public async Task<Order> AddOrder(Order order)
        {
            using (var dc = DataContext())
            {
                dc.Orders.Add(order);
                await dc.SaveChangesAsync();
                return order;
            }
        }

        public async Task UpdateOrderStatus(int orderId, OrderStatus status)
        {
            using (var dc = DataContext())
            {
                var order = await dc.Orders.SingleOrDefaultAsync(i => i.OrderId == orderId);
                order.OrderStatus = status;
                await dc.SaveChangesAsync();
            }
        }

        public async Task AddOrderLog(OrderLog log)
        {
            using (var dc = DataContext())
            {
                dc.OrderLogs.Add(log);
                await dc.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<OrderLog>> GetCustomerNotifications(string customerId)
        {
            using (var dc = DataContext())
            {
                var orders = await dc.Orders
                    .Include(i => i.Logs)
                    .Where(i => i.CustomerId == customerId)
                    .ToListAsync();

                return orders.SelectMany(i => i.Logs)
                    .Where(i => !i.CustomerNotified);
            }
        }

        public async Task SetOrderAsCustomerNotified(int orderId)
        {
            using ( var dc= DataContext())
            {
                var logs = await dc.OrderLogs
                    .Where(i => i.OrderId == orderId)
                    .Where(i => !i.CustomerNotified)
                    .ToListAsync();

                foreach (var log in logs)
                {
                    log.CustomerNotified = true;
                }

                await dc.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<int>> GetCompanyNotifications(string companyId)
        {
            using (var dc= DataContext())
            {
                return await dc.Orders
                    .Where(i => i.Status == Status.Active)
                    .Where(i => i.CompanyId == companyId)
                    .Where(i => !i.CompanyNotified)
                    .Select(i=>i.OrderId)
                    .ToListAsync();
            }
        }

        public async Task SetOrderAsCompanyNotified(int orderId)
        {
            using (var dc= DataContext())
            {
                var order = await dc.Orders.SingleOrDefaultAsync(i => i.OrderId == orderId);
                order.CompanyNotified = true;
                await dc.SaveChangesAsync();
            }
        }
    }
}
