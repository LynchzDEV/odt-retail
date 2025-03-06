import { Product, Order } from "../types";

// Sample data
export const products: Product[] = [
  {
    id: 1,
    name: "T-Shirt",
    price: 19.99,
    description: "Cotton t-shirt",
    image:
      "https://cdn.ready-market.com.tw/fb484847/Templates/pic/Pet-Plastic-Bottles-Taper-Cone-W280.jpg?v=1a06ff7c",
  },
];

export let orders: Order[] = [];

// Store functions
export function addOrder(order: Omit<Order, "id">): Order {
  const newOrder = {
    ...order,
    id: Math.random().toString(36).substring(2, 15),
  };
  orders.push(newOrder);
  return newOrder;
}

export function getProductById(id: number): Product | undefined {
  return products.find((product) => product.id === id);
}
