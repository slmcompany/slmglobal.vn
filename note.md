```sql
-- Tạo bảng cho Tấm pin PV / Create PV Panel table
CREATE TABLE pv_panels (
    id SERIAL PRIMARY KEY,
    local_code VARCHAR(50) NOT NULL,                    -- Mã SP (Local)
    brand VARCHAR(100) NOT NULL,                        -- Thương hiệu
    power_wp DECIMAL(10,2) NOT NULL,                    -- Công suất (Wp)
    datasheet_path VARCHAR(255),                        -- Đường dẫn file PDF
    width_mm DECIMAL(10,2) NOT NULL,                    -- Kích thước (Rộng)
    length_mm DECIMAL(10,2) NOT NULL,                   -- Kích thước (Dài)
    height_mm DECIMAL(10,2) NOT NULL,                   -- Kích thước (Sâu/Cao)
    area_m2 DECIMAL(10,4) GENERATED ALWAYS AS ((width_mm * length_mm) / 1000000) STORED, -- Diện tích
    weight_kg DECIMAL(10,2) NOT NULL,                   -- Khối lượng
    unit VARCHAR(20) NOT NULL,                          -- Đơn vị tính
    contract_description TEXT,                          -- Mô tả trong hợp đồng
    technology VARCHAR(100),                            -- Công nghệ
    import_price_no_vat DECIMAL(15,2) NOT NULL,         -- Giá nhập chưa VAT
    import_vat_percent DECIMAL(5,2) NOT NULL,           -- VAT giá nhập
    selling_price_no_vat DECIMAL(15,2) NOT NULL,        -- Giá bán chưa VAT
    selling_vat_percent DECIMAL(5,2) NOT NULL,          -- VAT giá bán
    selling_price_with_vat DECIMAL(15,2) GENERATED ALWAYS AS (selling_price_no_vat * (1 + selling_vat_percent/100)) STORED, -- Giá bán gồm VAT
    warranty_years INT NOT NULL,                        -- Bảo hành
    is_active BOOLEAN DEFAULT true,                     -- Active
    image_path VARCHAR(255),                            -- Đường dẫn hình ảnh
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng cho Biến tần / Create Inverter table
CREATE TABLE inverters (
    id SERIAL PRIMARY KEY,
    local_code VARCHAR(50) NOT NULL,                    -- Mã SP (Local)
    brand VARCHAR(100) NOT NULL,                        -- Thương hiệu
    ac_power_kw DECIMAL(10,2) NOT NULL,                -- Công suất AC
    max_dc_power_kw DECIMAL(10,2) NOT NULL,            -- Công suất đầu vào DC Max
    datasheet_path VARCHAR(255),                        -- Đường dẫn file PDF
    width_mm DECIMAL(10,2) NOT NULL,
    length_mm DECIMAL(10,2) NOT NULL,
    height_mm DECIMAL(10,2) NOT NULL,
    area_m2 DECIMAL(10,4) GENERATED ALWAYS AS ((width_mm * length_mm) / 1000000) STORED,
    weight_kg DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    contract_description TEXT,
    brand_ranking VARCHAR(50),                          -- Xếp hạng thương hiệu
    import_price_no_vat DECIMAL(15,2) NOT NULL,
    import_vat_percent DECIMAL(5,2) NOT NULL,
    selling_price_no_vat DECIMAL(15,2) NOT NULL,
    selling_vat_percent DECIMAL(5,2) NOT NULL,
    selling_price_with_vat DECIMAL(15,2) GENERATED ALWAYS AS (selling_price_no_vat * (1 + selling_vat_percent/100)) STORED,
    warranty_years INT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng cho Pin lithium / Create Lithium Battery table
CREATE TABLE lithium_batteries (
    id SERIAL PRIMARY KEY,
    local_code VARCHAR(50) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    capacity_kwh DECIMAL(10,2) NOT NULL,               -- Công suất lưu/đơn vị
    max_upgrade_kwh DECIMAL(10,2),                     -- Nâng cấp tối đa
    datasheet_path VARCHAR(255),
    width_mm DECIMAL(10,2) NOT NULL,
    length_mm DECIMAL(10,2) NOT NULL,
    height_mm DECIMAL(10,2) NOT NULL,
    area_m2 DECIMAL(10,4) GENERATED ALWAYS AS ((width_mm * length_mm) / 1000000) STORED,
    weight_kg DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    version VARCHAR(50),                               -- Phiên bản
    contract_description TEXT,
    cell_brand VARCHAR(100),                          -- Thương hiệu Cell pin
    installation_method VARCHAR(200),                  -- Cách lắp đặt
    import_price_no_vat DECIMAL(15,2) NOT NULL,
    import_vat_percent DECIMAL(5,2) NOT NULL,
    selling_price_no_vat DECIMAL(15,2) NOT NULL,
    selling_vat_percent DECIMAL(5,2) NOT NULL,
    selling_price_with_vat DECIMAL(15,2) GENERATED ALWAYS AS (selling_price_no_vat * (1 + selling_vat_percent/100)) STORED,
    warranty_years INT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng cho các phụ kiện khác / Create Other Components table
CREATE TABLE other_components (
    id SERIAL PRIMARY KEY,
    local_code VARCHAR(50) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    quote_description TEXT,                            -- Mô tả trong báo giá
    contract_description TEXT,                         -- Mô tả trong hợp đồng
    import_price_no_vat DECIMAL(15,2) NOT NULL,
    import_vat_percent DECIMAL(5,2) NOT NULL,
    selling_price_no_vat DECIMAL(15,2) NOT NULL,
    selling_vat_percent DECIMAL(5,2) NOT NULL,
    selling_price_with_vat DECIMAL(15,2) GENERATED ALWAYS AS (selling_price_no_vat * (1 + selling_vat_percent/100)) STORED,
    warranty_years INT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng cho Discount / Create Discount table
CREATE TABLE discounts (
    id SERIAL PRIMARY KEY,
    product_type VARCHAR(50) NOT NULL,                 -- Loại sản phẩm (specific/all)
    discount_percent DECIMAL(5,2),                     -- Giảm giá theo %
    discount_amount DECIMAL(15,2),                     -- Giảm giá theo số tiền
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Các câu lệnh INSERT mẫu / Sample INSERT statements

-- Thêm Tấm pin PV / Insert PV Panel
INSERT INTO pv_panels (
    local_code, brand, power_wp, width_mm, length_mm, height_mm,
    weight_kg, unit, contract_description, technology,
    import_price_no_vat, import_vat_percent,
    selling_price_no_vat, selling_vat_percent, warranty_years
) VALUES (
    'PV001', 'SunPower', 400, 1000, 2000, 40,
    25, 'Tấm', 'Tấm pin năng lượng mặt trời 400W', 'Mono',
    5000000, 10, 7000000, 10, 25
);

-- Thêm Biến tần / Insert Inverter
INSERT INTO inverters (
    local_code, brand, ac_power_kw, max_dc_power_kw,
    width_mm, length_mm, height_mm, weight_kg, unit,
    import_price_no_vat, import_vat_percent,
    selling_price_no_vat, selling_vat_percent, warranty_years
) VALUES (
    'INV001', 'SMA', 5, 6,
    500, 700, 200, 30, 'Cái',
    15000000, 10, 20000000, 10, 5
);

-- Các câu lệnh SELECT mẫu / Sample SELECT statements

-- Lấy danh sách tất cả tấm pin đang active
SELECT * FROM pv_panels WHERE is_active = true;

-- Lấy danh sách biến tần theo thương hiệu
SELECT * FROM inverters WHERE brand = 'SMA';

-- Tính tổng giá trị hàng tồn kho
SELECT
    'PV Panels' as product_type,
    COUNT(*) as quantity,
    SUM(import_price_no_vat) as total_import_value
FROM pv_panels
WHERE is_active = true
UNION ALL
SELECT
    'Inverters' as product_type,
    COUNT(*) as quantity,
    SUM(import_price_no_vat) as total_import_value
FROM inverters
WHERE is_active = true;

-- Cập nhật giá bán / Update selling price
UPDATE pv_panels
SET
    selling_price_no_vat = 8000000,
    updated_at = CURRENT_TIMESTAMP
WHERE local_code = 'PV001';

-- Xóa sản phẩm / Delete product
DELETE FROM pv_panels WHERE local_code = 'PV001';
```
