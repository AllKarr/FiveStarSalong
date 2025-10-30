export interface User {
  _id?: string;
  email: string;
  name: string;
  surname: string;
  password: string;
  role: "user" | "admin" | "moderator";
  address?: string;
  phone?: string;
  flagged?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
