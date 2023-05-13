const { 
    fetchProvinces, 
    fetchDistricts, 
    fetchWards
} = require("../middlewares/externalApi");

exports.getProvinces = async (req, res, next) => {
    try {
        const provinces = await fetchProvinces();
        res.status(200).send(provinces)        
    } catch (err) {
        next(new Error())
    }
}

exports.getDistricts = async (req, res, next) => {
    try {
        const districts = await fetchDistricts(req.params.id);
        res.status(200).json(districts)        
    } catch (err) {
        next(new Error())
    }
}

exports.getWards = async (req, res, next) => {
    try {
        const wards = await fetchWards(req.params.id);
        res.status(200).json(wards)        
    } catch (err) {
        next(new Error())
    }
}