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

	static async daleteAddress(personId) {
		let conn = await db.getConnection();

		const rows = await conn.query(
			"SELECT `addressId` FROM `person` WHERE `personId`= ?",
			[personId]
		);

		if (rows.lenght === 1) {
			const addressId = rows[0].addressId;
			conn.query("DELETE FROM `address` WHERE `address`.`addressId` = ?", [
				addressId
			]);
			conn.query("DELETE FROM `person` WHERE `person`.`personId` = ?", [
				personId
			]);
			conn.end();
			return { deleted: {} };
		}
	}

	static async addAddress(person, address) {
		console.log(address);
		let connection = await db.getConnection();

		const addAddressResults = await connection.query(
			"INSERT INTO `address` (`street`, `city`, `province`, `country`, `postal`, `latlng`) VALUES ( ?, ?, ?, ?, ? PoinFromText('POINT(" +
				address.geometry.lat +
				" " +
				address.geometry.lng +
				")'));",
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
