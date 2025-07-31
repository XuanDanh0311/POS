-- Tạo bảng orders để lưu thông tin đơn hàng
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    table_number VARCHAR(10),
    status ENUM('pending', 'completed', 'cancelled', 'held') DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax DECIMAL(10,2) NOT NULL DEFAULT 0,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_method ENUM('cash', 'card', 'mobile') DEFAULT 'cash',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng order_items để lưu chi tiết từng item trong đơn hàng
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Tạo index để tối ưu hiệu suất
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Thêm dữ liệu mẫu cho orders
INSERT INTO orders (order_number, customer_name, customer_phone, table_number, status, subtotal, tax, total, payment_method, notes) VALUES
('ORD-2024-001', 'John Doe', '0123456789', 'T01', 'completed', 45.97, 4.60, 50.57, 'cash', 'Extra spicy please'),
('ORD-2024-002', 'Jane Smith', '0987654321', 'T03', 'completed', 32.97, 3.30, 36.27, 'card', 'No onions'),
('ORD-2024-003', 'Mike Johnson', '0555666777', 'T05', 'pending', 28.97, 2.90, 31.87, 'cash', ''),
('ORD-2024-004', 'Sarah Wilson', '0111222333', 'T02', 'held', 15.98, 1.60, 17.58, 'cash', 'Hold for 30 minutes'),
('ORD-2024-005', 'David Brown', '0444555666', 'T04', 'cancelled', 22.97, 2.30, 25.27, 'cash', 'Customer cancelled');

-- Thêm dữ liệu mẫu cho order_items
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price) VALUES
-- Order 1
(1, 1, 'Burger Deluxe', 2, 12.99, 25.98),
(1, 3, 'Cappuccino', 1, 4.99, 4.99),
(1, 5, 'French Fries', 2, 3.99, 7.98),
(1, 6, 'Orange Juice', 1, 2.99, 2.99),
(1, 4, 'Chocolate Cake', 1, 8.99, 8.99),
-- Order 2
(2, 2, 'Pizza Margherita', 1, 15.99, 15.99),
(2, 3, 'Cappuccino', 2, 4.99, 9.98),
(2, 5, 'French Fries', 1, 3.99, 3.99),
(2, 6, 'Orange Juice', 1, 2.99, 2.99),
-- Order 3
(3, 1, 'Burger Deluxe', 1, 12.99, 12.99),
(3, 4, 'Chocolate Cake', 1, 8.99, 8.99),
(3, 6, 'Orange Juice', 2, 2.99, 5.98),
-- Order 4
(4, 2, 'Pizza Margherita', 1, 15.99, 15.98),
-- Order 5
(5, 1, 'Burger Deluxe', 1, 12.99, 12.99),
(5, 5, 'French Fries', 1, 3.99, 3.99),
(5, 6, 'Orange Juice', 2, 2.99, 5.98); 