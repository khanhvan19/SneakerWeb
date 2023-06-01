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
    { label: "Tên sản phẩm", sortBy: "name" }, 
    { label: "Thương hiệu"}, 
    { label: "Danh mục"}, 
    { label: "Thể loại"},
    { label: "Ngày tạo", sortBy:"createdAt" }, 
    { label: "Giá bán", sortBy :"price" }, 
    { label: "Giảm giá", sortBy:"discount" }, 
    { label: "Đã bán", sortBy:"sold" }, 
    { label: "Đánh giá", sortBy:"star" }, 
    { label: "Trạng thái", sortBy:"status" }, 
]

export const TABLE_HEAD_PRODUCT_SAMPLE = [
    { field:"name", label: "Mẩu sản phẩm"}, 
    { field:"createdAt", label: "Ngày tạo"}, 
    { field:"brand.name", label: "Thương hiệu"}, 
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

export const TABLE_HEAD_ORDER = [
    { label: "Người nhận"}, 
    { label: "Ngày đặt hàng", sortBy: 'createdAt'}, 
    { label: "Số điện thoại"}, 
    { label: "Trạng thái", sortBy: 'status'}, 
    { label: "Tổng giá trị", sortBy: 'total'}, 
    { label: "Vận chuyển", sortBy: 'deliveryMethod' },
    { label: "Thanh toán", sortBy: 'paymentMethod'},
];

export const TABLE_HEAD_REVIEW = [
    { label: "Sản phẩm"},
    { label: "Khách hàng"}, 
    { label: "Mức đánh giá", sortBy: 'rating'},
    { label: "Trạng thái", sortBy: 'status'}, 
    { label: "Ngày gửi", sortBy: 'createdAt'}, 
];