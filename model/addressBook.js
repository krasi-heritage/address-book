const db = require("../config/db");

module.exports = class {
	static async getAddresses() {
		let connection = await db.getConnection();
		const rows = await connection.query(
			"SELECT * FROM `person` JOIN address ON `person`.`addressId` = `address`.`addressId`"
		);
		connection.end();
		return rows;
	}

	static async addAddress(person, address) {
		let connection = await db.getConnection();

		const addAddressResults = await connection.query(
			"INSERT INTO `address` (`street`, `city`, `province`, `country`, `postal`) VALUES ( ?, ?, ?, ?, ?);",
			[
				address.street,
				address.city,
				address.province,
				address.country,
				address.postal
			]
		);

		const addressId = addAddressResults.insertId;

		const addPersonResults = await connection.query(
			"INSERT INTO `person` (`first`, `last`, `phone`, `addressId`) VALUES ( ?, ?, ?, ?);",
			[person.first, person.last, person.phone, person.addressId]
		);

		const personId = addPersonResults.insertId;

		connection.end();

		return { addressId: addressId, personId: personId };
	}
};
