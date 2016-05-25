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
		var geocoder     = new google.maps.Geocoder();
		var address      = $scope.newAddress;
		var organization = $scope.newOrganization;
		var website;
		var info;

		if(organization === "Big Brothers Big Sisters") {
			info = "Nation's largest donor and volunteer supported mentoring network. Big Brothers Big Sisters is a non profit organization which collects used clothing and household items to benefit mentoring programs that match kids with mentors.";
			website = "https://www.bbbsps.org/page.aspx?pid=191";
		} else if(organization === "Goodwill") {
			info = "On average, each of us throws 70 lbs. of clothes away every year. We want at least one of yours. By giving Goodwill a pound or more of your stuff, you’re helping a whole community. So donate to us today – and help make your local landfill a few pounds lighter.";
			website = "http://seattlegoodwill.org/";
		} else if(organization === "Northwest Center") {
			info = "Since 1965, Northwest Center advances equal opportunities for children and adults with developmental disabilities. They partner with Value Village and collect and deliver donated items to be re-sold at local stores.";
			website = "http://www.bigbluetruck.org/";
		} else if(organization === "The Salvation Army") {
			info = "The Salvation Army, an international movement, is an evangelical part of the universal Christian Church. Its message is based on the Bible. Its ministry is motivated by the love of God. Its mission is to preach the gospel of Jesus Christ and to meet human needs in His name without discrimination.";
			website = "http://www.salvationarmyusa.org/";
		} else if(organization === "Sight Connection") {
			info = "It is the mission of SightConnection to enhance the ability of people with vision loss to lead active, independent lives. Each year we help thousands of people with vision loss remain active and independent.  By donating your used clothing and household goods, you are not only helping us to provide vision rehabilitation services, but you benefit our planet by helping to keep items out of the landfill!"
			website = "http://www.donatesightconnection.org/";
		} else if(organization === "TexGreen Inc.") {
			info = "We are TexGreen - a textile recycling company, which strives to provide easy and convenient public recycling solutions for unwanted textiles. Our well-maintained recycle bins can be found in various retail locations, throughout the states of Washington and California. We strongly believe that clothes recycling should be easy and accessible to everybody.";
			website = "http://texgreenteam.com/";
		} else if(organization === "USAgain") {
			info = "USagain is a for-profit company that collects unwanted textiles and resells them in the U.S. and abroad, diverting millions of pounds of clothing from landfills. Founded in 1999, they provide consumers with a convenient and eco-friendly way to donate excess clothing through 12,000 collection bins in 16 states.";
			website = "http://www.usagain.com/";
		} else if(organization === "Value Village") {
			info = "Value Village, a Savers brand, is a for-profit, global thrift retailer offering great quality, gently used clothing, accessories and household goods. Our business model of purchasing, reselling and recycling gives communities a smart way to shop and keeps more than 650 million pounds of used goods from landfills each year. We also help more than 120 nonprofit organizations by paying them for donated goods, which supports their vital community programs and services. All in all, we operate over 330 locations and have 20,000 employees in Canada, the United States and Australia.";
			website = "https://www.valuevillage.com/";
		}

		geocoder.geocode({ 'address': address }, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				console.log(results[0]);
				$scope.bins.$add({
					organization: $scope.newOrganization,
					type: $scope.newType,
					x: (results[0].geometry.viewport.H.H + results[0].geometry.viewport.H.j) / 2,
					y: (results[0].geometry.viewport.j.H + results[0].geometry.viewport.j.j) / 2,
					address: $scope.newAddress,
					info: info,
					website: website,
					likes: 0,
					dislikes: 0,
					comment: "testComment"
				});
				var marker = new google.maps.Marker({
            		map: map,
            		position: results[0].geometry.location
        		});
			} else {
				alert("Geocode was not successful for the following reason: " + status);
			}
		});
	}

	$scope.like = function(bin) {
		var thisBinRef = binsRef.child(bin.$id);
		var likes = bin.likes;
		thisBinRef.update({
			"likes": likes + 1
		});
	}

	$scope.dislike = function(bin) {
		var thisBinRef = binsRef.child(bin.$id);
		var dislike = bin.dislikes;
		thisBinRef.update({
			"dislikes": dislike - 1
		});
	}

	$scope.enterZip = function() {
		var geocoder = new google.maps.Geocoder();
		if($scope.zip) {
			geocoder.geocode({ 'address': $scope.zip }, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					var zipX = (results[0].geometry.viewport.H.H + results[0].geometry.viewport.H.j) / 2;
					var zipY = (results[0].geometry.viewport.j.H + results[0].geometry.viewport.j.j) / 2;
					map.setCenter({
						lat: zipX,
						lng: zipY
					});
				} else {
					alert("Geocode was not successful for the following reason: " + status);
				}
			});
		}
	}
}])

var map;

// Function that creates map asynchronously
function initMap() {

	/* define reference to your firebase app */
	var ref                = new Firebase("https://binhub.firebaseio.com");
	var seattle            = new google.maps.LatLng(47.60621, -122.332071);
	var udistrict          = new google.maps.LatLng(47.657497, -122.312679);
	var browserSupportFlag = new Boolean();
	var initialLocation;

	var myOptions = {
		zoom: 15,
		center: udistrict,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	map = new google.maps.Map(document.getElementById("map"), myOptions);

	// // Try W3C Geolocation (Preferred)
	// if(navigator.geolocation) {
	// 	browserSupportFlag = true;
	// 	navigator.geolocation.getCurrentPosition(function(position) {
	//   		initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
	//   		map.setCenter(initialLocation);
	// 	}, function() {
	//   		handleNoGeolocation(browserSupportFlag);
	// 	});
	// } else { // Browser doesn't support Geolocation
	// 	browserSupportFlag = false;
	// 	handleNoGeolocation(browserSupportFlag);
	// }
	//
	// function handleNoGeolocation(errorFlag) {
	// 	if (errorFlag == true) {
	// 		alert("Geolocation service failed.");
	// 		initialLocation = newyork;
	// 	} else {
	// 		alert("Your browser doesn't support geolocation. We've placed you in Seattle.");
	// 		initialLocation = seattle;
	// 	}
	// 	map.setCenter(initialLocation);
	// }

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
				    '<p><b>Address: </b>' + locations[i][1].address +
			        '<p><b>Accepts: </b>' + locations[i][1].type + '</p>'+
					'<p><b>About: </b>' + locations[i][1].info + '</p>'+
					'<p><b>Website: </b> <a href="' + locations[i][1].website + '">' + locations[i][1].website + '</a> </p>' +
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
