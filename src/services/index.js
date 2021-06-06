const rootUrl = 'https://findfalcone.herokuapp.com';
/**
 * Fetch Planets List
 * @returns
 */
export function getPlanets() {
	return fetch(`${rootUrl}/planets`)
		.then((data) => data.json())
		.catch((error) => {
			alert('Failed to Fetch Planets.');
		});
}

/**
 * Fetch Vehicles List
 * @returns
 */
export function getVehicles() {
	return fetch(`${rootUrl}/vehicles`)
		.then((data) => data.json())
		.catch((error) => {
			alert('Failed to Fetch Vehicles.');
		});
}

/**
 * Get Token
 * @returns
 */
export function getToken() {
	const requestOptions = {
		method: 'POST',
		headers: { Accept: 'application/json' },
		body: null,
	};
	return fetch(`${rootUrl}/token`, requestOptions)
		.then((data) => data.json())
		.catch((error) => {
			alert('Failed to Fetch Token.');
		});
}

/**
 * Start finding falcon
 * @param {*} requestBody
 * @returns
 */
export function findFalconRequest(requestBody) {
	const requestOptions = {
		method: 'POST',
		headers: { Accept: 'application/json' },
		body: JSON.stringify(requestBody),
	};
	return fetch(`${rootUrl}/find`, requestOptions).then((data) => data.json());
}
