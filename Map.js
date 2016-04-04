$(function() {

	var globalMap;

		var currAirport = {};
		var marker = {};
		var currMarkerId;

		var MapFcns = {

				loadSiteList: function() {
						var airportList = $('#airport-list');
						airportList.html('');
						airportList.append('<option value=""></option>');

						//sort by airport codes
						var sortedSites = [];
						sortedSites = _.sortBy(sites, function(a) {
								return a.Code;
						});

						for (var i in sortedSites) {
								var newOption = $('<option value="' + sortedSites[i].Code + '">' + sortedSites[i].Code + '</option>');
								airportList.append(newOption);
						}

				},

				clear: function() {
						currAirport = {};
						$('#remove-airport').hide();
						$('#airport-list').prop('selectedIndex', -1); //reset select box

						$('#setting-code').text('');
						$('#setting-city').text('');
						$('#setting-state').text('');
						$('#setting-name').text('');
						$('#setting-lat').text('');
						$('#setting-long').text('');
				},

				siteListChange: function() {
						var ctl = $(this);
						airportCode = ctl.val();

						if (airportCode) {


								//if airport same as current selection then exit
								if (currAirport.Code === airportCode)
										return;

								currAirport = _.findWhere(sites, {
										Code: airportCode
								});

								$('#setting-code').text(currAirport.Code);
								$('#setting-city').text(currAirport.City);
								$('#setting-state').text(currAirport.State);
								$('#setting-name').text(currAirport.FullSiteName);
								$('#setting-lat').text(currAirport.Latitude);
								$('#setting-long').text(currAirport.Longitude);

								var point = {
										lat: currAirport.Latitude,
										lng: currAirport.Longitude
								};

								marker = new google.maps.Marker({
										id: currAirport.Code,
										position: point,
										map: globalMap,
										title: currAirport.Code
								});

								//move to the marker position
								globalMap.panTo(point);

								$('#remove-airport').show(); //since selected airport, give option to remove
						}
				},

				removeSite: function() {
						if (currAirport) {
								marker.setMap(null);
								this.clear();
						}
						return false;
				}

		}


		MapFcns.loadSiteList();
		$('#airport-list').change(MapFcns.siteListChange);
		$('#remove-airport').hide(); //hide remove button initially, until selection is made
		$('#remove-airport').click(function(evt) {
				evt.preventDefault(); //stop anchor from performing default behaviour
				MapFcns.removeSite();
		});
		$('#exercise-toggle').click(function() {
				var toggleCtl = $(this),
						toggleVal = toggleCtl.text();
				if (toggleVal == '-') {
						toggleCtl.text('+');
						$('#exercise-instructions').hide();
				} else {
						toggleCtl.text('-');
						$('#exercise-instructions').show();
				}
		});




function initMap() {
		// Callback function to create a map object and specify the DOM element for display.
		globalMap = new google.maps.Map(document.getElementById('airport-map'), {
				center: {
						lat: 42.2814,
						lng: -83.7483
				},
				scrollwheel: true,
				zoom: 6
		});
}

//once the window has loaded, initialise the map
window.onload = initMap;
});
