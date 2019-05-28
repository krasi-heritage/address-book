mapboxgl.accessToken =
	"pk.eyJ1Ijoia2twYXNpIiwiYSI6ImNqdnh6YTJrazBhZ3A0YW1xc2dreTFzb2cifQ.Dt7PUa-U7f684vacUr2MqQ";

const addressBook = {
	list: "http://localhost:9000/api/addressbook/"
};

const initMap = container => {
	const map = new mapboxgl.Map({
		container: container,
		style: "mapbox://styles/kkpasi/cjvxzf4z41ehi1cnoumy9yy4a",
		center: [-122.307545, 38.229971],
		zoom: 7.1
	});
	return map;
};

const entryClick = (map, el) => {
	// console.log(el.dataset["lat"], el.dataset["lng"]);
	map.easeTo({ center: [el.dataset["lng"], el.dataset["lat"]] });
};

document.addEventListener("DOMContentLoaded", async () => {
	const elPeople = document.getElementById("people");
	const parent = document.createElement("span");

	let map = initMap("map");
	let markers = [];
	const data = await fetch(addressBook.list);
	const dataJson = await data.json();

	dataJson.forEach(element => {
		console.log(element);

		let tmpMarker = new mapboxgl.Marker().setLngLat([
			element.latlng.coordinates[1],
			element.latlng.coordinates[0] ]) 
				.addTo(map),
		markers.push(tmpMarker);

		const tEl = document.createElement("div");
		tEl.id = element.personId;
		tEl.dataset["lat"] = element.latlng.coordinates[0];
		tEl.dataset["lng"] = element.latlng.coordinates[1];
		tEl.classList.add("person");

		const name = document.createElement("div");

		name.innerHTML = element.first + " " + element.last;
		tEl.appendChild(name);

		const phone = document.createElement("div");
		phone.classList.add("phone");
		phone.innerHTML = element.phone;
		tEl.appendChild(phone);

		const address = document.createElement("div");
		address.classList.add("address");

		const addrElements = ["street", "city", "province", "country", "postal"];
		addrElements.forEach(e => {
			if (element[e] !== undefined) {
				const el = document.createElement("div");
				el.classList.add(e);
				el.innerHTML = element[e];
				address.appendChild(el);
			}
		});

		tEl.appendChild(address);

		// phone.innerHTML = element.address;
		// tEl.appendChild(address);

		tEl.addEventListener("click", () => {
			entryClick(tEl);
		});

		parent.appendChild(tEl);
	});

	elPeople.appendChild(parent);
});
