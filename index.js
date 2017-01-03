var express = require('express')
var request = require('request')
var app     = express()
var twitter = require('twitter')
var path = require('path')

var port = process.env.PORT || 8082


var keys = require('./keys')

var key = keys.key
var secret = keys.secret
var bearer_token = keys.bearer_token


//Making Path Public
app.use(express.static(path.join(__dirname, '/public')))

//Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

//Route to Home Page
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/public/index.html'))
})


app.get('/search/tweets/:query', function(req, res){  
    getTweets(req.params.query, res)
})

var getTweets = function(search, res){
	try{
		var client = new twitter({
		  consumer_key: key,
		  consumer_secret: secret,
		  bearer_token: bearer_token
		})

		client.get('search/tweets', {q: search, count: 100}, function(error, tweets, response) {
			res.send(tweets.statuses)
		})
	}catch(err){
		console.log(err)
	}
}

app.listen(port)

exports = module.exports = app