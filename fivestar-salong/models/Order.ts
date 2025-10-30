export interface Order {
  _id?: string;
  user: string;        // user ID
  product: string;     // product ID
  quantity: number;
  totalPrice: number;
  paymentMethod: string;
  deliveryMethod: string;
  status: "pending" | "completed" | "refunded";
  purchasedAt: Date;
}
