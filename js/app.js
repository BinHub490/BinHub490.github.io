'use strict';

var binLocations = [];

angular.module('ChirperApp', ['firebase'])
.controller('ChirperCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$firebaseAuth', function($scope, $firebaseObject, $firebaseArray, $firebaseAuth) {

	/* define reference to your firebase app */
	var ref = new Firebase("https://binhub.firebaseio.com");

	/* define reference to the "chirps" value in the app */
	var chirpsRef = ref.child("chirps");

	/* create a $firebaseArray for the chirps reference and add to scope */
	$scope.chirps = $firebaseArray(chirpsRef);


	$scope.addBin = function() {
		$scope.chirps.$add({
			organization: $scope.newOrganization,
			type: $scope.newType,
			x: $scope.newX,
			y: $scope.newY,
			likes: 0,
			comment: "testComment"
		}).then(function() {
			$scope.newLocation = '';
		});
	}
}])

// var map;
// function initMap() {
//   //map = new google.maps.Map(document.getElementById('map'), {
// //	center: {lat: 47.655601, lng: -122.308903},
// //	zoom: 15,
// //	mapTypeId: google.maps.MapTypeId.ROADMAP
//   //});
//
//   var myLatLng = {lat: 47.655601, lng: -122.308903};
//
//   var map = new google.maps.Map(document.getElementById('map'), {
// 	zoom: 15,
// 	center: myLatLng
//   });
//
//   var marker = new google.maps.Marker({
// 	position: myLatLng,
// 	map: map,
// 	draggable:true,
// 	title: 'Hello World!'
//   });
// }

var locations = [
     ['Title A', 47.658985,-122.306736, 1],
     ['Title B', 47.658378,-122.317035, 2],
     ['Title C', 47.655459,-122.314203, 3],
     ['Title D', 47.661283,-122.313731, 4]
];


function initMap() {

	/* define reference to your firebase app */
	var ref = new Firebase("https://binhub.firebaseio.com");

	var map = new google.maps.Map(document.getElementById('map'), {
	     zoom: 15,
	     center: {lat: 47.655601, lng: -122.308903},
	     mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	var infowindow = new google.maps.InfoWindow;

	// Adds a new marker on click
	map.addListener('click', function(e) {
		var marker = new google.maps.Marker({
			position: {lat: e.latLng.lat(), lng: e.latLng.lng()},
			map: map
		});
	});

	var marker, i;

	ref.once('value', function(dataSnapshot) {
		console.log(dataSnapshot.val().chirps);
		var locations = []

		for(var i in dataSnapshot.val().chirps)
    		locations.push([i, dataSnapshot.val().chirps[i]]);

		console.log(locations);

		for (i = 0; i < locations.length; i++) {
		    marker = new google.maps.Marker({
		         position: new google.maps.LatLng(locations[i][1].x, locations[i][1].y),
		         map: map
		    });

		    google.maps.event.addListener(marker, 'click', (function(marker, i) {
		         return function() {
		             infowindow.setContent(locations[i][1].organization);
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
