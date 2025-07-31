# Quick Start Guide - Hình ảnh từ Database

## 🚀 Khởi chạy nhanh

### 1. Khởi động server
```bash
node server.js
```

### 2. Truy cập ứng dụng
- **POS System**: http://localhost:3000/pos.html
- **Admin Panel**: http://localhost:3000/admin.html

## 🖼️ Test tính năng hình ảnh

### Bước 1: Kiểm tra dữ liệu mẫu
1. Truy cập http://localhost:3000/admin.html
2. Xem danh sách sản phẩm có sẵn
3. Kiểm tra hình ảnh hiển thị

### Bước 2: Thêm sản phẩm mới với hình ảnh
1. Click "Add Product" trong admin panel
2. Điền thông tin sản phẩm
3. Chọn file hình ảnh (JPG, PNG, GIF)
4. Xem preview hình ảnh
5. Click "Save Product"

### Bước 3: Test POS interface
1. Truy cập http://localhost:3000/pos.html
2. Xem hình ảnh sản phẩm hiển thị
3. Test tìm kiếm và lọc sản phẩm

## 🔧 API Testing

### Test endpoint hình ảnh
```bash
# Lấy hình ảnh sản phẩm ID 1
curl http://localhost:3000/api/products/1/image

# Lấy thông tin sản phẩm
curl http://localhost:3000/api/products/1
```

### Test upload hình ảnh
```bash
# Tạo sản phẩm mới với hình ảnh base64
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 9.99,
    "category": "food",
    "stock": 10,
    "image": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSIjRkY2QjAwIi8+Cjwvc3ZnPgo="
  }'
```

## 📊 Kiểm tra Database

### Xem dữ liệu hình ảnh
```sql
-- Kết nối MySQL
mysql -u root -p posdb

-- Xem sản phẩm và hình ảnh
SELECT id, name, category, 
       CASE 
         WHEN image IS NOT NULL THEN 'Has Image'
         ELSE 'No Image'
       END as image_status,
       LENGTH(image) as image_size
FROM products;
```

### Thêm hình ảnh test
```sql
-- Cập nhật sản phẩm với hình ảnh SVG đơn giản
UPDATE products 
SET image = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSIjRkY2QjAwIi8+Cjwvc3ZnPgo=' 
WHERE id = 1;
```

## 🐛 Troubleshooting

### Hình ảnh không hiển thị
1. **Kiểm tra console browser**: F12 → Console
2. **Kiểm tra Network tab**: Xem request đến `/api/products/:id/image`
3. **Kiểm tra database**: Xem trường `image` có dữ liệu không

### Lỗi API
1. **Kiểm tra server logs**: Xem terminal chạy server
2. **Test endpoint trực tiếp**: Sử dụng curl hoặc Postman
3. **Kiểm tra database connection**: Xem file `db.js`

### Upload không hoạt động
1. **Kiểm tra file size**: Hình ảnh quá lớn có thể gây lỗi
2. **Kiểm tra format**: Chỉ hỗ trợ JPG, PNG, GIF, WebP
3. **Kiểm tra browser console**: Xem lỗi JavaScript

## 📝 Ghi chú quan trọng

- **Base64 size**: Hình ảnh base64 sẽ lớn hơn file gốc ~33%
- **Database performance**: Lưu trữ base64 có thể ảnh hưởng hiệu suất với nhiều hình ảnh lớn
- **Cache**: Hình ảnh được cache 1 năm để tối ưu hiệu suất
- **Fallback**: Nếu không có hình ảnh, hiển thị `/images/default.jpg`

## 🎯 Next Steps

1. **Tối ưu hình ảnh**: Thêm tính năng resize tự động
2. **CDN**: Sử dụng CDN cho hình ảnh lớn
3. **Compression**: Nén hình ảnh trước khi lưu
4. **Thumbnails**: Tạo thumbnail cho danh sách sản phẩm 

---

## **Cách xóa sạch icon mẫu và chỉ giữ hình bạn upload**

### **Cách 1: Xóa thủ công bằng phpMyAdmin**
1. Vào **phpMyAdmin** (http://localhost/phpmyadmin).
2. Chọn database `posdb`.
3. Chọn bảng `products`.
4. **Chọn tất cả sản phẩm** (tick chọn tất cả dòng).
5. Nhấn **Delete** (Xóa) để xóa sạch mọi sản phẩm mẫu/icon.
6. Sau đó, **thêm lại sản phẩm mới** qua giao diện, chọn đúng ảnh bạn muốn.

### **Cách 2: Chạy lệnh SQL trực tiếp trong phpMyAdmin**
1. Vào tab **SQL** trong phpMyAdmin.
2. Dán lệnh sau và nhấn **Go**:
   ```sql
   DELETE FROM products;
   ALTER TABLE products AUTO_INCREMENT = 1;
   ```
3. Sau đó, thêm lại sản phẩm mới qua giao diện.

---

## **Sau khi xóa xong:**
- **Chỉ sản phẩm bạn tự thêm 