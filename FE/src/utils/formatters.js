export const formatMoney = (data) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND' 
    })
    return formatter.format(data)
}

export const formatLocalDateTime = (data) => {
    const date = new Date(Date.parse(data));
    return date.toLocaleString()
}

export const formatLocalDate = (data) => {
    const date = new Date(Date.parse(data));
    return date.toLocaleDateString()
}