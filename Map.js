
var globalMap;
var markers = {};

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

    MapFcns.loadSiteList();
    $('#airport-list').change(MapFcns.siteListChange);
    $('#remove-airport').hide(); //hide remove button initially, until selection is made
    $('#remove-airport').click(function(evt) {
        evt.preventDefault(); //stop anchor from performing default behaviour
        MapFcns.removeSite();
    });
}


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
            var currentCode = ctl.val();

            currAirport = _.findWhere(sites, {
                Code: currentCode
            });

            if (currAirport) {

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

                //real pain finding this, this is required for setMap(null) to work
                //for a given marker, this is to avoid errors when going to marker second time
                if(!markers[currAirport.Code]) {
                  markers[currAirport.Code] = new google.maps.Marker({
                    id: currAirport.Code,
                    position: point,
                    map: globalMap,
                    title: currAirport.Code
                  });
              }

                //move to the marker position
                globalMap.panTo(point);

                $('#remove-airport').show(); //since selected airport, give option to remove
            }
        },

        removeSite: function() {

            //if (currAirport) {
              console.log(markers[currAirport.Code]);

                markers[currAirport.Code].setMap(null);
                markers[currAirport.Code] = null;

                console.log(markers[currAirport.Code]);
            //}
            //return false;
        }

    }
