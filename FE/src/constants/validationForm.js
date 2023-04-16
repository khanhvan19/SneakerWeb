import * as Yup from 'yup'

export const ADD_EMPLOYEE = Yup.object().shape({
    name: Yup.string()
        .trim()
        .required("Vui lòng nhập vào trường này!"),
    role: Yup.string()
        .ensure()
        .required("Vui lòng chọn trường này!"),
    email: Yup.string()
        .max(50, "Email có tối đa 50 ký tự!")
        .email("Vui lòng nhập đúng định dạng của email")
        .required("Vui lòng nhập vào trường này!"),
    password: Yup.string()
        .min(8, "Mật khẩu có tối thiểu 8 ký tự!")
        .max(30, "Mật khẩu có tối đa 30 ký tự!")
        .required("Vui lòng nhập vào trường này!"),
    sex: Yup.string()
        .ensure()
        .required("Vui lòng chọn trường này!"),
    birthday: Yup.date()
        .required("Vui lòng nhập vào trường này!")
        .max(new Date(), "Ngày được chọn phải nhỏ hơn ngày hiện tại!"),
    phone: Yup.string()
        .trim()
        .min(10, "Số điện thoại có tối thiểu 10 số")
        .max(12, "Số điện thoại có tối đa 12 số")
        .required("Vui lòng nhập vào trường này!"),
    province: Yup.string()
        .required("Vui lòng chọn trường này!"),
    district: Yup.string()
        .required("Vui lòng chọn trường này!"),
    ward: Yup.string()
        .required("Vui lòng chọn trường này!"),
    addressDetail: Yup.string()
        .trim()
        .required("Vui lòng nhập vào trường này!"),
});

export const EDIT_EMPLOYEE = Yup.object().shape({
    name: Yup.string()
        .trim()
        .required("Vui lòng nhập vào trường này!"),
    role: Yup.string()
        .ensure()
        .required("Vui lòng chọn trường này!"),
    sex: Yup.string()
        .ensure()
        .required("Vui lòng chọn trường này!"),
    birthday: Yup.date()
        .required("Vui lòng nhập vào trường này!")
        .max(new Date(), "Ngày được chọn phải nhỏ hơn ngày hiện tại!"),
    phone: Yup.string()
        .trim()
        .min(10, "Số điện thoại có tối thiểu 10 số")
        .max(12, "Số điện thoại có tối đa 12 số")
        .required("Vui lòng nhập vào trường này!"),
    province: Yup.string()
        .required("Vui lòng chọn trường này!"),
    district: Yup.string()
        .required("Vui lòng chọn trường này!"),
    ward: Yup.string()
        .required("Vui lòng chọn trường này!"),
    addressDetail: Yup.string()
        .trim()
        .required("Vui lòng nhập vào trường này!"),
});

export const EDIT_PROFILE_EMPLOYEE = Yup.object().shape({
    name: Yup.string()
        .trim()
        .required("Vui lòng nhập vào trường này!"),
    email: Yup.string()
        .max(50, "Email có tối đa 50 ký tự!")
        .email("Vui lòng nhập đúng định dạng của email")
        .required("Vui lòng nhập vào trường này!"),
    sex: Yup.string()
        .ensure()
        .required("Vui lòng chọn trường này!"),
    birthday: Yup.date()
        .required("Vui lòng nhập vào trường này!")
        .max(new Date(), "Ngày được chọn phải nhỏ hơn ngày hiện tại!"),
    phone: Yup.string()
        .trim()
        .min(10, "Số điện thoại có tối thiểu 10 số")
        .max(12, "Số điện thoại có tối đa 12 số")
        .required("Vui lòng nhập vào trường này!"),
    province: Yup.string()
        .required("Vui lòng chọn trường này!"),
    district: Yup.string()
        .required("Vui lòng chọn trường này!"),
    ward: Yup.string()
        .required("Vui lòng chọn trường này!"),
    addressDetail: Yup.string()
        .trim()
        .required("Vui lòng nhập vào trường này!"),
});

export const ADD_BRAND = Yup.object().shape({
    logo: Yup.mixed()
        .required('Vui lòng chọn hình ảnh tải lên'),
    name: Yup.string()
        .trim()
        .required("Vui lòng nhập vào trường này!"),
    slug: Yup.string()
        .trim()
        .required("Vui lòng nhập vào trường này!"),
});

export const EDIT_BRAND = Yup.object().shape({
    name: Yup.string()
        .trim()
        .required("Vui lòng nhập vào trường này!"),
    slug: Yup.string()
        .trim()
        .required("Vui lòng nhập vào trường này!"),
});

export const ADD_EDIT_CATEGORY = Yup.object().shape({
    name: Yup.string()
        .trim()
        .required("Vui lòng nhập vào trường này!"),
    slug: Yup.string()
        .trim()
        .required("Vui lòng nhập vào trường này!"),
});

