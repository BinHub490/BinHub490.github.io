'use strict';

angular.module('BinHubApp', ['firebase'])
.controller('BinHubCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$firebaseAuth', function($scope, $firebaseObject, $firebaseArray, $firebaseAuth) {

	/* define reference to your firebase app */
	var ref = new Firebase("https://binhub.firebaseio.com");

	/* define reference to the "chirps" value in the app */
	var binsRef = ref.child("bins");

	/* create a $firebaseArray for the chirps reference and add to scope */
	$scope.bins = $firebaseArray(binsRef);

	$scope.addBin = function() {
		var geocoder = new google.maps.Geocoder();
		var address = $scope.newAddress;
		geocoder.geocode({ 'address': address }, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				$scope.bins.$add({
					organization: $scope.newOrganization,
					type: $scope.newType,
					x: (results[0].geometry.viewport.H.H + results[0].geometry.viewport.H.j) / 2,
					y: (results[0].geometry.viewport.j.H + results[0].geometry.viewport.j.j) / 2,
					address: $scope.newAddress,
					likes: 0,
					comment: "testComment"
				});
			} else {
				alert("Geocode was not successful for the following reason: " + status);
			}
		});
	}

	$scope.like = function(bin) {
		bin.likes = bin.likes + 1;
	}
}])

// Function that creates map asynchronously
function initMap() {

	/* define reference to your firebase app */
	var ref = new Firebase("https://binhub.firebaseio.com");

	// Defines map centered at UW
	var map = new google.maps.Map(document.getElementById('map'), {
	     zoom: 15,
	     center: {lat: 47.655601, lng: -122.308903},
	     mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	// Adds a new marker on click
	// map.addListener('click', function(e) {
	// 	var marker = new google.maps.Marker({
	// 		position: {lat: e.latLng.lat(), lng: e.latLng.lng()},
	// 		map: map
	// 	});
	// });

	// Async function, once firebase array is loaded, map is populated
	ref.once('value', function(dataSnapshot) {
		// console.log(dataSnapshot.val().chirps);

		var locations = []
		var marker, i;
		var infowindow = new google.maps.InfoWindow;

		for(var i in dataSnapshot.val().bins) {
			locations.push([i, dataSnapshot.val().bins[i]]);
		}

		// console.log(locations);

		for (i = 0; i < locations.length; i++) {

			// Creates a new marker with latlng from DB
		    marker = new google.maps.Marker({
		         position: new google.maps.LatLng(locations[i][1].x, locations[i][1].y),
		         map: map
		    });

			// Creates a description infobox for each marker
		    google.maps.event.addListener(marker, 'click', (function(marker, i) {
				var contentString = '<div id="content">'+
					'<div id="siteNotice">'+
			    	'</div>'+
			        '<h1 id="firstHeading" class="firstHeading">' + locations[i][1].organization + ' Bin</h1>'+
			        '<div id="bodyContent">'+
				    '<p><b>Address: </b>' + locations[i][1].x + ', ' + locations[i][1].y +
			        '<p><b>Accepts: </b>' + locations[i][1].type + '</p>'+
			        '</div>'+
			        '</div>';
		         return function() {
		             infowindow.setContent(contentString);
		             infowindow.open(map, marker);
		         }
		    })(marker, i));
		}
	});
}

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");
var submitbtn = document.getElementById("submit")

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

submitbtn.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


        var checkList = document.getElementById('list1');
        checkList.getElementsByClassName('anchor')[0].onclick = function (evt) {
            if (checkList.classList.contains('visible'))
                checkList.classList.remove('visible');
            else
                checkList.classList.add('visible');
        }

        checkList.onblur = function(evt) {
            checkList.classList.remove('visible');
        }
