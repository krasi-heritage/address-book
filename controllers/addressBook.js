const addressBookModel = require("../model/addressBook");
const fetch = require("node-fetch");
const config = require("../config/config");

module.exports = class {
	static async allAddresses(req, res) {
		const data = await addressBookModel.getAddresses();

		return res.json(data);
	}

	static async deleteAddress(req, res, id) {
		return await res.json(addressBookModel.deleteAddress(id));
	}

	static async addAddress(req, res) {
		const data = req.body;

		let person = {
			fist: data.first == undefined ? "" : data.first,
			last: data.last == undefined ? "" : data.last,
			phone: data.phone == undefined ? "" : data.phone
		};

		let address = {
			street: data.street == undefined ? "" : data.street,
			city: data.city == undefined ? "" : data.city,
			province: data.province == undefined ? "" : data.province,
			country: data.country == undefined ? "" : data.country,
			postal: data.postal == undefined ? "" : data.postal
		};

		const reqURI = config.geocodeURI(
			Object.values(address)
				.join(" ")
				.trim()
		);
		//console.log(reqURI);
		const geoResult = await fetch(reqURI);
		const geoResultJson = await geoResult.json();
		console.log(geoResultJson);

		if (geoResultJson.results.length > 0) {
			const result = geoResultJson.results[0];
			// console.log(result);
			if (result.components) {
				if (address.street === "" && result.components.road) {
					address.street = result.components.road;
				} else if (address.city === "" && result.components.city) {
					address.city = result.components.city;
				} else if (address.city === "" && result.components.town) {
					address.city = result.components.town;
				} else if (address.province === "" && result.components.state) {
					address.province = result.components.state;
				} else if (address.country === "" && result.components.country) {
					address.country = result.components.country;
				} else if (address.postal === "" && result.components.postcode) {
					address.postal = result.components.postcode;
				}

				if (result.geometry) {
					address.geometry = result.geometry;
					address.geometry.lat = parseFloat(address.geometry.lat);
					address.geometry.lng = parseFloat(address.geometry.lng);
				}
			}
		}

		//console.log(address);

		//const result = await addressBookModel.addAddress(person, address);

		return res.json(address);
	}
};
