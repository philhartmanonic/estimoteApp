var app = (function()
{
	// Application object.
	var app = {};

	// Dictionary of beacons.
	var beacons = {};

	// Timer that displays list of beacons.
	var updateTimer = null;
	var updateOther = null;

	app.initialize = function()
	{
		document.addEventListener(
			'deviceready',
			function() { evothings.scriptsLoaded(onDeviceReady) },
			false);
	};

	function onDeviceReady()
	{
		// Start tracking beacons!
		startScan();

		// Display refresh timer.
		updateTimer = setInterval(displayBeaconList, 1000);
	}

	function startScan()
	{
		function onBeaconsRanged(beaconInfo)
		{
			//console.log('onBeaconsRanged: ' + JSON.stringify(beaconInfo))
			for (var i in beaconInfo.beacons)
			{
				// Insert beacon into table of found beacons.
				// Filter out beacons with invalid RSSI values.
				var beacon = beaconInfo.beacons[i];
				if (beacon.rssi < 0)
				{
					beacon.timeStamp = Date.now();
					var key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
					beacons[key] = beacon;
				}
			}
		}

		function onError(errorMessage)
		{
			console.log('Ranging beacons did fail: ' + errorMessage);
		}

		// Request permission from user to access location info.
		// This is needed on iOS 8.
		estimote.beacons.requestAlwaysAuthorization();

		// Start ranging beacons.
		estimote.beacons.startRangingBeaconsInRegion(
			{}, // Empty region matches all beacons
			    // with the Estimote factory set UUID.
			onBeaconsRanged,
			onError);
	}

	function displayBeaconList()
	{
		// Clear beacon list.
		$('#found-beacons').empty();

		var timeNow = Date.now();
		var counter = 0;
		// var beaconOrderList = [10];

		// Update beacon list.
		$.each(beacons, function(key, beacon)
		{
			// Only show beacons that are updated during the last 60 seconds.
			if (beacon.timeStamp + 60000 > timeNow)
			{
				contextHTML(beacon);
				// if (counter === 0) {
				//  	beaconOrderList.push(beacon.major);
				//  	counter++;
				// } else {
				// 	beaconOrderList
				// 	counter++;
				// }
			}
		});
	}

	function distance(beacon)
	{
		var meters = beacon.distance;
		if (!meters) { return ''; }

		return meters.toFixed(3);
	}

	function sortBeacons(beacon, dist) {
		
	}

	function contextHTML(beacon)
	{
		// list of majors: 45403, 8247, 48915
		//$('#found-beacons').append(distance(beacon));
		if (beacon.major === 8247) {
			if (distance(beacon) < 5) {
				$('#found-beacons').append('<img class="card" src="ui/images/arch.png" />');
			} else {
				$('#found-beacons').append(distance(beacon));
			}
        } else if (beacon.major === 45403) {
			if (distance(beacon) < 5) {
				$('#found-beacons').append('<img class="card" src="ui/images/gardening.png" />');
			} else {
				$('#found-beacons').append(distance(beacon));
			}
	    } else if (beacon.major === 48915) {
			if (distance(beacon) < 5) {
				$('#found-beacons').append('<img class="card" src="ui/images/scott.png" />');
			} else {
				$('#found-beacons').append(distance(beacon));
			}
	    }
	}
		function proximityHTML(beacon)
	{
		var proximity = beacon.proximity;
		if (!proximity) { return ''; }

		var proximityNames = [
			'Unknown',
			'Immediate',
			'Near',
			'Far'];

		return proximityNames[proximity];
	}
	function rssiHTML(beacon)
	{
		var beaconColors = [
			'rgb(214,212,34)', // unknown
			'rgb(215,228,177)', // mint
			'rgb(165,213,209)', // ice
			'rgb(45,39,86)', // blueberry
			'rgb(200,200,200)', // white
			'rgb(200,200,200)', // transparent
		];

		// Get color value.
		var color = beacon.color || 0;
		// Eliminate bad values (just in case).
		color = Math.max(0, color);
		color = Math.min(5, color);
		var rgb = beaconColors[color];

		// Map the RSSI value to a width in percent for the indicator.
		var rssiWidth = 1; // Used when RSSI is zero or greater.
		if (beacon.rssi < -100) { rssiWidth = 100; }
		else if (beacon.rssi < 0) { rssiWidth = 100 + beacon.rssi; }
		// Scale values since they tend to be a bit low.
		rssiWidth *= 1.5;

		var html =
			'RSSI: ' + beacon.rssi + '<br />'
			+ '<div style="background:' + rgb + ';height:20px;width:'
			+ 		rssiWidth + '%;"></div>'

		return html;
	}

	return app;
})();

app.initialize();
