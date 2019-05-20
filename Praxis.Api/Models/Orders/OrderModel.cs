using Praxis.Entities.Order;
using System;

namespace Praxis.Api.Models.Orders
{
    public class OrderModel
    {
        public int OrderId { get; set; }
        public string CustomerName { get; set; }
        public  string CompanyName { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus OrderStatus { get; set; }
        public  string OrderStatusName { get; set; }
        public int ItemsCount { get; set; }
    }
}
