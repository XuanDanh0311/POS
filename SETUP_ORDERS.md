# Setup Orders Database

## 🗄️ **Import Database Orders**

### Bước 1: Import cấu trúc database
1. Mở **phpMyAdmin** (http://localhost/phpmyadmin)
2. Chọn database **posdb**
3. Vào tab **SQL**
4. Copy và paste nội dung file `database_orders.sql`
5. Click **Go** để thực thi

### Bước 2: Kiểm tra dữ liệu
Sau khi import, bạn sẽ có:
- **Bảng `orders`**: Lưu thông tin đơn hàng
- **Bảng `order_items`**: Lưu chi tiết từng item trong đơn hàng
- **5 đơn hàng mẫu** với đầy đủ thông tin

### Bước 3: Khởi động server
```bash
node server.js
```

### Bước 4: Truy cập trang Orders
- **URL**: http://localhost:3001/orders.html
- **Tính năng**: Xem tất cả đơn hàng, thống kê, quản lý trạng thái

---

## 📊 **Cấu trúc Database**

### Bảng `orders`
```sql
- id: ID tự động tăng
- order_number: Số đơn hàng (unique)
- customer_name: Tên khách hàng
- customer_phone: Số điện thoại
- table_number: Số bàn
- status: Trạng thái (pending/completed/cancelled/held)
- subtotal: Tổng tiền trước thuế
- tax: Thuế (10%)
- total: Tổng tiền sau thuế
- payment_method: Phương thức thanh toán
- notes: Ghi chú
- created_at: Thời gian tạo
- updated_at: Thời gian cập nhật
```

### Bảng `order_items`
```sql
- id: ID tự động tăng
- order_id: ID đơn hàng (foreign key)
- product_id: ID sản phẩm (foreign key)
- product_name: Tên sản phẩm
- quantity: Số lượng
- unit_price: Giá đơn vị
- total_price: Tổng tiền item
- created_at: Thời gian tạo
```

---

## 🔗 **API Endpoints**

### Orders
- `GET /api/orders` - Lấy danh sách đơn hàng
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới
- `PUT /api/orders/:id/status` - Cập nhật trạng thái
- `DELETE /api/orders/:id` - Hủy đơn hàng
- `GET /api/orders/stats/summary` - Thống kê đơn hàng

### Parameters
- `status`: Lọc theo trạng thái
- `search`: Tìm kiếm theo số đơn hàng, tên khách hàng, số điện thoại
- `start_date`, `end_date`: Lọc theo khoảng thời gian
- `page`, `limit`: Phân trang

---

## 🎯 **Tính năng Orders Page**

### 📈 **Thống kê**
- Tổng số đơn hàng hoàn thành
- Số đơn hàng đang chờ
- Số đơn hàng đã hủy
- Tổng doanh thu

### 🔍 **Tìm kiếm & Lọc**
- Tìm kiếm theo số đơn hàng, tên khách hàng, số điện thoại
- Lọc theo trạng thái
- Lọc theo khoảng thời gian

### 📋 **Quản lý đơn hàng**
- Xem chi tiết đơn hàng
- Cập nhật trạng thái
- Hủy đơn hàng
- Phân trang

### 📄 **Chi tiết đơn hàng**
- Thông tin khách hàng
- Danh sách sản phẩm với hình ảnh
- Tính toán giá tiền
- Ghi chú

---

## 🚀 **Cách sử dụng**

### 1. Tạo đơn hàng từ POS
1. Truy cập http://localhost:3001
2. Chọn sản phẩm và thêm vào giỏ hàng
3. Click "Proceed"
4. Nhập thông tin khách hàng (tùy chọn)
5. Đơn hàng sẽ được lưu vào database

### 2. Quản lý đơn hàng
1. Truy cập http://localhost:3001/orders.html
2. Xem danh sách tất cả đơn hàng
3. Click "View" để xem chi tiết
4. Click "Edit" để cập nhật trạng thái
5. Click "Delete" để hủy đơn hàng

### 3. Thống kê
- Xem thống kê tổng quan ở đầu trang
- Lọc theo thời gian để xem báo cáo

---

## 🔧 **Troubleshooting**

### Lỗi import database
- Kiểm tra MySQL đang chạy
- Kiểm tra database `posdb` đã tồn tại
- Kiểm tra quyền truy cập database

### Lỗi API
- Kiểm tra server đang chạy
- Kiểm tra console browser để debug
- Kiểm tra Network tab để xem request/response

### Lỗi hiển thị
- Kiểm tra dữ liệu trong database
- Kiểm tra API endpoints hoạt động
- Refresh trang và thử lại

---

## 📝 **Ghi chú**

- Đơn hàng được tạo với số đơn hàng tự động: `ORD-YYYY-XXXXXX`
- Trạng thái đơn hàng: pending → completed/cancelled/held
- Hủy đơn hàng = soft delete (chỉ đổi trạng thái thành cancelled)
- Tất cả thời gian được lưu theo múi giờ server
- Hình ảnh sản phẩm được lấy từ API `/api/products/:id/image` 

---

### Nguyên nhân phổ biến nhất:
1. **Cơ sở dữ liệu (database) không đúng schema** (thiếu cột, sai kiểu dữ liệu).
2. **Dữ liệu gửi lên không hợp lệ** (ví dụ: thiếu trường bắt buộc, id sản phẩm không tồn tại).
3. **Lỗi ràng buộc khóa ngoại** (product_id không tồn tại trong bảng products).
4. **Lỗi SQL khác** (ví dụ: giá trị NULL cho cột NOT NULL).

---

## **Cách khắc phục nhanh nhất**

### 1. **Kiểm tra log chi tiết ở terminal/server**
- Khi lỗi 500, backend sẽ ghi log chi tiết lỗi SQL ra terminal nơi bạn chạy `
node server.js`.
- Hãy **copy dòng lỗi chi tiết** trong terminal/server gửi lại đây, mình sẽ chỉ rõ nguyên nhân.

---

### 2. **Kiểm tra lại schema database**
- Vào phpMyAdmin, chọn database `posdb`, chạy:
  ```sql
  DESCRIBE orders;
  DESCRIBE order_items;
  ```
- Đảm bảo bảng `orders` có đủ các cột:  
  `order_number`, `customer_name`, `customer_phone`, `table_number`, `subtotal`, `tax`, `total`, `payment_method`, `notes`, ...
- Nếu thiếu, hãy import lại file `database_orders.sql` trong dự án.

---

### 3. **Kiểm tra dữ liệu gửi lên**
- Dữ liệu gửi lên phải có dạng:
  ```json
  {
    "table_number": "T01",
    "items": [
      { "id": 2, "name": "Pizza Margherita", "quantity": 4, "price": 15.99 }
    ],
    "payment_method": "cash",
    "notes": ""
  }
  ```
- Đảm bảo các `id` trong `items` đều tồn tại trong bảng `products`.

---

### 4. **Kiểm tra bảng products**
- Đảm bảo sản phẩm bạn chọn (ví dụ: Pizza Margherita) có tồn tại trong bảng `products` với đúng `id`.

---

## **Tóm lại:**
- **99% lỗi này là do database không đúng schema hoặc dữ liệu gửi lên không hợp lệ.**
- Hãy kiểm tra log terminal/server để biết lỗi SQL cụ thể.
- Nếu bạn gửi lại dòng log lỗi chi tiết từ terminal/server, mình sẽ giúp bạn fix triệt để và rất nhanh!

---

**Hãy gửi lại log lỗi chi tiết từ terminal/server (nơi bạn chạy `node server.js`) để mình hỗ trợ chính xác nhất nhé!** 

---

## 1. **Không tắt được tiến trình chiếm cổng 3001**
- Bạn đã chạy đúng lệnh `netstat -ano | findstr :3001` và thấy PID là **2392**.
- Tuy nhiên, bạn lại chạy `taskkill /PID 12345 /F` (sai PID).
- **Đúng ra phải chạy:**  
  ```
  taskkill /PID 2392 /F
  ```
- Nếu vẫn không tắt được, hãy thử **khởi động lại máy tính** để giải phóng cổng.

---

## 2. **Chạy sai đường dẫn file server.js**
- Bạn đang ở thư mục `C:\Users\Windows\` và chạy `node server.js` nên Node.js báo lỗi:
  ```
  Error: Cannot find module 'C:\Users\Windows\server.js'
  ```
- **Bạn cần chuyển vào đúng thư mục dự án** (nơi có file `server.js`), ví dụ:
  ```
  cd C:\xampp\htdocs\POS
  node server.js
  ```

---

## **Tóm lại, bạn cần làm như sau:**

1. **Tắt tiến trình chiếm cổng 3001:**
   - Chạy:
     ```
     taskkill /PID 2392 /F
     ```
   - Nếu không được, **khởi động lại máy tính**.

2. **Chạy server Node.js ở đúng thư mục dự án:**
   - Mở PowerShell/CMD mới.
   - Gõ:
     ```
     cd C:\xampp\htdocs\POS
     node server.js
     ```
   - Đảm bảo không còn lỗi cổng và không còn lỗi "Cannot find module".

---

**Sau khi làm xong, thử lại thao tác đặt hàng. Nếu còn lỗi, gửi lại log lỗi mới nhất từ terminal/server cho mình!** 

---

**Nguyên nhân:**  
Trình duyệt không thể kết nối tới server Node.js trên cổng 3001. Điều này có nghĩa là **server Node.js của bạn chưa chạy** hoặc đã bị tắt/crash.

---

## **Cách khắc phục**

### 1. **Đảm bảo server Node.js đang chạy**
- Mở PowerShell/CMD mới.
- Chuyển vào đúng thư mục dự án:
  ```
  cd C:\xampp\htdocs\POS
  node server.js
  ```
- Nếu server chạy thành công, bạn sẽ thấy dòng như:
  ```
  Server is running on port 3001
  ```
- Nếu có lỗi, hãy **copy toàn bộ lỗi trong terminal/server gửi lại đây**.

---

### 2. **Kiểm tra lại trình duyệt**
- Sau khi chắc chắn server đã chạy, **refresh lại trang web** và thử đặt hàng lại.

---

### 3. **Nếu vẫn lỗi**
- Gửi lại **log lỗi mới nhất** từ terminal/server (nơi bạn chạy `node server.js`).
- Đảm bảo không còn lỗi "EADDRINUSE" hoặc "Cannot find module".

---

## **Tóm lại:**
- Lỗi này là do **server Node.js chưa chạy** hoặc **đang bị crash**.
- Hãy chạy lại server như hướng dẫn trên.
- Nếu server báo lỗi, gửi lại log lỗi đó để mình hỗ trợ tiếp.

---

**Bạn chỉ cần chạy lại server Node.js ở đúng thư mục dự án, sau đó thử lại. Nếu còn lỗi, gửi log terminal/server cho mình!** 

---

**Hiện tượng bạn mô tả là: dù đã chọn hình ảnh mới khi thêm sản phẩm, khi load lên vẫn chỉ thấy hình icon cũ hoặc hình mặc định**.  
Điều này thường do một trong các nguyên nhân sau:**

---

## 1. **Ảnh không được lưu vào database**
- Khi thêm sản phẩm, dữ liệu ảnh (base64) không được gửi lên hoặc không được lưu vào cột `image` trong bảng `products`.
- Có thể do JS không lấy đúng dữ liệu ảnh, hoặc backend không nhận/sử dụng trường `image`.

## 2. **API trả về hình cũ hoặc không có hình**
- Khi truy cập `/api/products/:id/image`, backend không lấy đúng ảnh từ database, hoặc ảnh trong database là rỗng/null.

## 3. **Trình duyệt cache ảnh cũ**
- Nếu bạn thay ảnh nhưng URL ảnh không đổi, trình duyệt có thể cache ảnh cũ.

---

# **Cách kiểm tra & khắc phục**

### **A. Kiểm tra dữ liệu ảnh trong database**
- Vào phpMyAdmin/MySQL, kiểm tra bảng `products`, cột `image` của sản phẩm vừa thêm:
  - Nếu cột `image` rỗng/null, nghĩa là ảnh chưa được lưu.

### **B. Kiểm tra JS khi thêm sản phẩm**
- Đảm bảo đoạn JS trong `add_product.html` lấy đúng dữ liệu ảnh:
  ```js
  const imagePreview = document.getElementById('imagePreview');
  if (imagePreview.style.display !== 'none') {
      productData.image = imagePreview.src;
  }
  ```
- Khi chọn ảnh, preview phải hiện ra và khi submit, trường `image` phải có giá trị.

### **C. Kiểm tra backend**
- Trong file `routes/products.js`, endpoint POST `/api/products` phải nhận và lưu trường `image` vào database:
  ```js
  const { name, price, category, image, stock = 0 } = req.body;
  // ...
  let imageData = null;
  if (image && image.startsWith('data:image')) {
      imageData = image;
  }
  // ...
  await db.query(
      'INSERT INTO products (name, price, category, image, stock) VALUES (?, ?, ?, ?, ?)',
      [name, price, category, imageData, stock]
  );
  ```

### **D. Kiểm tra API trả về ảnh**
- Truy cập trực tiếp `/api/products/:id/image` với sản phẩm mới, xem có ra đúng ảnh không.

### **E. Xóa cache trình duyệt**
- Nhấn Ctrl+F5 để reload mạnh trang, hoặc thử ở tab ẩn danh.

---

# **Nếu vẫn không được, hãy thử:**
1. Thêm sản phẩm mới, chọn ảnh, sau đó kiểm tra lại cột `image` trong database.
2. Nếu cột `image` vẫn rỗng, hãy gửi lại đoạn JS thêm sản phẩm và log response từ API khi thêm.
3. Nếu cột `image` có dữ liệu, nhưng vẫn không hiện ảnh, hãy gửi lại response của API `/api/products/:id/image` (có thể là lỗi backend).

---

**Bạn muốn mình kiểm tra/sửa file backend hoặc JS thêm sản phẩm cho chắc chắn không? Nếu đồng ý, xác nhận để mình sửa tự động cho bạn!** 

---

Để khắc phục và hiển thị đúng hình ảnh sản phẩm từ database, bạn làm theo các bước sau:

---

## **1. Lấy đúng ID sản phẩm**

- Vào phpMyAdmin hoặc MySQL, xem bảng `products`.
- Lấy giá trị số ở cột `id` của sản phẩm bạn muốn kiểm tra (ví dụ: 1, 2, 3...).

---

## **2. Truy cập đúng API**

- Truy cập đường dẫn:  
  ```
  http://localhost:3001/api/products/ID/image
  ```
  (Thay `ID` bằng số thực tế, ví dụ: `http://localhost:3001/api/products/1/image`)

---

## **3. Kiểm tra dữ liệu cột `image`**

- Đảm bảo cột `image` của sản phẩm đó có dữ liệu base64 (bắt đầu bằng `data:image/...;base64,...`).
- Nếu cột này rỗng/null, bạn cần thêm lại sản phẩm và chọn hình ảnh khi thêm.

---

## **4. Thêm sản phẩm mới có hình ảnh**

- Vào trang **Add Product**.
- Nhập thông tin sản phẩm và **chọn hình ảnh**.
- Lưu lại, sau đó kiểm tra lại bảng `products` xem cột `image` đã có dữ liệu chưa.

---

## **5. Kiểm tra lại hiển thị**

- Quay lại trang quản lý sản phẩm, kiểm tra xem ảnh đã hiển thị đúng chưa.
- Nếu chưa, thử truy cập lại API `/api/products/ID/image` với ID sản phẩm vừa thêm.

---

## **6. Nếu vẫn không được**

- Gửi lại:
  - Ảnh chụp dữ liệu sản phẩm trong database (đặc biệt là cột `id` và `image`).
  - Kết quả truy cập đúng API `/api/products/<id thực tế>/image`.

---

### **Tóm lại:**
- **Luôn dùng số ID thực tế của sản phẩm khi truy cập API.**
- **Đảm bảo cột `image` trong database có dữ liệu base64.**
- **Thêm sản phẩm mới và chọn hình ảnh để kiểm tra lại.**

Nếu bạn làm đúng các bước trên mà vẫn không được, hãy gửi ảnh chụp dữ liệu sản phẩm trong database để mình hỗ trợ chi tiết hơn! 

---

Nếu bạn **chỉ thấy hình icon mẫu (mặc định)** mà không thấy hình ảnh bạn upload, và chỉ các sản phẩm mẫu (icon) mới có hình, thì nguyên nhân chắc chắn là:

1. **Khi thêm sản phẩm mới, trường `image` không được lưu vào database** (cột `image` bị rỗng hoặc null).
2. **Chỉ các sản phẩm mẫu (import từ file SQL) mới có dữ liệu hình ảnh.**

---

## **Cách khắc phục triệt để**

### 1. **Kiểm tra lại quá trình thêm sản phẩm mới**
- Khi bạn thêm sản phẩm mới, hãy chắc chắn đã chọn hình ảnh và preview hiện ra.
- Sau khi thêm, vào database kiểm tra cột `image` của sản phẩm mới:
  - Nếu cột này rỗng/null, JS hoặc backend đang không gửi/lưu đúng dữ liệu ảnh.

### 2. **Kiểm tra lại code JS ở `add_product.html`**
- Đảm bảo đoạn này có trong file:
  ```js
  const imagePreview = document.getElementById('imagePreview');
  if (imagePreview.style.display !== 'none') {
      productData.image = imagePreview.src;
  }
  ```
- Khi submit, `productData.image` phải là chuỗi base64.

### 3. **Kiểm tra lại backend (routes/products.js)**
- Đảm bảo đoạn này có trong endpoint POST `/api/products`:
  ```js
  let imageData = null;
  if (image && image.startsWith('data:image')) {
      imageData = image;
  }
  // ...
  await db.query(
      'INSERT INTO products (name, price, category, image, stock) VALUES (?, ?, ?, ?, ?)',
      [name, price, category, imageData, stock]
  );
  ```
- Nếu thiếu, backend sẽ không lưu ảnh.

### 4. **Kiểm tra log khi thêm sản phẩm**
- Khi thêm sản phẩm, mở tab Network (F12) → Xem request POST `/api/products`:
  - Trong phần **Request Payload**, phải có trường `"image": "data:image/..."`.
  - Nếu không có, JS đang không gửi ảnh lên backend.

---

## **Tóm lại:**
- **Chỉ sản phẩm mẫu có hình vì chúng được import sẵn với dữ liệu base64.**
- **Sản phẩm bạn thêm mới không có hình vì dữ liệu ảnh không được lưu vào database.**
- **Bạn cần kiểm tra lại code JS và backend như hướng dẫn trên.**

---

### **Bạn muốn mình kiểm tra/sửa lại toàn bộ code thêm sản phẩm để chắc chắn lưu được ảnh không? Nếu đồng ý, xác nhận để mình sửa tự động cho bạn!** 

---

Đây là lý do vì sao bạn **không thấy hình ảnh bạn vừa thêm** mà chỉ thấy hình icon mẫu hoặc sản phẩm cũ:

---

## **Giải thích nguyên nhân**

- Khi bạn thêm sản phẩm mới, sản phẩm đó sẽ được gán một `id` mới (tăng dần, ví dụ: 10, 11, 12...).
- Trong HTML bạn gửi, hình ảnh đang lấy từ `/api/products/9/image` (tức là sản phẩm có id = 9).
- Nếu bạn vừa thêm sản phẩm mới, nhưng trang vẫn hiển thị sản phẩm cũ (id nhỏ hơn), thì:
  - **Bạn đang xem danh sách sản phẩm cũ, không phải sản phẩm mới vừa thêm.**
  - Hoặc sản phẩm mới không được thêm thành công, hoặc không được load lên danh sách.

---

## **Cách kiểm tra và khắc phục**

### 1. **Kiểm tra lại danh sách sản phẩm**
- Sau khi thêm sản phẩm mới, hãy reload lại trang quản lý sản phẩm (`products.html`).
- Sản phẩm mới nhất sẽ xuất hiện ở đầu hoặc cuối danh sách (tùy sắp xếp).
- Kiểm tra xem sản phẩm bạn vừa thêm có xuất hiện không (theo tên, giá, hoặc id lớn nhất).

### 2. **Kiểm tra id sản phẩm mới**
- Vào database, xem bảng `products`, kiểm tra sản phẩm mới nhất (id lớn nhất).
- Lấy id đó, thử truy cập:  
  ```
  http://localhost:3001/api/products/<id mới>/image
  ```
- Nếu không ra ảnh, kiểm tra cột `image` của sản phẩm đó trong database.

### 3. **Kiểm tra code load sản phẩm**
- Đảm bảo hàm `loadProducts()` thực sự lấy toàn bộ sản phẩm mới nhất từ API `/api/products`.
- Nếu bạn không thấy sản phẩm mới, có thể do:
  - Sản phẩm không được thêm thành công.
  - API `/api/products` không trả về sản phẩm mới (có thể do phân trang, filter, hoặc lỗi backend).

### 4. **Kiểm tra lại quá trình thêm sản phẩm**
- Khi thêm sản phẩm, kiểm tra tab Network (F12) → Xem request POST `/api/products`:
  - Response trả về có phải là sản phẩm mới không?
  - Có id mới không?
  - Có trường `image` không?

---

## **Tóm lại**
- `/api/products/9/image` là ảnh của sản phẩm có id = 9, không phải sản phẩm bạn vừa thêm nếu id sản phẩm mới lớn hơn 9.
- Bạn cần kiểm tra lại sản phẩm mới nhất (id lớn nhất) trong database và thử truy cập đúng id đó.
- Nếu sản phẩm mới không xuất hiện, hãy kiểm tra lại quá trình thêm sản phẩm và API trả về.

---

**Nếu bạn muốn mình kiểm tra/sửa lại toàn bộ code thêm sản phẩm để chắc chắn lưu được ảnh và load đúng sản phẩm mới, hãy xác nhận để mình sửa tự động cho bạn!** 

---

Tại sao khi thêm sản phẩm mới lại là ID 9?

## Giải thích

- **ID** trong bảng `products` là **tự động tăng** (`AUTO_INCREMENT`).
- Nếu bạn đã xóa các sản phẩm trước đó (ví dụ: xóa sản phẩm có id 8), thì khi thêm sản phẩm mới, MySQL sẽ lấy giá trị lớn nhất hiện tại + 1, hoặc tiếp tục từ giá trị AUTO_INCREMENT hiện tại.
- Nếu bạn **xóa hết sản phẩm** và sau đó **thêm mới**, ID có thể nhảy lên số lớn nhất từng có, hoặc tiếp tục tăng, không quay lại từ 1.

### Trường hợp của bạn:
- Bạn có 9 sản phẩm, sản phẩm mới nhất có id = 9.
- Có thể bạn đã xóa các sản phẩm trước đó, hoặc đây là sản phẩm thứ 9 bạn thêm vào.
- **ID không liên quan đến số thứ tự hiển thị, mà là số tự động tăng trong database.**

---

## Cách xác minh

1. **Kiểm tra bảng `products` trong database:**
   - Xem tất cả các dòng, bạn sẽ thấy các id: 1, 2, 3, ..., 9.
   - Nếu bạn xóa sản phẩm có id 8, sản phẩm mới thêm sẽ có id 9 (nếu 9 chưa tồn tại), hoặc id tiếp theo nếu 9 đã tồn tại.

2. **Thêm sản phẩm mới nữa:**
   - Sản phẩm tiếp theo sẽ có id = 10, 11, ...

---

## Tóm lại

- **ID là số tự động tăng, không reset về 1 khi bạn xóa sản phẩm.**
- Nếu bạn muốn reset lại AUTO_INCREMENT về 1 (không khuyến khích trên hệ thống thật), bạn có thể dùng lệnh SQL:
  ```sql
  ALTER TABLE products AUTO_INCREMENT = 1;
  ```
  (Chỉ nên dùng khi đã xóa hết dữ liệu và muốn làm lại từ đầu.)

---

**Việc sản phẩm mới có id = 9 là hoàn toàn bình thường và đúng với cách MySQL hoạt động.**  
Bạn chỉ cần quan tâm sản phẩm mới có xuất hiện đúng, có hình ảnh đúng là được!

Nếu bạn muốn kiểm tra hoặc reset lại id, hoặc có vấn đề khác về hiển thị sản phẩm, hãy nói rõ hơn nhé! 

---

## **Vì sao vẫn là icon mẫu?**

1. **Bạn đã xóa hết sản phẩm mẫu, nhưng khi thêm sản phẩm mới, hình ảnh vẫn là icon mẫu.**
2. **Lý do:**  
   - Khi bạn chọn ảnh, **JS không lấy đúng file ảnh bạn upload** (preview không đổi, hoặc vẫn là SVG mẫu).
   - **Trường `image` gửi lên backend vẫn là SVG mẫu** (icon mặc định), không phải base64 của ảnh bạn chọn.
   - **Backend chỉ lưu đúng cái nó nhận được** – nếu frontend gửi icon mẫu, backend cũng lưu icon mẫu.

---

## **Cách khắc phục triệt để (bắt buộc làm đúng từng bước):**

### **1. Khi thêm sản phẩm, phải chọn file ảnh thực sự từ máy tính**
- Khi chọn ảnh, preview phải hiện đúng ảnh bạn vừa chọn (không phải icon mẫu).
- Nếu preview không đổi, JS đang bị lỗi hoặc bạn chưa chọn file đúng.

### **2. Kiểm tra lại code JS ở `add_product.html`**
- Đảm bảo đoạn này có trong file:
```js
document.getElementById('productImage').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('imagePreview');
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});
```
- Khi submit, phải lấy đúng `imagePreview.src` (base64 của ảnh bạn chọn).

### **3. Kiểm tra tab Network khi thêm sản phẩm**
- Khi bấm "Save Product", mở tab Network → chọn request POST `/api/products`.
- **Request Payload** phải có `"image": "data:image/jpeg;base64,...` hoặc `"image": "data:image/png;base64,...` (không phải SVG).

### **4. Kiểm tra lại database**
- Sau khi thêm, vào phpMyAdmin, kiểm tra cột `image` của sản phẩm mới nhất.
- Nếu là base64 của ảnh bạn chọn, mọi thứ đã đúng.

### **5. Nếu vẫn là icon mẫu**
- Có thể bạn đang chọn lại đúng file SVG mẫu (icon) hoặc JS không lấy đúng file ảnh.
- Hãy thử chọn một file ảnh JPG/PNG khác hoàn toàn, không phải file SVG.

---

## **Nếu bạn muốn mình sửa lại toàn bộ code để chắc chắn upload và hiển thị đúng ảnh bạn chọn, hãy xác nhận: "OK, sửa giúp mình". Mình sẽ làm tự động cho bạn!** 