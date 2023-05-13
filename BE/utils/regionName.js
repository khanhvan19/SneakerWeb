const { fetchDistricts, fetchProvinces, fetchWards, fetchGHNProvinces, fetchGHNDistricts, fetchGHNWards } = require("../middlewares/externalApi")

exports.findProvinceName = async (provinceId) => {
    const provinces = await fetchProvinces();
    const province = provinces.find((item) => item.province_id === provinceId)
    return province.province_name;
} 

exports.findDistrictName = async (provinceId ,districtId) => {
    const districts = await fetchDistricts(provinceId);
    const district = districts.find((item) => item.district_id === districtId)
    return district.district_name;
} 

exports.findWardName = async (districtId, wardId) => {
    const wards = await fetchWards(districtId);
    const ward = wards.find((item) => item.ward_id === wardId)
    return ward.ward_name;
} 

exports.findGHNProvinceName = async (provinceId) => {
    const provinces = await fetchGHNProvinces();
    const province = provinces.find((item) => item.ProvinceID === provinceId)
    return province.ProvinceName;
} 

exports.findGHNDistrictName = async (provinceId ,districtId) => {
    const districts = await fetchGHNDistricts(provinceId);
    const district = districts.find((item) => item.DistrictID === districtId)
    return district.DistrictName;
} 

exports.findGHNWardName = async (districtId, wardId) => {
    const wards = await fetchGHNWards(districtId);
    const ward = wards.find((item) => item.WardCode === wardId)
    return ward.WardName;
} 
