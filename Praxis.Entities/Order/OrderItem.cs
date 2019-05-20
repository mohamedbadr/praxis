using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Praxis.Entities.Order
{
    public class OrderItem
    {
        [Key]
        public int OrderItemId { get; set; }

        [ForeignKey(nameof(Order))]
        public int OrderId { get; set; }

        public int ProductId { get; set; }

        public int Quantity { get; set; }

        [NotMapped]
        public string ProductName => Product?.ProductName;

        [NotMapped]
        public decimal? Price => Product?.Price;


        [NotMapped]
        public string ImageUrl => Product?.Images != null && Product.Images.Any() ? Product.Images.First().ImageUrl : null;

        public virtual Product.Product Product { get; set; }
        public virtual Order Order { get; set; }
    }
}