export const ADD_EDIT_PRODUCT = Yup.object().shape({
    imageOuter: Yup.mixed()
        .required('Vui lòng chọn hình ảnh tải lên'),
    imageInner: Yup.mixed()
        .required('Vui lòng chọn hình ảnh tải lên'),
    imageFront: Yup.mixed()
        .required('Vui lòng chọn hình ảnh tải lên'),
    imageBehind: Yup.mixed()
        .required('Vui lòng chọn hình ảnh tải lên'),
    imageAbove: Yup.mixed()
        .required('Vui lòng chọn hình ảnh tải lên'),
    imageUnder: Yup.mixed()
        .required('Vui lòng chọn hình ảnh tải lên'),
    sample: Yup.string()
        .ensure()
        .required("Vui lòng nhập vào trường này!"),
    name: Yup.string()
        .trim()
        .required("Vui lòng nhập vào trường này!"),
    price: Yup.number()
        .integer("Giá bán phải là một số nguyên")
        .positive("Giá bán phải là số lớn hơn 0")
        .required("Vui lòng nhập vào trường này!"),
    discount: Yup.number()
        .min(0, "Giá trị phải lớn hơn hoặc bằng 0")
        .max(100, "Giá trị phải nhỏ hơn hoặc bằng 100")
        .required("Vui lòng nhập vào trường này!"),
    sizeMin: Yup.number()
        .integer("Kích thước phải là một số nguyên")
        .positive("Kích thước phải là số lớn hơn 0")
        .required("Vui lòng chọn trường này!"),
    sizeMax: Yup.number()
        .integer("Kích thước phải là một số nguyên")
        .required("Vui lòng chọn trường này!"),
});

export const ADD_EDIT_PRODUCT_SAMPLE = Yup.object().shape({
    name: Yup.string()
        .trim()
        .required("Vui lòng nhập vào trường này!"),
    brand: Yup.string()
        .ensure()
        .required("Vui lòng chọn trường này!"),
    category: Yup.array()
        .ensure()
        .min(1, "Vui lòng chọn ít nhất một danh mục!"),
});

export const ADD_IMPORT = [
    Yup.object().shape({
        name: Yup.string()
            .trim()
            .required("Vui lòng nhập vào trường này!"),
        warehouse: Yup.string()
            .trim()
            .required("Vui lòng nhập vào trường này!"),
        supplier: Yup.string()
            .trim()
            .required("Vui lòng nhập vào trường này!"),
        description: Yup.string()
            .trim()
            .required("Vui lòng nhập vào trường này!"),
    }),
    Yup.object().shape({
        products: Yup.array().of( Yup.object().shape({
            product: Yup.string()
                .ensure()
                .required("Vui lòng chọn trường này!"),
            price: Yup.number()
                .integer("Giá nhập hàng phải là một số nguyên")
                .positive("Giá nhập hàng phải là số lớn hơn 0")
                .required("Vui lòng nhập vào trường này!"), 
            sizes: Yup.array().of( Yup.object().shape({
                code: Yup.string()
                    .ensure()
                    .required("Vui lòng chọn trường này!"),
                quantity: Yup.number()
                    .integer("Số lượng nhập là một số nguyên")
                    .positive("Số lượng nhập phải lớn hơn 0")
                    .required("Vui lòng nhập vào trường này"),
            }))
        })),
    }),
];

export const EDIT_CUSTOMER = Yup.object().shape({
    email: Yup.string()
        .max(50, "Email có tối đa 50 ký tự!")
        .email("Vui lòng nhập đúng định dạng của email")
        .required("Vui lòng nhập vào trường này!"),
    name: Yup.string()
        .trim()
        .required("Vui lòng nhập vào trường này!"),
    phone: Yup.string()
        .trim()
        .min(10, "Số điện thoại có tối thiểu 10 số")
        .max(12, "Số điện thoại có tối đa 12 số")
        .required("Vui lòng nhập vào trường này!"),
    sex: Yup.string()
        .ensure()
        .required("Vui lòng chọn trường này!"),
    birthday: Yup.date()
        .max(new Date(), "Ngày được chọn phải nhỏ hơn ngày hiện tại!")
        .required("Vui lòng nhập vào trường này!"),
});

export const ADMIN_CHANGE_PASSWORD = Yup.object().shape({
    currentPassword: Yup.string()
        .min(8, "Mật khẩu có tối thiểu 8 ký tự!")
        .max(30, "Mật khẩu có tối đa 30 ký tự!")
        .required("Vui lòng nhập vào trường này!"),
    newPassword: Yup.string()
        .min(8, "Mật khẩu có tối thiểu 8 ký tự!")
        .max(30, "Mật khẩu có tối đa 30 ký tự!")
        .required("Vui lòng nhập vào trường này!"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Nhập lại mật khẩu không trùng khớp!')
        .required("Vui lòng nhập vào trường này!"),
})

export const ADD_EDIT_VOUCHER = Yup.object().shape({
    name: Yup.string()
        .trim()
        .required("Vui lòng nhập vào trường này!"),
    type: Yup.string()
        .ensure()
        .required("Vui lòng chọn trường này!"),
    start: Yup.date()
        .required("Vui lòng nhập vào trường này!")
        .min(new Date(), "Ngày bắt đầu phải lớn hơn ngày hiện tại!")
        .max(Yup.ref('end'), "Ngày bắt đầu phải nhỏ hơn ngày kết thúc!"),
    end: Yup.date()
        .required("Vui lòng nhập vào trường này!")
        .min(Yup.ref('start'), "Ngày kết thúc phải lớn hơn ngày bắt đầu!"),
    discountRate: Yup.number()
        .min(0, "Giá trị phải lớn hơn hoặc bằng 0")
        .max(100, "Giá trị phải nhỏ hơn hoặc bằng 100"),
    discountPrice: Yup.number()
        .integer("Số tiền giảm phải là một số nguyên")
        .positive("Số tiền giảm phải là số lớn hơn 0"),
    minPriceCondition: Yup.number()
        .integer("Giá trị đơn hàng tối thiểu phải là một số nguyên"),
    brandCondition: Yup.string(),
    description: Yup.string().trim(),
})