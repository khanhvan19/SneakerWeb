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

exports.fetchGHNProvinces = async () => {
    const provinces = await fetch(`${process.env.GHN_REGION_API}/province`, {
        headers: { token: process.env.GHN_TOKEN} 
    }).then((res) => res.json());
    return provinces.data;        
}

exports.fetchGHNDistricts = async (provinceId) => {
    const body = { "province_id": provinceId }
    const district = await fetch(`${process.env.GHN_REGION_API}/district`, {
        method: 'post',
        body: JSON.stringify(body),
        headers: { 
            token: process.env.GHN_TOKEN,
            'Content-Type': 'application/json'
        },
    }).then((res) => res.json());
    return district.data;        
}

exports.fetchGHNWards = async (districtId) => {
    const body = { "district_id": districtId }
    const ward = await fetch(`${process.env.GHN_REGION_API}/ward`, {
        method: 'post',
        body: JSON.stringify(body),
        headers: { 
            token: process.env.GHN_TOKEN,
            'Content-Type': 'application/json'
        },
    }).then((res) => res.json());
    return ward.data;        
}

exports.fetchGHNService = async (fromDistrict, toDistrict) => {
    const body = {
        "shop_id": parseInt(process.env.GHN_SHOP_ID),
        "from_district": fromDistrict,
        "to_district": toDistrict
    }
    const services = await fetch(`${process.env.GHN_SERVICE_API}/available-services`, {
        method: 'post',
        body: JSON.stringify(body),
        headers: { 
            token: process.env.GHN_TOKEN,
            'Content-Type': 'application/json'
        },
    }).then((res) => res.json());
    return services.data;        
}

exports.fetchGHNShippingFee = async (services, fromDistrict, toDistrict, toWard, weight) => {
    const body = {
        "service_id": services,
        "from_district_id": fromDistrict,
        "to_district_id": toDistrict,
        "to_ward_code": toWard,
        "weight": weight,
    }  
    const fee = await fetch(`${process.env.GHN_SERVICE_API}/fee`, {
        method: 'post',
        body: JSON.stringify(body),
        headers: { 
            token: process.env.GHN_TOKEN,
            'Content-Type': 'application/json'
        },
    }).then((res) => res.json());
    
    return fee.data;        
}

exports.fetchGHNShippingTime = async (services, fromDistrict, fromWard, toDistrict, toWard) => {
    const body = {
        "service_id": services,
        "from_district_id": fromDistrict,
        "from_ward_code": fromWard,
        "to_district_id": toDistrict,
        "to_ward_code": toWard
    }  
    const fee = await fetch(`${process.env.GHN_SERVICE_API}/leadtime`, {
        method: 'post',
        body: JSON.stringify(body),
        headers: { 
            token: process.env.GHN_TOKEN,
            'Content-Type': 'application/json'
        },
    }).then((res) => res.json());

    return fee.data;        
}