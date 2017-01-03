$(document).ready(function() {

})

var mapRef
var markers = []

var http = location.protocol;
var slashes = http.concat("//");
var host = slashes.concat(window.location.hostname);

function search(query){
	$.ajax({
		url: host + "/search/tweets/" + query,
		success: function(results){
			counter = 0
			$.each(results, function(i, result){
	        	if(counter < 20){
	        		if(result.geo){
	        			counter++;
	        			var latlng = new google.maps.LatLng(result.geo.coordinates[0],result.geo.coordinates[1])
	        			
	        			var marker = new google.maps.Marker({
						    position: latlng,
						    title: "Tweet"
						})
						
						var infowindow = new google.maps.InfoWindow({
							content: contentString(result)
						})

						marker.addListener('click', function() {
							infowindow.open(mapRef, marker)
						})

						markers.push(marker)
	        		}
	        	}
	        })
			showMarkers()
	    },
	    error: function(err){
	    	console.log(err)
	    }
	})
}

function contentString(tweet){
	res = '<div>' + tweet.text + '</div>'
	return res
}

function setMapOnAll(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map)
	}
}

function clearMarkers() {
	setMapOnAll(null)
}

function showMarkers() {
	setMapOnAll(mapRef)
}

function deleteMarkers() {
	clearMarkers()
	markers = []
}

function initMap() {
	var center = {lat: 51.5033640, lng: -0.1276250}
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 1,
		center: center
	})
	mapRef = map
}

$('#search-form').submit(function(event){
	event.preventDefault()
	deleteMarkers()
	var query = $(this).serialize().split("=")[1]
	search(query)
})

$('#refresh').click(function(){
	var query = $('#search-text').val()
	deleteMarkers()
	search(query)
})