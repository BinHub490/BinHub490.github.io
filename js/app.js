'use strict';

var names = [];

angular.module('ChirperApp', ['firebase'])
.controller('ChirperCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$firebaseAuth', function($scope, $firebaseObject, $firebaseArray, $firebaseAuth) {

	/* define reference to your firebase app */
	var ref = new Firebase("https://binhub.firebaseio.com");

	/* define reference to the "chirps" value in the app */
	var chirpsRef = ref.child("chirps");

	/* define reference to the "users" value in the app */
	var usersRef = ref.child("users");

	/* create a $firebaseArray for the chirps reference and add to scope */
	$scope.chirps = $firebaseArray(chirpsRef);

	// var arr = $firebaseArray(chirpsRef);
	// console.log(typeof arr);
	// console.log($firebaseArray(chirpsRef));
	// var temp = arr.$getRecord("-K3LtNMxEPHgMdWTAx8a");
	// console.log($firebaseArray(chirpsRef).length)
	//
	// arr.$loaded().then(function() {
    //     console.log("loaded record:", arr.$id);
    //    	// To iterate the key/value pairs of the object, use angular.forEach()
    //    	angular.forEach(arr, function(value, key) {
	// 		names.push(value.$id);
	// 		console.log(key, value.$id);
	// 		console.log(names.length);
    // 	});
    // });

	/* Write an accessible (on scope) chirp() function to save a tweet */

	   /* Add a new object to the tweets array by calling the
	      firebaseArray .$add method on the chirps $firebaseArray. Include:
	         text: the text in textarea,
	         userId:current user id (make "-1" for now),
	         likes:0,
	         time:Firebase.ServerValue.TIMESTAMP
	              // this tells firebase server to save the current time
	   */
	$scope.addBin = function() {
		$scope.chirps.$add({
			organization: $scope.newOrganization,
			type: $scope.newType,
			location: $scope.newLocation,
			likes: 0,
			comment: "testComment"
		}).then(function() {
			$scope.newLocation= '';
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
     ['Title A', 3.180967,101.715546, 1],
     ['Title B', 3.200848,101.616669, 2],
     ['Title C', 3.147372,101.597443, 3],
     ['Title D', 3.19125,101.710052, 4]
];
function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
	     zoom: 12,
	     center: new google.maps.LatLng(3.171368,101.653404),
	     mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	var infowindow = new google.maps.InfoWindow;

	var marker, i;

	for (i = 0; i < locations.length; i++) {
	    marker = new google.maps.Marker({
	         position: new google.maps.LatLng(locations[i][1], locations[i][2]),
	         map: map
	    });

	    google.maps.event.addListener(marker, 'click', (function(marker, i) {
	         return function() {
	             infowindow.setContent(locations[i][0]);
	             infowindow.open(map, marker);
	         }
	    })(marker, i));
	}
}


// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
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
