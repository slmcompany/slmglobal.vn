# Hướng dẫn chuyển đổi từ Strapi API sang Local Data

Tài liệu này hướng dẫn cách chuyển đổi dự án từ việc sử dụng Strapi API sang việc sử dụng dữ liệu local.

## 1. Tải dữ liệu từ Strapi API

Chạy lệnh sau để tải dữ liệu và hình ảnh từ Strapi API:

```bash
npm run fetch-data
```

Quá trình này sẽ:

- Tải dữ liệu từ Strapi API
- Lưu dữ liệu vào thư mục `src/data`
- Tải hình ảnh từ Strapi API
- Lưu hình ảnh vào thư mục `public/images/strapi`

## 2. Cập nhật code để sử dụng local data

### Trước đây: Sử dụng Strapi API

```typescript
import fetchApi from '../lib/strapi.ts'
import type Products from '../interfaces/products.ts'

// Lấy tất cả sản phẩm
const Products = await fetchApi<Products[]>({
	endpoint: 'products?populate=*',
	wrappedByKey: 'data'
})

// Lấy sản phẩm theo danh mục
const Products = await fetchApi<Products[]>({
	endpoint:
		'products?populate=feature_image&populate[1]=highlight&filters[$and][0][category][$eq]=screw',
	wrappedByKey: 'data'
})

// Lấy combo theo nhóm
const Combos = await fetchApi<Combos[]>({
	endpoint: `combos?populate=image&filters[$and][0][nhom_combo][$eq]=${nhom_combo}&filters[$and][1][feature][$eq]=1`,
	wrappedByKey: 'data'
})
```

### Sau khi chuyển đổi: Sử dụng Local Data

```typescript
import { getAllProducts, getProductsByCategory, getCombosByGroup } from '../lib/local-data.ts'
import type Products from '../interfaces/products.ts'
import type Combos from '../interfaces/combos.ts'

// Lấy tất cả sản phẩm
const Products = getAllProducts()

// Lấy sản phẩm theo danh mục
const Products = getProductsByCategory('screw')

// Lấy combo theo nhóm
const Combos = getCombosByGroup(nhom_combo)
```

## 3. Cập nhật đường dẫn hình ảnh

### Trước đây: Sử dụng URL Strapi đầy đủ

```astro
<Image
	src={`https://api.slmglobal.vn${product.attributes.feature_image.data.attributes.url}`}
	alt={product.attributes.title}
	inferSize
/>
```

### Sau khi chuyển đổi: Sử dụng đường dẫn local

```astro
<Image
	src={product.attributes.feature_image.data.attributes.url}
	alt={product.attributes.title}
	inferSize
/>
```

## 4. Danh sách các hàm trong local-data.ts

- **`readLocalData<T>(filename: string): T`**: Đọc dữ liệu từ file JSON local
- **`getAllProducts(): Products[]`**: Lấy tất cả sản phẩm
- **`getAllCombos(): Combos[]`**: Lấy tất cả combo
- **`getAllProjects(): Projects[]`**: Lấy tất cả dự án
- **`getAllArticles(): Article[]`**: Lấy tất cả bài viết
- **`getProductsByCategory(category: string): Products[]`**: Lấy sản phẩm theo danh mục
- **`getProductBySlug(slug: string): Products | undefined`**: Lấy sản phẩm theo slug
- **`getArticleBySlug(slug: string): Article | undefined`**: Lấy bài viết theo slug
- **`getCombosByGroup(nhomCombo: string): Combos[]`**: Lấy combo theo nhóm
- **`getProjectById(id: number): Projects | undefined`**: Lấy dự án theo ID

## 5. Cập nhật dữ liệu định kỳ

Để cập nhật dữ liệu từ Strapi API sau này, chỉ cần chạy lại lệnh:

```bash
npm run fetch-data
```

Script này sẽ tải dữ liệu mới và chỉ tải những hình ảnh chưa có trong local.

## 6. Xử lý lỗi

Nếu gặp lỗi khi chạy script hoặc khi sử dụng local data, hãy kiểm tra:

1. Đảm bảo thư mục `src/data` tồn tại và có quyền ghi
2. Đảm bảo thư mục `public/images/strapi` tồn tại và có quyền ghi
3. Kiểm tra kết nối mạng khi chạy script tải dữ liệu
4. Kiểm tra log lỗi trong console khi chạy script
