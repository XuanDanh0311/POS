const fs = require('fs');
const path = require('path');
const db = require('./db');

// Hàm chuyển đổi file hình ảnh thành base64
function imageToBase64(filePath) {
    try {
        const imageBuffer = fs.readFileSync(filePath);
        const base64String = imageBuffer.toString('base64');
        const mimeType = getMimeType(filePath);
        return `data:${mimeType};base64,${base64String}`;
    } catch (error) {
        console.error('Error converting image to base64:', error);
        return null;
    }
}

// Hàm xác định MIME type
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
    };
    return mimeTypes[ext] || 'image/jpeg';
}

// Hàm upload hình ảnh cho sản phẩm
async function uploadProductImage(productId, imagePath) {
    try {
        const base64Image = imageToBase64(imagePath);
        if (!base64Image) {
            throw new Error('Failed to convert image to base64');
        }

        await db.query('UPDATE products SET image = ? WHERE id = ?', [base64Image, productId]);
        console.log(`Image uploaded successfully for product ID: ${productId}`);
        return true;
    } catch (error) {
        console.error('Error uploading image:', error);
        return false;
    }
}

// Hàm upload nhiều hình ảnh từ thư mục
async function uploadImagesFromDirectory(directoryPath) {
    try {
        const files = fs.readdirSync(directoryPath);
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        });

        for (let i = 0; i < imageFiles.length; i++) {
            const imagePath = path.join(directoryPath, imageFiles[i]);
            const productId = i + 1; // Giả sử product ID bắt đầu từ 1
            
            const success = await uploadProductImage(productId, imagePath);
            if (success) {
                console.log(`Uploaded: ${imageFiles[i]} -> Product ID: ${productId}`);
            }
        }
    } catch (error) {
        console.error('Error uploading images from directory:', error);
    }
}

// Export các hàm để sử dụng
module.exports = {
    uploadProductImage,
    uploadImagesFromDirectory,
    imageToBase64
};

// Chạy script nếu được gọi trực tiếp
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Usage: node upload_image.js <product_id> <image_path>');
        console.log('Or: node upload_image.js --directory <directory_path>');
        process.exit(1);
    }

    if (args[0] === '--directory') {
        const directoryPath = args[1];
        uploadImagesFromDirectory(directoryPath).then(() => {
            console.log('All images uploaded successfully');
            process.exit(0);
        });
    } else {
        const productId = parseInt(args[0]);
        const imagePath = args[1];
        
        uploadProductImage(productId, imagePath).then((success) => {
            if (success) {
                console.log('Image uploaded successfully');
                process.exit(0);
            } else {
                console.log('Failed to upload image');
                process.exit(1);
            }
        });
    }
} 