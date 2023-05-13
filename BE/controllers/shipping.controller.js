const { 
    fetchGHNProvinces,
    fetchGHNDistricts,
    fetchGHNWards,
    fetchGHNService,
    fetchGHNShippingFee,
    fetchGHNShippingTime
} = require("../middlewares/externalApi");
const { dynamicSort } = require("../utils/dynamicSort");

exports.getProvinces = async (req, res, next) => {
    try {
        const provinces = await fetchGHNProvinces();
        const sortProvinces = provinces.sort(dynamicSort("ProvinceName"))
        res.status(200).send(sortProvinces)        
    } catch (err) {
        next(new Error())
    }
}

exports.getDistricts = async (req, res, next) => {
    try {
        const districts = await fetchGHNDistricts(req.body.province);
        const sortDistricts = districts.sort(dynamicSort("DistrictName"))
        res.status(200).send(sortDistricts)       
    } catch (err) {
        next(new Error())
    }
}

exports.getWards = async (req, res, next) => {
    try {
        const wards = await fetchGHNWards(req.body.district);
        const sortWards = wards.sort(dynamicSort("WardName"))
        res.status(200).send(sortWards)         
    } catch (err) {
        next(new Error())
    }
}

exports.getServices = async (req, res, next) => {
    try {
        var results = []
        const services = await fetchGHNService(
            req.body.fromDistrict, 
            req.body.toDistrict
        );
        for (const element of services) {
            const feeData = await fetchGHNShippingFee(
                element.service_id,
                req.body.fromDistrict,
                req.body.toDistrict,
                req.body.toWard,
                req.body.weight
            );
            const timeData = await fetchGHNShippingTime(
                element.service_id,
                req.body.fromDistrict,
                req.body.fromWard,
                req.body.toDistrict,
                req.body.toWard,
            )
            results.push({
                ...element, 
                fee: feeData.total,
                time: timeData.leadtime * 1000
            });
        }
        res.status(200).send(results)
    } catch (error) {
        next(new Error())
    }
}

