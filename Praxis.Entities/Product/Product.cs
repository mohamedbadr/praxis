using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Praxis.Entities.Identity;

namespace Praxis.Entities.Product
{
    public class Product : EntityBase
    {
        public int ProductId { get; set; }

        [Required, StringLength(450)]
        public string CompanyId { get; set; }

        [Required, StringLength(10)]
        public string ProductCode { get; set; }

        [Required, StringLength(100)]
        public string ProductName { get; set; }

        [Required]
        public decimal Price { get; set; }

        public  virtual ICollection<ProductImage> Images { get; set; }
        public  virtual ApplicationUser Company { get; set; }
    }
}
