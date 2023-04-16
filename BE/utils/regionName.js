const { fetchDistricts, fetchProvinces, fetchWards } = require("../middlewares/externalApi")

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
