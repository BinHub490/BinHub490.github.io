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
			organization: "testOrganization",
			type: "testType",
			location: $scope.newLocation,
			likes: 0,
			comment: "testComment"
		}).then(function() {
			$scope.newLocation= '';
		});
	}

}])

var map;
function initMap() {
  //map = new google.maps.Map(document.getElementById('map'), {
//	center: {lat: 47.655601, lng: -122.308903},
//	zoom: 15,
//	mapTypeId: google.maps.MapTypeId.ROADMAP
  //});

  var myLatLng = {lat: 47.655601, lng: -122.308903};

  var map = new google.maps.Map(document.getElementById('map'), {
	zoom: 15,
	center: myLatLng
  });

  var marker = new google.maps.Marker({
	position: myLatLng,
	map: map,
	draggable:true,
	title: 'Hello World!'
  });
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
