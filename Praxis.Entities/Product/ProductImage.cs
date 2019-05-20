using System.ComponentModel.DataAnnotations;

namespace Praxis.Entities.Product
{
    public class ProductImage
    {
        public int ProductImageId { get; set; }

        [Required]
        public int ProductId { get; set; }

        public string Description { get; set; }

        public string ImageUrl { get; set; }

        public  virtual  Product Product { get; set; }
    }
}
