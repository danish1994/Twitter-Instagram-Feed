var R = require("request")

var url = 'https://api.twitter.com/1.1/statuses/user_timeline.json'

var keys = require('./keys')

var bearer_token = keys.tw_bearer_token

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