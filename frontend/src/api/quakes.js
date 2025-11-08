import api from "./axios";

export const getEarthquakes = async () => {
	const res = await api.get('/data/earthquakes');
	console.log(res.data);
	return res.data;
};