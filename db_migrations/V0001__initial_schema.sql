-- Создание таблицы категорий
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    icon_name VARCHAR(100),
    product_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы товаров
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    article VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(5, 2) DEFAULT 0,
    image_url TEXT,
    category_id INTEGER REFERENCES categories(id),
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы заказов
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    delivery_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы элементов заказа
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка начальных категорий
INSERT INTO categories (name, slug, icon_name, product_count) VALUES
    ('Распродажа', 'sale', 'Tag', 1905),
    ('Ходовые товары', 'popular', 'Star', 145),
    ('Стандартные запчасти', 'standard', 'Settings', 4882),
    ('Кузовные детали', 'body', 'Box', 1521),
    ('Внешний тюнинг', 'exterior', 'Sparkles', 3727),
    ('Тюнинг салона', 'interior', 'Armchair', 2582),
    ('Двигатель', 'engine', 'Cog', 1637),
    ('Выхлопная система', 'exhaust', 'Wind', 1021)
ON CONFLICT (slug) DO NOTHING;

-- Создание админа по умолчанию (пароль: admin123)
INSERT INTO users (username, password_hash, email, is_admin) VALUES
    ('admin', '$2b$10$rKvVXhYOqB5tYgUGV7HVHuXF0bQvKW.dXkZF9YXqLY1iYY5E5mYCm', 'carfix100122@yandex.ru', TRUE)
ON CONFLICT (username) DO NOTHING;