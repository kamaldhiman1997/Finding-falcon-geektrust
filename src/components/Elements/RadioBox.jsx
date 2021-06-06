import React from 'react';

function RadioBox({
	list = [],
	handleClick = () => {},
	userSelection = { vehicles: [], planets: [] },
	userSelectedPlanet = { planets: [], vehicles: [] },
	parentIndex = 0,
	...props
}) {
	return (
		<>
			<p>Selected Planet:{userSelectedPlanet.name}</p>
			{list.map((vehicle, index) => {
				let disabled =
					(vehicle.display_total_no === 0 &&
						userSelection.vehicles[parentIndex] &&
						userSelection.vehicles[parentIndex].name !== vehicle.name) ||
					userSelection.planets[parentIndex].distance > vehicle.max_distance ||
					(vehicle.display_total_no === 0 && userSelection.vehicles[parentIndex] === undefined);
				return (
					<div className="vehicle-list" key={index}>
						<input
							id={userSelectedPlanet.name + index}
							name={userSelectedPlanet.name}
							type="radio"
							value={vehicle.name}
							onChange={() => handleClick(vehicle, parentIndex)}
							checked={userSelection.vehicles[parentIndex] === vehicle ? true : false}
							disabled={disabled}
						/>
						<label htmlFor={userSelectedPlanet.name + index} className={disabled ? 'disabled' : ''}>
							{vehicle.name}({vehicle.display_total_no})
						</label>
					</div>
				);
			})}
		</>
	);
}

export default RadioBox;
