const router = require("express").Router();
const addressBookController = require("../../controllers/addressBook");

router.get("/", (req, res) => {
	const result = addressBookController.allAddresses(req, res);

	return result;
});

router.get("/deleteAddress/:id", (req, res) => {
	const id = parseInt(req.params.id);
	return addressBookController.allAddresses(req, res, id);
});

router.post("/addAddress/", (req, res) => {
	const result = addressBookController.addAddress(req, res);
	return result;
});

module.exports = router;
