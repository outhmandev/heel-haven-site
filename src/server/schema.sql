CREATE DATABASE IF NOT EXISTS heel_haven;
USE heel_haven;

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  images JSON,
  category ENUM('men', 'women'),
  sizes JSON,
  featured BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  phone VARCHAR(20),
  product_name VARCHAR(255),
  size VARCHAR(50),
  address TEXT,
  shipping_name VARCHAR(255) NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_phone VARCHAR(20) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'shipped', 'delivered') DEFAULT 'pending',
  items JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (id, name, description, price, images, category, sizes, featured) VALUES
('1', 'Classic Oxford', 'Timeless leather Oxford shoes with a polished finish. Perfect for formal occasions and business settings. Crafted from premium full-grain leather with a comfortable cushioned insole.', 189.00, '["https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&h=600&fit=crop"]', 'men', '[40, 41, 42, 43, 44, 45]', true),
('2', 'Urban Runner', 'Lightweight running sneakers with responsive cushioning. Engineered mesh upper for breathability and a sleek modern silhouette that transitions from gym to street.', 129.00, '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop"]', 'men', '[40, 41, 42, 43, 44, 45, 46]', true),
('3', 'Chelsea Boot', 'Sleek suede Chelsea boots with elastic side panels. A versatile wardrobe staple that pairs well with both casual and smart outfits. Pull-on style for easy wear.', 219.00, '["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&h=600&fit=crop"]', 'men', '[40, 41, 42, 43, 44, 45]', false),
('4', 'Canvas Slip-On', 'Casual canvas slip-on shoes for everyday comfort. Lightweight construction with a padded collar and flexible rubber outsole. Available in classic neutral tones.', 69.00, '["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=600&fit=crop"]', 'men', '[40, 41, 42, 43, 44, 45]', false),
('5', 'Leather Loafer', 'Premium leather loafers with a refined silhouette. Hand-stitched details and a flexible sole for all-day comfort. The perfect dress-casual shoe.', 159.00, '["https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&h=600&fit=crop"]', 'men', '[40, 41, 42, 43, 44]', false),
('6', 'Elegant Stiletto', 'Classic pointed-toe stiletto heels in premium leather. A statement piece for evening events and formal occasions. Features a comfortable padded footbed.', 199.00, '["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=600&fit=crop"]', 'women', '[36, 37, 38, 39, 40, 41]', true),
('7', 'Minimalist Sneaker', 'Clean white leather sneakers with a minimalist design. Premium leather upper with a comfortable foam insole. Pairs perfectly with everything from jeans to dresses.', 139.00, '["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop"]', 'women', '[36, 37, 38, 39, 40, 41]', true),
('8', 'Ankle Bootie', 'Chic suede ankle boots with a block heel. Versatile enough for both casual and dressed-up looks. Side zip closure for easy on and off.', 179.00, '["https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=600&fit=crop"]', 'women', '[36, 37, 38, 39, 40]', false),
('9', 'Strappy Sandal', 'Elegant strappy sandals with a mid-height heel. Soft leather straps with an adjustable ankle buckle. Perfect for summer events and warm-weather occasions.', 119.00, '["https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&h=600&fit=crop"]', 'women', '[36, 37, 38, 39, 40, 41]', false),
('10', 'Ballet Flat', 'Classic ballet flats in soft nappa leather. Timeless elegance meets everyday comfort with a cushioned insole and flexible sole. A wardrobe essential.', 99.00, '["https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=600&fit=crop"]', 'women', '[36, 37, 38, 39, 40]', false)
ON DUPLICATE KEY UPDATE name=VALUES(name);
