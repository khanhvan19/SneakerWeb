export const TABLE_HEAD_EMPLOYEE = [
    { field:"name", label: "Nhân viên"},
    { field:"role", label: "Chức vụ"}, 
    { field:"email", label: "Email"}, 
    { field:"createdAt", label: "Ngày tạo"}, 
    { field:"status", label: "Trạng thái"}, 
    { field:"sex", label: "Giới tính"}, 
    { field:"birthday", label: "Tuổi"}, 
    { field:"phone", label: "Số điện thoại"},
    { field:"address", label: "Địa chỉ"},
];

export const TABLE_HEAD_BRAND = [
    { field:"name", label: "Tên thương hiệu"}, 
    { field:"slug", label: "Chuổi Slug"}, 
    { field:"createdAt", label: "Ngày tạo"}, 
    { field:"status", label: "Trạng thái"}, 
]

export const TABLE_HEAD_CATEGORY = [
    { field:"name", label: "Tên danh mục"}, 
    { field:"slug", label: "Chuổi Slug"}, 
    { field:"createdAt", label: "Ngày tạo"}, 
    { field:"status", label: "Trạng thái"}, 
]

export const TABLE_HEAD_PRODUCT = [
    { field:"image", label: "Hình ảnh"}, 
    { field:"name", label: "Tên sản phẩm"}, 
    { field:"price", label: "Giá bán"}, 
    { field:"createdAt", label: "Ngày tạo"}, 
    { field:"discount", label: "Giảm giá"}, 
    { field:"sold", label: "Đã bán"}, 
    { field:"star", label: "Đánh giá"}, 
    { field:"status", label: "Trạng thái"}, 
]

export const TABLE_HEAD_PRODUCT_SAMPLE = [
    { field:"name", label: "Mẩu sản phẩm"}, 
    { field:"createdAt", label: "Ngày tạo"}, 
    { field:"brand", label: "Thương hiệu"}, 
    { field:"category", label: "Danh mục"}, 
    { field:"gender", label: "Loại"}, 
    { field:"status", label: "Trạng thái"},  
]

export const TABLE_HEAD_IMPORT = [
    { field:"name", label: "Tiêu đề"}, 
    { field:"employee", label: "Nhân viên tạo"}, 
    { field:"suppiler", label: "Nhà cung cấp"}, 
    { field:"total", label: "Tổng giá trị"}, 
    { field:"createdAt", label: "Ngày tạo"}, 
    { field:"warehouse", label: "Nhập tại kho"}, 
    { field:"description", label: "Ghi chú"}, 
]

export const TABLE_HEAD_CUSTOMER = [
    { field:"name", label: "Khách hàng"},
    { field:"email", label: "Email"}, 
    { field:"createdAt", label: "Ngày tạo"}, 
    { field:"status", label: "Trạng thái"}, 
    { field:"sex", label: "Giới tính"}, 
    { field:"birthday", label: "Tuổi"}, 
    { field:"phone", label: "Số điện thoại"},
];

export const TABLE_HEAD_VOUCHER = [
    { field:"name", label: "Tên Voucher"},
    { field:"start", label: "Bắt đầu"}, 
    { field:"end", label: "Kết thúc"}, 
    { field:"type", label: "Loại Voucher"}, 
    { field:"status", label: "Trạng thái"},
    { field:"discountRate", label: "Tỉ lệ giảm"}, 
    { field:"discountPrice", label: "Mức giá giảm"}, 
    { field:"minPrice", label: "Đơn tối thiểu"},
    { field:"brand", label: "Thương hiệu"},
];