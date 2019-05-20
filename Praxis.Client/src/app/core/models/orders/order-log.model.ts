export class OrderLogModel {
  orderLogId: number;
  orderId: number;
  oldStatus: number;
  newStatus: number;
  changeDate: Date;
  notes: string;
  customerNotified: boolean;
  newStatusName: string;
}
