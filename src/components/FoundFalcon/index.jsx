import { useEffect } from 'react';
import '../../App.css';
import Header from '../layout/header';
import Footer from '../layout/footer';
import { useHistory } from 'react-router-dom';

function FalconFound() {
	///Router Control
	const history = useHistory();

	let timeTaken;
	let planetName;

	useEffect(() => {
		localStorage.getItem('planet_name') === null &&
			localStorage.getItem('time_taken') === null &&
			history.push('/');

		return () => {
			localStorage.removeItem('planet_name');
			localStorage.removeItem('time_taken');
			return;
		};
	}, [history]);

	///Get and set value from local storage
	if (localStorage.getItem('planet_name') !== null) {
		planetName = localStorage.getItem('planet_name');
		timeTaken = localStorage.getItem('time_taken');
	}

	/**
	 * Handke Start Again Click
	 */
	const handleStartClick = () => {
		localStorage.removeItem('planet_name');
		localStorage.removeItem('time_taken');
		history.push('/');
	};

	return (
		<>
			<Header handleResetClick={handleStartClick} />
			<div>
				<h2>Success! Congratulations on Finding Falcon. King Shan is mighty pleased.</h2>
			</div>
			<br />
			<div>
				<h2>Time Taken: {timeTaken}</h2>
			</div>
			<div>
				<h2>Planet Found: {planetName}</h2>
			</div>
			<div className="intiate-search">
				<button className="find-falcon" onClick={handleStartClick}>
					Start Again
				</button>
			</div>
			<Footer />
		</>
	);
}

export default FalconFound;
