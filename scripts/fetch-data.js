#!/usr/bin/env node

// Script để tải dữ liệu từ Strapi API và lưu vào local bao gồm cả hình ảnh
console.log('====== BẮT ĐẦU TẢI DỮ LIỆU VÀ HÌNH ẢNH TỪ STRAPI API ======');

// Sử dụng ES modules
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const tsNode = require('ts-node');

// Đăng ký ts-node
tsNode.register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs'
  }
});

// Import data-fetcher
import('../src/lib/data-fetcher.js')
  .then(module => {
    return module.fetchAllData();
  })
  .then(() => {
    console.log('====== ĐÃ TẢI XONG DỮ LIỆU VÀ HÌNH ẢNH ======');
    console.log('====== GỢI Ý ======');
    console.log('1. Hình ảnh đã được tải về thư mục public/images/strapi');
    console.log('2. Dữ liệu đã được lưu trong thư mục src/data');
    console.log('3. Bây giờ bạn có thể sử dụng src/lib/local-data.ts để truy cập dữ liệu local');
  })
  .catch(error => {
    console.error('Lỗi khi tải dữ liệu:', error);
    process.exit(1);
  }); 