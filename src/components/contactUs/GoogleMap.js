import React, { Component } from 'react';

// const GoogleMap = () => {
// 	return <div></div>;
// };
// export default GoogleMap;

import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

export class GoogleMap extends Component {
	constructor(props) {
		super(props);

		this.state = {
			stores: [
				{ latitude: 33.93054, longitude: -83.36481 },
				{ latitude: 38.90133, longitude: -77.03653 }
			]
		};
	}

	displayMarkers = () => {
		return this.state.stores.map((store, index) => {
			return (
				<Marker
					key={index}
					id={index}
					position={{
						lat: store.latitude,
						lng: store.longitude
					}}
					// onClick={() => console.log('You clicked me!')}
				/>
			);
		});
	};

	render() {
		return (
			<Map
				google={this.props.google}
				zoom={5}
				initialCenter={{ lat: 37.90133, lng: -83.36481 }}>
				{this.displayMarkers()}
			</Map>
		);
	}
}

export default GoogleApiWrapper({
	apiKey: 'AIzaSyD9EdV2JfPG1Vfviw9gf_HlblIUfs7Ie2E'
})(GoogleMap);
