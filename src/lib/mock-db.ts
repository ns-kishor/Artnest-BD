import mockData from "./mock-store-data.json";
import { hashPassword, verifyPassword } from "./auth";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  passwordHash: string;
  createdAt: Date;
}

export interface MockOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  deliveryArea: string;
  deliveryNote: string | null;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: string;
  items: Array<{
    id: string;
    orderId: string;
    productId: string | null;
    name: string;
    price: number;
    quantity: number;
    image: string | null;
    color: string | null;
  }>;
  createdAt: Date;
}

// In-memory global store to survive hot-reloads and module re-evaluations
const globalStore = globalThis as unknown as {
  __artnest_mock_users?: MockUser[];
  __artnest_mock_orders?: MockOrder[];
  __artnest_mock_messages?: Array<{
    id: string;
    name: string;
    contact: string;
    subject: string;
    message: string;
    createdAt: Date;
  }>;
};

if (!globalStore.__artnest_mock_users) {
  globalStore.__artnest_mock_users = [
    {
      id: "demo-user-1",
      name: "Demo Customer",
      email: "demo@artnest.com",
      phone: "01712345678",
      passwordHash: hashPassword("demo123"),
      createdAt: new Date(),
    },
  ];
}

if (!globalStore.__artnest_mock_orders) {
  globalStore.__artnest_mock_orders = [];
}

if (!globalStore.__artnest_mock_messages) {
  globalStore.__artnest_mock_messages = [];
}

export const mockUsers = globalStore.__artnest_mock_users;
export const mockOrders = globalStore.__artnest_mock_orders;
export const mockMessages = globalStore.__artnest_mock_messages;

export const mockCategories = mockData.categories;
export const mockProducts = mockData.products;
export const mockReviews = mockData.reviews;

export function findMockUserByEmail(email: string): MockUser | undefined {
  const normalized = email.trim().toLowerCase();
  return mockUsers.find((u) => u.email.toLowerCase() === normalized);
}

export function findMockUserById(id: string): MockUser | undefined {
  return mockUsers.find((u) => u.id === id);
}

export function createMockUser(data: {
  name: string;
  email: string;
  phone?: string | null;
  passwordHash: string;
}): MockUser {
  const user: MockUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: data.name,
    email: data.email.trim().toLowerCase(),
    phone: data.phone ?? null,
    passwordHash: data.passwordHash,
    createdAt: new Date(),
  };
  mockUsers.push(user);
  return user;
}
