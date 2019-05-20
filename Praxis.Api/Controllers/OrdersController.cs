using System;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Praxis.Data;
using Praxis.Service;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Praxis.Api.Attributes;
using Praxis.Api.Hub;
using Praxis.Api.Models.Orders;
using Praxis.Entities.Identity;
using Praxis.Entities.Order;

namespace Praxis.Api.Controllers
{
    [Route("api/orders")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    [AuthorizeRole(Role.Company)]
    public class OrdersController : BaseController
    {
        private readonly OrderService _orderService;
        private IHubContext<NotifyHub, ITypedHubClient> _hubContext;

        public OrdersController(
            IDataContextFactory dataContextFactory,
            OrderService orderService,
            IHubContext<NotifyHub, ITypedHubClient> hubContext) : base(dataContextFactory)
        {
            _orderService = orderService;
            _hubContext = hubContext;
        }

        [HttpGet("{companyId}")]
        [AuthorizeRole(Role.Company)]
        public async Task<IActionResult> GetOrdersByCompany([FromRoute]string companyId,[FromQuery] int status)
        {
            var orders = await _orderService.GetOrderByCompany(companyId, (OrderStatus)status);
            return Ok(orders.Select(i=> new OrderModel
            {
                OrderId = i.OrderId,
                CustomerName = i.Customer.FullName,
                ItemsCount = i.Items.Count,
                OrderDate = i.OrderDate,
                OrderStatus = i.OrderStatus,
                OrderStatusName = i.OrderStatus.ToString()
            }));
        }

        [HttpGet("{orderId:int}")]
        public async Task<IActionResult> GetOrderById([FromRoute] int orderId)
        {
            var order = await _orderService.GetOrderById(orderId);
            await _orderService.SetOrderAsCompanyNotified(orderId);
            return Ok(order);
        }

        [HttpPost("log")]
        public async Task<IActionResult> AddOrderLog(OrderLog log)
        {
            log.ChangeDate = DateTime.Now;
            log.CustomerNotified = false;

            await _orderService.UpdateOrderStatus(log.OrderId, log.NewStatus);
            await _orderService.AddOrderLog(log);

            await _hubContext.Clients.All.CustomerMessage();
            return Ok(true);
        }

        [HttpGet("company-notifications/{companyId}")]
        public async Task<IActionResult> GetCompanyNotifications([FromRoute]string companyId)
        {
            var orders = await _orderService.GetCompanyNotifications(companyId);
            return Ok(orders);
        }
    }
}