const fetch = require("node-fetch")

exports.fetchProvinces = async () => {
    const provinces = await fetch(`${process.env.REGION_API}/province`)
        .then((res) => res.json());
    return provinces.results;        
}

exports.fetchDistricts = async (provinceId) => {
    const provinces = await fetch(`${process.env.REGION_API}/province/district/${provinceId}`)
        .then((res) => res.json());
    return provinces.results;        
}

exports.fetchWards = async (districtId) => {
    const provinces = await fetch(`${process.env.REGION_API}/province/ward/${districtId}`)
        .then((res) => res.json());
    return provinces.results;        
}