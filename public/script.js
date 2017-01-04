$(document).ready(function() {
	$('.refresh').hide()
})

var mapRef
var markers = []
var feeds = []

function search(query){
	$('#loading-modal').modal('show')
	$('.feed-container').empty()
	feeds = []
	$.ajax({
		url: "/search/tweets/" + query,
		success: function(tweets){
			$.each(tweets, function(i, result){
				feeds.push({
					src: 'twitter',
					feed: result.text,
					epoch: result.date,
					geo: result.geo,
					date: new Date(result.date),
					image: result.image
				})
	        })
	    },
	    error: function(err){
			$('#loading-modal').modal('hide')
	    	console.log(err)
	    }
	}).then(function(){
		$.ajax({
			url: "/search/insta/" + query,
			success: function(instas){
				counter = 0
				$.each(instas, function(i, result){
					feeds.push({
						src: 'instagram',
						feed: result.caption,
						epoch: result.date*1000,
						geo: result.geo,
						date: new Date(result.date*1000),
						image: result.thumbnail_src
					})
		        })
				showMarkers()
		    },
		    error: function(err){
				$('#loading-modal').modal('hide')
		    	console.log(err)
		    }
		}).then(function(){
			counter = 0
			feeds.sort(function(a, b) {
				return parseFloat(b.epoch) - parseFloat(a.epoch);
			})
			$.each(feeds, function(i, result){
	        	if(counter < 20){
	        		if(result.geo){
	        			counter++;
	        			var latlng = new google.maps.LatLng(result.geo.coordinates[0],result.geo.coordinates[1])
	        			
	        			var marker = new google.maps.Marker({
						    position: latlng,
						    title: "News Feed"
						})
						
						var infowindow = new google.maps.InfoWindow({
							content: contentString(result.feed)
						})

						marker.addListener('click', function() {
							infowindow.open(mapRef, marker)
						})

						markers.push(marker)
	        		}
	        	}
	        	$('.feed-container').append(feedPrototype(result))
	        })

			console.log(feeds)
	        showMarkers()
			$('#loading-modal').modal('hide')
		})
	})
}

function contentString(feed){
	res = '<div>' + feed + '</div>'
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
	$('.refresh').show()
})

$('#refresh').click(function(){
	var query = $('#search-text').val()
	deleteMarkers()
	search(query)
})

function feedPrototype(feed){
	res = '<div class="col-sm-10 col-sm-offset-1 feed">'
		+ '<div class="row">'
		+  '<div class="col-sm-12 date">'
		+ feed.date
		+  '</div>'
	if(feed.image != undefined){
		res += '<div class="col-sm-12 text-center">'
			+ '<image class="feed-image" src="'+ feed.image +'">'
			+ '</div>'
	}
	res += '<div class="col-sm-12 text-justify">'
		+ feed.feed
		+ '</div>'
		+ '<div class="col-sm-12 text-right source text-capitalize">'
		+ 'From ' + feed.src
		+ '</div>'
		+ '</div>'
		+ '</div>'

	return res
}