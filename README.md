# Restro POS System

Hệ thống Point of Sale (POS) hoàn chỉnh cho nhà hàng với quản lý sản phẩm, đơn hàng và thống kê doanh số.

## Tính năng chính

### 🛒 POS System (Trang bán hàng)
- Giao diện bán hàng trực quan
- Tìm kiếm sản phẩm nhanh chóng
- Quản lý giỏ hàng
- Tính tiền và xuất hóa đơn
- Lưu đơn hàng vào database

### 📊 Admin Dashboard (Trang quản trị)
- **Dashboard**: Thống kê tổng quan doanh số
- **Products Management**: Thêm, sửa, xóa sản phẩm
- **Sales Analytics**: Phân tích doanh số theo ngày/tuần/tháng
- **Image Management**: Upload và quản lý hình ảnh sản phẩm

### 📋 Orders Management (Quản lý đơn hàng)
- Xem danh sách tất cả đơn hàng
- Lọc và tìm kiếm đơn hàng
- Cập nhật trạng thái đơn hàng
- Thống kê chi tiết

## Cài đặt và chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình database
- Tạo file `.env` từ `.env.example`
- Cấu hình thông tin MySQL database
- Import database schema từ `database_orders.sql`

### 3. Chạy server
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3001`

## Cấu trúc thư mục

```
POS/
├── public/
│   ├── index.html          # Trang POS chính
│   ├── admin.html          # Trang Admin Dashboard
│   └── orders.html         # Trang quản lý đơn hàng
├── routes/
│   ├── products.js         # API quản lý sản phẩm
│   ├── orders.js           # API quản lý đơn hàng
│   ├── analytics.js        # API thống kê doanh số
│   ├── users.js            # API quản lý người dùng
│   └── health.js           # API kiểm tra sức khỏe
├── server.js               # Server chính
├── db.js                   # Kết nối database
└── README.md               # Hướng dẫn này
```

## API Endpoints

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `POST /api/products` - Thêm sản phẩm mới
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm
- `GET /api/products/:id/image` - Lấy hình ảnh sản phẩm

### Orders
- `GET /api/orders` - Lấy danh sách đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới
- `PUT /api/orders/:id` - Cập nhật đơn hàng
- `DELETE /api/orders/:id` - Xóa đơn hàng
- `GET /api/orders/stats` - Thống kê đơn hàng

### Analytics
- `GET /api/analytics/dashboard` - Thống kê tổng quan
- `GET /api/analytics/sales` - Doanh số theo thời gian
- `GET /api/analytics/top-products` - Top sản phẩm bán chạy
- `GET /api/analytics/customers` - Thống kê khách hàng
- `GET /api/analytics/revenue-trends` - Xu hướng doanh thu

## Truy cập các trang

### 1. POS System (Bán hàng)
- URL: `http://localhost:3001`
- Chức năng: Bán hàng, tạo đơn hàng

### 2. Admin Dashboard (Quản trị)
- URL: `http://localhost:3001/admin.html`
- Chức năng: Quản lý sản phẩm, thống kê doanh số

### 3. Orders Management (Quản lý đơn hàng)
- URL: `http://localhost:3001/orders.html`
- Chức năng: Xem và quản lý đơn hàng

## Tính năng nổi bật

### 🖼️ Quản lý hình ảnh sản phẩm
- Upload ảnh trực tiếp từ trang admin
- Lưu trữ dưới dạng base64 trong database
- Hiển thị ảnh động trong POS và admin

### 📈 Thống kê chi tiết
- Doanh số theo ngày/tuần/tháng
- Top sản phẩm bán chạy
- Thống kê khách hàng
- Xu hướng doanh thu

### 🔍 Tìm kiếm và lọc
- Tìm kiếm sản phẩm theo tên
- Lọc theo danh mục
- Tìm kiếm đơn hàng theo nhiều tiêu chí

### 📱 Responsive Design
- Giao diện tương thích mobile
- Layout thích ứng với mọi kích thước màn hình

## Database Schema

### Bảng Products
```sql
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    stock INT DEFAULT 0,
    image LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bảng Orders
```sql
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    total DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled', 'held') DEFAULT 'pending',
    items_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bảng Order_Items
```sql
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    product_name VARCHAR(255),
    quantity INT,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

## Hướng dẫn sử dụng

### Quản lý sản phẩm
1. Truy cập trang Admin Dashboard
2. Chọn tab "Products"
3. Sử dụng các chức năng:
   - **Add Product**: Thêm sản phẩm mới
   - **Edit**: Chỉnh sửa thông tin sản phẩm
   - **Delete**: Xóa sản phẩm
   - **Search**: Tìm kiếm sản phẩm

### Xem thống kê doanh số
1. Truy cập trang Admin Dashboard
2. Chọn tab "Sales Analytics"
3. Xem các biểu đồ:
   - Doanh số theo ngày
   - Doanh số theo tuần
   - Doanh số theo tháng

### Quản lý đơn hàng
1. Truy cập trang Orders Management
2. Sử dụng các chức năng:
   - Xem danh sách đơn hàng
   - Lọc theo trạng thái
   - Cập nhật trạng thái
   - Xem chi tiết đơn hàng

## Troubleshooting

### Lỗi thường gặp
1. **Không kết nối được database**: Kiểm tra cấu hình MySQL và file .env
2. **Không load được ảnh**: Kiểm tra quyền truy cập thư mục images
3. **API lỗi 500**: Kiểm tra console server để xem lỗi chi tiết

### Debug
- Mở Developer Tools (F12) để xem console logs
- Kiểm tra Network tab để xem API calls
- Xem server logs trong terminal

## Đóng góp

Để đóng góp vào dự án:
1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## License

MIT License - xem file LICENSE để biết thêm chi tiết. 