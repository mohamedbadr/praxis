using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Praxis.Entities.Order
{
    public class OrderLog
    {
        public int OrderLogId { get; set; }

        public int OrderId { get; set; }

        public OrderStatus OldStatus { get; set; }

        public OrderStatus NewStatus { get; set; }

        public DateTime ChangeDate { get; set; }

        public string Notes { get; set; }

        public bool CustomerNotified { get; set; }

        [NotMapped]
        public string NewStatusName => NewStatus.ToString();

        public  virtual  Order Order { get; set; }
    }
}
