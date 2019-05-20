using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Praxis.Api.Attributes;
using Praxis.Api.Models.Orders;
using Praxis.Data;
using Praxis.Entities.Identity;
using Praxis.Entities.Order;
using Praxis.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Praxis.Api.Hub;

namespace Praxis.Api.Controllers
{
    [Route("api/orders")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    [AuthorizeRole(Role.Customer)]
    public class CustomersController : BaseController
    {
        private readonly ProductService _productService;
        private readonly OrderService _orderService;
        private IHubContext<NotifyHub, ITypedHubClient> _hubContext;

        public CustomersController(
            IDataContextFactory dataContextFactory,
            ProductService productService,
            OrderService orderService,
            IHubContext<NotifyHub, ITypedHubClient> hubContext) : base(dataContextFactory)
        {
            _productService = productService;
            _orderService = orderService;
            _hubContext = hubContext;
        }

        [HttpGet("~/api/products/page/{page:int}")]
        public async Task<IActionResult> GetAllProducts([FromRoute] int page)
        {
            var products = await _productService.GetAllProducts(page);
            return Ok(products);
        }

        [HttpPost("")]
        public async Task<IActionResult> AddOrder(List<OrderItemModel> items)
        {
            var companies = items.Select(i => i.CompanyId).Distinct();
            var customerId = items[0].CustomerId;

            foreach (var company in companies)
            {
                var orderItems = items.Where(i => i.CompanyId == company);

                var order = new Order
                {
                    CompanyId = company,
                    CustomerId = customerId,
                    OrderDate = DateTime.Now,
                    OrderStatus = OrderStatus.New,
                    Items = orderItems.Select(i => new OrderItem
                    {
                        ProductId = i.ProductId,
                        Quantity = i.Quantity
                    }).ToList()
                };

                 await _orderService.AddOrder(order);
            }

            await _hubContext.Clients.All.CompanyMessage();
            return Ok(true);
        }

        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetOrdersByCustomer([FromRoute] string customerId)
        {
            var orders = await _orderService.GetOrderByCustomer(customerId);
            return Ok(orders.Select(i => new OrderModel
            {
                OrderId = i.OrderId,
                CompanyName = i.Company.FullName,
                ItemsCount = i.Items.Count,
                OrderDate = i.OrderDate,
                OrderStatus = i.OrderStatus,
                OrderStatusName = i.OrderStatus.ToString()
            }));
        }

        [HttpGet("~/api/customer-order/{orderId:int}")]
        public async Task<IActionResult> GetOrderById([FromRoute]int orderId)
        {
            var order = await _orderService.GetOrderById(orderId);
            await _orderService.SetOrderAsCustomerNotified(orderId);
            return Ok(order);
        }

        [HttpGet("customer-notifications/{customerId}")]
        public async Task<IActionResult> GetCustomerNotifications([FromRoute]string customerId)
        {
            var logs = await _orderService.GetCustomerNotifications(customerId);
            return Ok(logs);
        }
    }
}