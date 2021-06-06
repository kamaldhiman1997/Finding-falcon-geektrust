import { useEffect, useState } from 'react';
import '../../App.css';
import Dropdown from '../Elements/Dropdown';
import RadioBox from '../Elements/RadioBox';
import Header from '../layout/header';
import Footer from '../layout/footer';
import { findFalconRequest, getPlanets, getToken, getVehicles } from '../../services';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import Loader from 'react-loader-spinner';

function FindFalcon() {
	const intialStateUserSelection = {
		planets: [],
		vehicles: [],
	};

	let noOfDestination = 4;

	///Router Control
	const history = useHistory();

	///Local States
	const [loading, setLoading] = useState(true);
	const [apiLoader, setApiLoader] = useState(false);
	const [timeTaken, setTimeTaken] = useState(0);
	const [planetsList, setPlanetsList] = useState([]);
	const [vehiclesList, setVehiclesList] = useState([]);
	const [userSelection, setUserSelection] = useState(intialStateUserSelection);

	useEffect(() => {
		let mounted = true;
		if (mounted) {
			getAndSetPlanetList();
			setUserSelection(intialStateUserSelection);
		}
		return () => (mounted = false);
	}, []);

	/**
	 * Retrieve Planet from Api
	 */
	function getAndSetPlanetList() {
		getPlanets().then((items) => {
			if (items.length > 0) {
				setPlanetsList(items);
				getAndSetVehicleList();
			} else {
				swal('No planet found please try again later.', '', 'warning');
			}
		});
	}

	/**
	 * Retrieve Vehicle from Api
	 */
	function getAndSetVehicleList() {
		getVehicles().then((items) => {
			if (items.length > 0) {
				setVehiclesList(
					items.map((vehicle) => {
						vehicle['display_total_no'] = vehicle.total_no;
						return vehicle;
					})
				);
				setLoading(false);
			} else {
				swal('No vehicle found please try again later.', '', 'warning');
			}
		});
	}

	/**
	 * Handle Planet change
	 * @param {*} planet
	 * @param {*} index
	 */
	const handleDropdownChange = (planet, index) => {
		let cloneSelection = { ...userSelection };
		cloneSelection.planets[index] = planet;
		setUserSelection(cloneSelection);
	};

	/**
	 * Handle Selection of vehicle
	 * @param {*} vehicle
	 * @param {*} parentIndex
	 */
	const handleVehicleClick = (vehicle, parentIndex) => {
		let cloneSelection = { ...userSelection };
		cloneSelection.vehicles[parentIndex] = vehicle;
		setUserSelection(cloneSelection);
		let cloneVehicles = [...vehiclesList];
		const reFilteredList = cloneVehicles.map((vehicle, i) => {
			let existance = cloneSelection.vehicles.filter((v) => v.name === vehicle.name).length;
			vehicle.display_total_no = vehiclesList[i].total_no - existance;
			return vehicle;
		});
		setVehiclesList(reFilteredList);

		let totalTimeTaken = 0;

		cloneSelection.planets.forEach((planet, index) => {
			if (cloneSelection.vehicles[index]) {
				totalTimeTaken += planet.distance / cloneSelection.vehicles[index].speed;
			}
		});
		setTimeTaken(totalTimeTaken);
	};

	/**
	 * Create Html of destinations
	 * @returns
	 */
	function createDestinations() {
		let dropDowns = [];
		for (let i = 0; i < noOfDestination; i++) {
			dropDowns.push(
				<div className="destination-dropdown" key={i}>
					<label>Destination {i + 1}</label>
					<Dropdown
						key={i}
						parentKey={i}
						items={planetsList.filter((planet) => !userSelection.planets.includes(planet))}
						onChangeHandler={handleDropdownChange}
						intialValue="Select Planet"
						currentValue={userSelection.planets[i] !== undefined ? userSelection.planets[i] : { name: '' }}
					/>
					{createVehicles(i)}
				</div>
			);
		}
		return dropDowns;
	}

	/**
	 * Creat Html of Vehicles
	 * @param {*} i
	 * @returns
	 */
	function createVehicles(i) {
		let userSelectedPlanet = userSelection.planets[i];
		return (
			userSelectedPlanet &&
			planetsList.includes(userSelectedPlanet) && (
				<RadioBox
					userSelectedPlanet={userSelectedPlanet}
					userSelection={userSelection}
					list={vehiclesList}
					handleClick={handleVehicleClick}
					parentIndex={i}
				/>
			)
		);
	}

	/**
	 * Intiate Find falcon
	 */
	const findFalcon = async () => {
		setApiLoader(true);
		let token = await getToken()
			.then((token) => {
				return token.token;
			})
			.catch((error) => {});
		let requestBody = {
			token: token,
			planet_names: userSelection.planets.map((planet) => planet.name),
			vehicle_names: userSelection.vehicles.map((vehicle) => vehicle.name),
		};
		await findFalconRequest(requestBody).then((resp) => {
			if (resp.status && resp.status === 'success') {
				localStorage.setItem('planet_name', resp.planet_name);
				localStorage.setItem('time_taken', timeTaken);
				history.push('/falcon-found');
			} else if (resp.error) {
				swal('Token Error. Please refresh page and try again!', '', 'warning');
			} else {
				swal("Can't Find Falcon. Please try with different options.", '', 'warning');
			}
			setApiLoader(false);
		});
	};

	return (
		<>
			<Header
				handleResetClick={() => {
					setUserSelection(intialStateUserSelection);
					setTimeTaken(0);
				}}
			/>
			{loading ? (
				<>
					<h2>Please wait we are loading your planets and vehicle list:</h2>
					<Loader type="Bars" color="#00BFFF" height={80} width={80} />
				</>
			) : (
				<>
					{' '}
					<h2>Select planets where you search in:</h2>
					<div className="search-area">
						{createDestinations()}
						<h2 className="time-taken">Time Taken : {timeTaken}</h2>
					</div>
					<br />
					<div className="intiate-search">
						<button
							disabled={userSelection.vehicles.length !== 4 || apiLoader}
							className="find-falcon"
							onClick={findFalcon}
						>
							{apiLoader ? 'Finding' : 'Find Falcone'}
						</button>
					</div>
				</>
			)}
			<Footer />
		</>
	);
}

export default FindFalcon;
