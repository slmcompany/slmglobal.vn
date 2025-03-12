import * as fs from 'fs';
import * as path from 'path';
import fetchApi from './strapi';
import type Products from '../interfaces/products';
import type Combos from '../interfaces/combos';
import type Projects from '../interfaces/projects';
import type Article from '../interfaces/article';
import * as https from 'https';
import * as http from 'http';

// Đường dẫn lưu trữ dữ liệu JSON
const DATA_DIR = path.join(process.cwd(), 'src', 'data');

// Đường dẫn lưu trữ hình ảnh
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'strapi');

// Base URL cho Strapi API
const STRAPI_URL = process.env.STRAPI_URL || 'https://api.slmglobal.vn';

// Đảm bảo thư mục data tồn tại
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Đảm bảo thư mục images tồn tại
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

/**
 * Hàm tải hình ảnh từ URL về local
 * @param imageUrl - URL của hình ảnh (có thể là đường dẫn tương đối hoặc URL đầy đủ)
 * @returns - Đường dẫn local của hình ảnh đã tải
 */
async function downloadImage(imageUrl: string): Promise<string> {
  // Bỏ qua nếu URL không hợp lệ hoặc đã bắt đầu bằng /images/ (có thể đã là local)
  if (!imageUrl || imageUrl.startsWith('/images/')) {
    return imageUrl;
  }

  // Tạo URL đầy đủ nếu là đường dẫn tương đối
  const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${STRAPI_URL}${imageUrl}`;

  // Tạo đường dẫn đích để lưu
  const urlParts = new URL(fullUrl).pathname.split('/');
  const filename = urlParts[urlParts.length - 1];
  const dir = path.join(IMAGES_DIR, ...urlParts.slice(1, -1));
  
  // Tạo thư mục nếu chưa tồn tại
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const localPath = path.join(dir, filename);
  const relativeLocalPath = `/images/strapi${new URL(fullUrl).pathname}`;

  // Kiểm tra nếu đã tải rồi thì không tải lại
  if (fs.existsSync(localPath)) {
    console.log(`Hình ảnh đã tồn tại: ${relativeLocalPath}`);
    return relativeLocalPath;
  }

  // Tải hình ảnh
  console.log(`Đang tải hình ảnh: ${fullUrl} -> ${relativeLocalPath}`);
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(localPath);
    const request = (fullUrl.startsWith('https') ? https : http).get(fullUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Lỗi khi tải hình ảnh: ${response.statusCode}`));
        return;
      }
      
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(relativeLocalPath);
      });
    });
    
    request.on('error', (err) => {
      fs.unlink(localPath, () => {});
      reject(err);
    });
    
    fileStream.on('error', (err) => {
      fs.unlink(localPath, () => {});
      reject(err);
    });
  });
}

/**
 * Hàm tìm và tải các URL hình ảnh trong dữ liệu
 * @param data - Dữ liệu chứa URL hình ảnh
 * @returns - Dữ liệu đã được cập nhật với đường dẫn hình ảnh local
 */
async function processImagesInData(data: any): Promise<any> {
  if (!data) return data;
  
  // Nếu là mảng, xử lý từng phần tử
  if (Array.isArray(data)) {
    const newData = [...data];
    for (let i = 0; i < newData.length; i++) {
      newData[i] = await processImagesInData(newData[i]);
    }
    return newData;
  }
  
  // Nếu là object, kiểm tra các thuộc tính
  if (typeof data === 'object') {
    const newData = { ...data };
    
    // Kiểm tra xem đây có phải là một đối tượng hình ảnh không
    if (data.data && data.data.attributes && data.data.attributes.url) {
      // Tải hình ảnh và cập nhật URL
      newData.data.attributes.url = await downloadImage(data.data.attributes.url);
      
      // Xử lý các formats (small, medium, large, thumbnail, v.v.)
      if (data.data.attributes.formats) {
        newData.data.attributes.formats = { ...data.data.attributes.formats };
        for (const format in newData.data.attributes.formats) {
          if (newData.data.attributes.formats[format].url) {
            newData.data.attributes.formats[format].url = await downloadImage(
              newData.data.attributes.formats[format].url
            );
          }
        }
      }
    } else {
      // Duyệt qua các thuộc tính của object
      for (const key in newData) {
        newData[key] = await processImagesInData(newData[key]);
      }
    }
    
    return newData;
  }
  
  // Trả về giá trị nguyên bản nếu không phải array hoặc object
  return data;
}

// Hàm tải và lưu dữ liệu
async function fetchAndSaveData<T>(endpoint: string, filename: string, options: any = {}) {
  try {
    console.log(`Đang tải dữ liệu từ ${endpoint}...`);
    const data = await fetchApi<T>({
      endpoint,
      ...options
    });
    
    // Xử lý hình ảnh trong dữ liệu
    console.log(`Đang xử lý hình ảnh trong dữ liệu ${filename}...`);
    const processedData = await processImagesInData(data);
    
    // Lưu dữ liệu vào file
    fs.writeFileSync(
      path.join(DATA_DIR, `${filename}.json`),
      JSON.stringify(processedData, null, 2),
      'utf-8'
    );
    
    console.log(`Đã lưu dữ liệu vào ${filename}.json`);
    return processedData;
  } catch (error) {
    console.error(`Lỗi khi tải dữ liệu từ ${endpoint}:`, error);
    throw error;
  }
}

// Tải tất cả dữ liệu
export async function fetchAllData() {
  try {
    // Tải sản phẩm
    await fetchAndSaveData<Products[]>(
      'products?populate=*',
      'products',
      { wrappedByKey: 'data' }
    );
    
    // Tải combo
    await fetchAndSaveData<Combos[]>(
      'combos?populate=*',
      'combos',
      { wrappedByKey: 'data' }
    );
    
    // Tải dự án
    await fetchAndSaveData<Projects[]>(
      'projects?populate=*',
      'projects',
      { wrappedByKey: 'data' }
    );
    
    // Tải bài viết
    await fetchAndSaveData<Article[]>(
      'articles?populate=*',
      'articles',
      { wrappedByKey: 'data' }
    );
    
    // Tải sản phẩm theo danh mục
    await fetchAndSaveData<Products[]>(
      'products?populate=feature_image&populate[1]=highlight&filters[$and][0][category][$eq]=screw',
      'products-screw',
      { wrappedByKey: 'data' }
    );
    
    await fetchAndSaveData<Products[]>(
      'products?populate=feature_image&populate[1]=highlight&filters[$and][0][category][$eq]=stone',
      'products-stone',
      { wrappedByKey: 'data' }
    );
    
    await fetchAndSaveData<Products[]>(
      'products?populate=feature_image&populate[1]=highlight&filters[$and][0][category][$eq]=rubber',
      'products-rubber',
      { wrappedByKey: 'data' }
    );
    
    console.log('Đã tải xong tất cả dữ liệu!');
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error);
  }
}

// Chạy hàm này để tải dữ liệu
if (require.main === module) {
  fetchAllData();
} 