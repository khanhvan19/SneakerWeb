export const totalCount = (products) => {
    return products.reduce(
        (count, product) => count + product?.quantity, 0
    )
}

export const totalInitialPrice = (products) => {
    return products.reduce(
        (result, product) => result + ((product?.price || product?._id?.price) * product?.quantity), 0
    )
}

export const totalAmountDiscount = (products) => {
    return products.reduce(
        (result, product) => result + (
            ((product?.price ||  product?._id?.price) 
                * ((product?.discount || product?._id?.discount) / 100)
            ) * product?.quantity
        ), 0
    )
}