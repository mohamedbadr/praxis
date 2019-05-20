namespace Praxis.Api.Models.Orders
{
    public class OrderItemModel
    {
        public int ProductId { get; set; }

        public int Quantity { get; set; }

        public string CompanyId { get; set; }

        public string CustomerId { get; set; }
    }
}
