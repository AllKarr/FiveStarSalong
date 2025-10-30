export interface Product {
  _id?: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  reviews?: string[]; // review IDs
  averageRating?: number;
  createdAt: Date;
  updatedAt: Date;
}
