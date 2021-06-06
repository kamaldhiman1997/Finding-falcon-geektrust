import React, { Component } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import FindFalcon from '../components/FindFalcon';
import FalconFound from '../components/FoundFalcon';

class Routes extends Component {
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route path="/" exact component={FindFalcon} />
					<Route path="/falcon-found" exact component={FalconFound} />
					<Route
						path="**"
						component={() => {
							return (
								<section id="home" className="hero">
									<div className="hero-bg" style={{ background: '#ea4452' }}></div>
									<div className="container">
										<div className="row hero-padd">
											<div className="col-md-12 col-xs-12 col-sm-12">
												<div className="hero-text">
													<h2>Page Not Found</h2>
												</div>
											</div>
										</div>
									</div>
								</section>
							);
						}}
					/>
				</Switch>
			</BrowserRouter>
		);
	}
}

export default Routes;
