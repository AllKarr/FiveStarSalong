export interface Review {
  _id?: string;
  user: string;     // user ID
  product: string;  // product ID
  rating: number;
  comment: string;
  approved?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
