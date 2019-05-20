using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Praxis.Entities.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Internal;
using Enumerable = System.Linq.Enumerable;

namespace Praxis.Entities.Order
{
    public class Order : EntityBase
    {
        public int OrderId { get; set; }

        [Required, StringLength(450)]
        [ForeignKey(nameof(Customer))]
        public string CustomerId { get; set; }

        [Required, StringLength(450)]
        [ForeignKey(nameof(Company))]
        public string CompanyId { get; set; }

        public  bool CompanyNotified { get; set; }

        [NotMapped]
        public string CompanyName => Company?.FullName;

        [NotMapped]
        public string CustomerName => Customer?.FullName;

        [NotMapped]
        public string OrderStatusName => OrderStatus.ToString();

        [NotMapped]
        public decimal TotalPrice
        {
            get
            {
                decimal total = 0;
                if (Items != null && Items.Any())
                {
                    total += Enumerable.Sum(Enumerable.Where(Items, item => item.Product != null), item => item.Product.Price * item.Quantity);
                }

                return total;
            }
        }

        public DateTime OrderDate { get; set; }

        public OrderStatus OrderStatus { get; set; }

        public virtual ApplicationUser Customer { get; set; }
        public virtual ApplicationUser Company { get; set; }
        public virtual ICollection<OrderItem> Items { get; set; }
        public virtual ICollection<OrderLog> Logs { get; set; }


    }
}
