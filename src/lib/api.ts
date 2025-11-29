const API_BASE = {
  auth: 'https://functions.poehali.dev/9f82582a-b215-49ac-8df1-c2b4963044fe',
  products: 'https://functions.poehali.dev/029d588c-97e4-425e-9377-1faddb06dda4',
  categories: 'https://functions.poehali.dev/b2782d84-67e6-4c75-9d8b-fd595f088173'
};

export interface User {
  id: number;
  username: string;
  is_admin: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon_name: string;
  product_count: number;
  actual_count: number;
}

export interface Product {
  id: number;
  name: string;
  article: string;
  description: string;
  price: number;
  discount: number;
  image_url: string;
  category_id: number;
  stock: number;
  category_name?: string;
}

export const auth = {
  async register(username: string, password: string, email: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch(API_BASE.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', username, password, email })
    });
    return res.json();
  },

  async login(username: string, password: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch(API_BASE.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', username, password })
    });
    return res.json();
  }
};

export const categories = {
  async getAll(): Promise<Category[]> {
    const res = await fetch(API_BASE.categories);
    return res.json();
  }
};

export const products = {
  async getAll(categoryId?: number): Promise<Product[]> {
    const url = categoryId 
      ? `${API_BASE.products}?category_id=${categoryId}`
      : API_BASE.products;
    const res = await fetch(url);
    return res.json();
  },

  async getById(id: number): Promise<Product> {
    const res = await fetch(`${API_BASE.products}?id=${id}`);
    return res.json();
  },

  async create(product: Omit<Product, 'id' | 'category_name'>): Promise<Product> {
    const res = await fetch(API_BASE.products, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return res.json();
  },

  async update(id: number, product: Partial<Product>): Promise<{ success: boolean }> {
    const res = await fetch(API_BASE.products, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...product })
    });
    return res.json();
  }
};
