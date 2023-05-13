import * as image from 'assets/images'

export const ROLE_OPTION = [
    {value: "role_1", label: "Quản lý"},
    {value: "role_2", label: "Nhân viên bán hàng"},
    {value: "role_3", label: "Nhân viên kho"},
    {value: "role_4", label: "Nhân viên giao hàng"},
]

export const SEX_OPTION = [
    {value: "sex_1", label: "Nam"},
    {value: "sex_2", label: "Nữ"},
    {value: "sex_3", label: "Khác"},
]

export const TYPE_VOUCHER_OPTION = [
    {value: "ship", label: "Miễn phí vận chuyển"},
    {value: "price", label: "Giảm giá trị đơn hàng"},
]

export const SIZE_OPTION = [
    {value: 24, label: "Size 24 EU"},
    {value: 25, label: "Size 25 EU"},
    {value: 26, label: "Size 26 EU"},
    {value: 27, label: "Size 27 EU"},
    {value: 28, label: "Size 28 EU"},
    {value: 29, label: "Size 29 EU"},
    {value: 30, label: "Size 30 EU"},
    {value: 31, label: "Size 31 EU"},
    {value: 32, label: "Size 32 EU"},
    {value: 33, label: "Size 33 EU"},
    {value: 34, label: "Size 34 EU"},
    {value: 35, label: "Size 35 EU"},
    {value: 36, label: "Size 36 EU"},
    {value: 37, label: "Size 37 EU"},
    {value: 38, label: "Size 38 EU"},
    {value: 39, label: "Size 39 EU"},
    {value: 40, label: "Size 40 EU"},
    {value: 41, label: "Size 41 EU"},
    {value: 42, label: "Size 42 EU"},
    {value: 43, label: "Size 43 EU"},
    {value: 44, label: "Size 44 EU"},
    {value: 45, label: "Size 45 EU"},
]

export const SORT_OPTION = [
    {value: "createdAt:desc", label: "Mới nhất"},
    {value: "sold:desc", label: "Bán chạy nhất"},
    {value: "price:asc", label: "Giá tăng dần"},
    {value: "price:desc", label: "Giá giảm dần"},
]

export const DELIVERY_METHOD = [
    {value: "standard", label: "Giao hàng tiêu chuẩn", timeMin: 4, timeMax: 6, price: 30000},
    {value: "express", label: "Giao hàng hỏa tốc", timeMin: 0, timeMax: 1, price: 100000}
]

export const PAYMENT_METHOD = [
    {value: "cod", label: "Thanh toán khi nhận hàng (COD)", logo: image.CODPayment},
    {value: "paypal", label: "Thanh toán bằng Paypal", logo: image.PaypalPayment}
]

export const STATUS_ORDER = [
    {value: '', label: 'Tất cả'},
    {value: 'new', label: 'Đang xử lý'},
    {value: 'delivery', label: 'Vận chuyển'},
    {value: 'success', label: 'Hoàn thành'},
    {value: 'cancel', label: 'Đã hủy'},
]

export const ADMIN_CANCEL_ORDER_REASON = {
    noDelivery: 'Không thể tiến hành giao hàng.',
    soldout: 'Sản phẩm hiện tại không có sẵn.'
}

export const CLIENT_CANCEL_ORDER_REASON = {
    changeAddress: 'Muốn thay đổi địa chỉ giao hàng.',
    changeProduct: 'Muốn thay đổi sản phẩm trong đơn hàng.',
    inconvenience: 'Thủ tục thanh toán quá rắc rối.',
    highPrice: 'Tìm thấy nơi khác giá tốt hơn.',
    other: 'Đổi ý, không muốn mua nữa.'
}

export const STATUS_ITINERARY = [
    { 
        value: 'Bắt đầu vận chuyển', label: 'Bắt đầu vận chuyển', 
        caption: 'Nhân viên vận chuyển đã nhận kiện hàng.'
    },
    { 
        value: 'Đang trên đường vận chuyển', label: 'Đang trên đường vận chuyển', 
        caption: 'Kiện hàng đã được vận chuyển đến nơi trung chuyển.'
    },
    { 
        value: 'Đã đến trạm giao hàng', label: 'Đã đến trạm giao hàng', 
        caption: 'Kiện hàng đã đến trạm giao hàng. Sẽ sớm được giao đến khách hàng'
    },
    { 
        value: 'Đang giao hàng', label: 'Đang giao hàng', 
        caption: 'Kiện hàng sẽ được giao đến khách hàng trong hôm nay.'
    },
    { 
        value: 'Giao hàng thành công', label: 'Giao hàng thành công', 
        caption: 'Kiện hàng đã được giao thành công cho khách hàng.'
    },
    { 
        value: 'Chưa giao được kiện hàng', label: 'Chưa giao được kiện hàng', 
        caption: 'Kiện hàng giao lần đầu chưa thành công! Sẽ được giao lại trong ngày mai.'
    },
    { 
        value: 'Giao hàng lại không thành công', label: 'Giao hàng lại không thành công', 
        caption: 'Kiện hàng giao lại chưa thành công.'
    },
    { 
        value: 'Giao hàng thất bại', label: 'Giao hàng thất bại', 
        caption: 'Kiện hàng giao không thành công và sẽ được hoàn trả lại cho cửa hàng.'
    },
]