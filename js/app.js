'use strict';

var names = [];

angular.module('ChirperApp', ['firebase'])
.controller('ChirperCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$firebaseAuth', function($scope, $firebaseObject, $firebaseArray, $firebaseAuth) {

	/* define reference to your firebase app */
	var ref = new Firebase("https://sirfame-isabelle-app.firebaseio.com");

	/* define reference to the "chirps" value in the app */
	var chirpsRef = ref.child("chirps");

	/* define reference to the "users" value in the app */
	var usersRef = ref.child("users");

	/* create a $firebaseArray for the chirps reference and add to scope */
	$scope.chirps = $firebaseArray(chirpsRef);
	var arr = $firebaseArray(chirpsRef);
	console.log(typeof arr);
	console.log($firebaseArray(chirpsRef));
	var temp = arr.$getRecord("-K3LtNMxEPHgMdWTAx8a");
	console.log($firebaseArray(chirpsRef).length)

	arr.$loaded().then(function() {
        console.log("loaded record:", arr.$id);
       	// To iterate the key/value pairs of the object, use angular.forEach()
       	angular.forEach(arr, function(value, key) {
			names.push(value.$id);
			console.log(key, value.$id);
			console.log(names.length);
    	});
    });

	/* create a $firebaseObject for the users reference and add to scope (as $scope.users) */
	$scope.users = $firebaseObject(usersRef);

	var Auth = $firebaseAuth(ref);

	$scope.newUser = {};

	/* Write an accessible (on scope) chirp() function to save a tweet */

	   /* Add a new object to the tweets array by calling the
	      firebaseArray .$add method on the chirps $firebaseArray. Include:
	         text: the text in textarea,
	         userId:current user id (make "-1" for now),
	         likes:0,
	         time:Firebase.ServerValue.TIMESTAMP
	              // this tells firebase server to save the current time
	   */
	$scope.chirp = function() {
		$scope.chirps.$add({
			text: $scope.newChirp,
			userID: -1,
			likes: 0,
			time: Firebase.ServerValue.TIMESTAMP
		}).then(function() {
			$scope.newChirp= '';
		});
	}

	$scope.signUp = function() {
  	console.log("creating user " + $scope.newUser.email);
  	//pass in an object with the new 'email' and 'password'
  	Auth.$createUser({
    	'email': $scope.newUser.email,
    	'password': $scope.newUser.password
  	})
		.then($scope.signIn)
		.then(function() {
			//do stuff after signing in
			/* values in JSON (and Firebae) cannot be undefined.
     	if newUser.avatar is undefined, assign "img/no-pic.png" to it */
					if(newUser.avatar === undefined) {
						newUser.avatar = "img/no-pic.img";
					}
		  /* create an object with the 'handle' and 'avatar' of the newUser
		     assign this object to the value in the $scope.users object
		     with key of authData.uid (the user id of whoever is logged in) */
				var newUserInfo = {
				 'handle' : $scope.newUser.handle,
				 'avatar' : $scope.newUser.avatar
				};
				$scope.users[authData.uid] = newUserInfo;
		  /* call .$save() on the $scope.users object to save to the cloud */
				$scope.users.$save();
		  /* assign authData.uid to $scope.userId for our views to see */
				$scope.userId = authData.uid;
		})
  	.catch(function(error){
    	//error handling (called on the promise)
    	console.log(error);
  	})};

	$scope.signIn = function() {
		var promise = Auth.$authWithPassword({
	    'email': $scope.newUser.email,
	    'password': $scope.newUser.password
		});
		return promise;
	};

		//Make LogOut function available to views
	$scope.logOut = function() {
	   Auth.$unauth(); //"unauthorize" to log out
	};

	//Any time auth status updates, set the userId so we know
	Auth.$onAuth(function(authData) {
	   if(authData) { //if we are authorized
	      $scope.userId = authData.uid;
	   }
	   else {
	      $scope.userId = undefined;
	   }
	});

	//Test if already logged in (when page load)
	var authData = Auth.$getAuth(); //get if we're authorized
	if(authData) {
	   $scope.userId = authData.uid;
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
