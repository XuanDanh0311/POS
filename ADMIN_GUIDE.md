# Hướng dẫn sử dụng Admin Dashboard

## Tổng quan
Trang Admin Dashboard cung cấp đầy đủ tính năng quản lý sản phẩm và thống kê doanh số cho hệ thống POS.

## Truy cập
- URL: `http://localhost:3001/admin.html`
- Hoặc click vào link "Admin" từ trang chính

## Các tính năng chính

### 1. Dashboard (Bảng điều khiển)
Hiển thị tổng quan về hoạt động kinh doanh:

#### Thống kê tổng quan:
- **Completed Orders**: Số đơn hàng đã hoàn thành
- **Pending Orders**: Số đơn hàng đang chờ xử lý
- **Total Revenue**: Tổng doanh thu
- **Total Products**: Tổng số sản phẩm

#### Biểu đồ:
- **Daily Sales**: Doanh số theo ngày (7 ngày gần nhất)
- **Top Selling Products**: Top 5 sản phẩm bán chạy nhất

### 2. Products (Quản lý sản phẩm)

#### Thêm sản phẩm mới:
1. Click nút "Add Product"
2. Điền thông tin:
   - **Product Name**: Tên sản phẩm
   - **Price**: Giá bán
   - **Category**: Danh mục (Food/Drinks/Snacks)
   - **Stock**: Số lượng tồn kho
   - **Product Image**: Hình ảnh sản phẩm (tùy chọn)
3. Click "Save Product"

#### Chỉnh sửa sản phẩm:
1. Click nút "Edit" trên sản phẩm cần sửa
2. Thay đổi thông tin cần thiết
3. Click "Save Product"

#### Xóa sản phẩm:
1. Click nút "Delete" trên sản phẩm cần xóa
2. Xác nhận xóa

#### Tìm kiếm và lọc:
- **Search**: Tìm kiếm theo tên sản phẩm
- **Category Filter**: Lọc theo danh mục
- **Clear**: Xóa bộ lọc

### 3. Sales Analytics (Phân tích doanh số)

#### Biểu đồ doanh số:
- **Daily Sales**: Doanh số theo ngày
- **Weekly Sales**: Doanh số theo tuần
- **Monthly Sales**: Doanh số theo tháng

## API Endpoints

### Analytics API:
- `GET /api/analytics/dashboard` - Thống kê tổng quan
- `GET /api/analytics/sales?period=day|week|month` - Doanh số theo thời gian
- `GET /api/analytics/top-products?limit=10` - Top sản phẩm bán chạy
- `GET /api/analytics/customers` - Thống kê khách hàng
- `GET /api/analytics/categories` - Thống kê theo danh mục
- `GET /api/analytics/revenue-trends?days=30` - Xu hướng doanh thu

### Products API:
- `GET /api/products` - Lấy danh sách sản phẩm
- `POST /api/products` - Thêm sản phẩm mới
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm
- `GET /api/products/:id/image` - Lấy hình ảnh sản phẩm

## Cấu trúc dữ liệu

### Product:
```json
{
  "id": 1,
  "name": "Product Name",
  "price": 10.99,
  "category": "food",
  "stock": 100,
  "image": "base64_image_data"
}
```

### Analytics Data:
```json
{
  "period": "2024-01-15",
  "order_count": 25,
  "total_revenue": 1250.50,
  "average_order_value": 50.02,
  "unique_customers": 20
}
```

## Lưu ý quan trọng

1. **Hình ảnh sản phẩm**: Hỗ trợ upload file ảnh, sẽ được chuyển đổi thành base64 và lưu vào database
2. **Thống kê thời gian thực**: Dữ liệu được cập nhật theo thời gian thực từ database
3. **Bảo mật**: Trang admin không có authentication, nên chỉ sử dụng trong môi trường development
4. **Performance**: Các biểu đồ sử dụng Chart.js để hiển thị dữ liệu một cách trực quan

## Troubleshooting

### Lỗi thường gặp:
1. **Không load được dữ liệu**: Kiểm tra kết nối database và API endpoints
2. **Biểu đồ không hiển thị**: Kiểm tra console để xem lỗi JavaScript
3. **Upload ảnh lỗi**: Kiểm tra kích thước file và định dạng ảnh

### Debug:
- Mở Developer Tools (F12) để xem console logs
- Kiểm tra Network tab để xem API calls
- Kiểm tra database connection trong server logs 