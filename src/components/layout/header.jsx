import React from 'react';

function Header({ handleResetClick = () => {}, ...props }) {
	return (
		<header className="App-header">
			<h2>Finding Falcone!</h2>
			<div className="right-header-menu">
				<span className="menu-item" onClick={handleResetClick}>
					Reset
				</span>
				<span className="menu-item">|</span>
				<span onClick={() => window.open('https://www.geektrust.in/', '_blank')}>GeekTrust Home</span>
			</div>
		</header>
	);
}

export default Header;
