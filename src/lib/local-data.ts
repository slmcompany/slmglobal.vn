import * as fs from 'fs';
import * as path from 'path';
import type Products from '../interfaces/products';
import type Combos from '../interfaces/combos';
import type Projects from '../interfaces/projects';
import type Article from '../interfaces/article';

// Đường dẫn lưu trữ dữ liệu
const DATA_DIR = path.join(process.cwd(), 'src', 'data');

/**
 * Đọc dữ liệu từ file JSON local
 * @param filename - Tên file JSON cần đọc (không bao gồm phần mở rộng)
 * @returns - Dữ liệu parsed từ file JSON
 */
export function readLocalData<T>(filename: string): T {
  try {
    const filePath = path.join(DATA_DIR, `${filename}.json`);
    
    // Kiểm tra xem file có tồn tại không
    if (!fs.existsSync(filePath)) {
      throw new Error(`Không tìm thấy file dữ liệu: ${filePath}`);
    }
    
    // Đọc và parse dữ liệu
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Lỗi khi đọc dữ liệu từ file ${filename}.json:`, error);
    throw error;
  }
}

/**
 * Lấy tất cả sản phẩm
 */
export function getAllProducts(): Products[] {
  return readLocalData<Products[]>('products');
}

/**
 * Lấy tất cả combo
 */
export function getAllCombos(): Combos[] {
  return readLocalData<Combos[]>('combos');
}

/**
 * Lấy tất cả dự án
 */
export function getAllProjects(): Projects[] {
  return readLocalData<Projects[]>('projects');
}

/**
 * Lấy tất cả bài viết
 */
export function getAllArticles(): Article[] {
  return readLocalData<Article[]>('articles');
}

/**
 * Lấy sản phẩm theo danh mục
 * @param category - Danh mục sản phẩm ('screw', 'stone', 'rubber', v.v.)
 */
export function getProductsByCategory(category: string): Products[] {
  try {
    return readLocalData<Products[]>(`products-${category}`);
  } catch (error) {
    // Nếu không tìm thấy file danh mục, lọc từ tất cả sản phẩm
    return getAllProducts().filter(
      product => product.attributes.category === category
    );
  }
}

/**
 * Lấy sản phẩm theo slug
 * @param slug - Slug của sản phẩm
 */
export function getProductBySlug(slug: string): Products | undefined {
  return getAllProducts().find(
    product => product.attributes.slug === slug
  );
}

/**
 * Lấy bài viết theo slug
 * @param slug - Slug của bài viết
 */
export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find(
    article => article.attributes.slug === slug
  );
}

/**
 * Lấy combo theo nhóm combo
 * @param nhomCombo - Nhóm combo cần lấy
 */
export function getCombosByGroup(nhomCombo: string): Combos[] {
  return getAllCombos().filter(
    combo => combo.attributes.nhom_combo === nhomCombo
  );
}

/**
 * Lấy dự án theo ID
 * @param id - ID của dự án
 */
export function getProjectById(id: number): Projects | undefined {
  return getAllProjects().find(
    project => project.id === id
  );
}