var R = require("request")

var url = 'https://api.twitter.com/1.1/statuses/user_timeline.json'
var bearerToken = 'AAAAAAAAAAAAAAAAAAAAAOVvygAAAAAAob21OGJMB9idQeF2Hv0mfdjsIQM%3DWbv6F1mBkFEiNhwXuA0rXfYdEHXbwqVMzkAglGe2sEaNxjmqEJ'


var testBearerToken = function(bearerToken){
	R({ url: url,
	    method:'GET',
	    qs:{"screen_name":"stadolf"},
	    json:true,
	    headers: {
	        "Authorization": "Bearer " + bearerToken
	    }

	}, function(err, resp, body) {
	    console.log(body)
	})
}