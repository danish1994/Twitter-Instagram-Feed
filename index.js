var express = require('express')
var request = require('request')
var app     = express()
var twitter = require('twitter')
var path = require('path')
var cheerio = require('cheerio')
var phantom = require('phantom')
// var phantom = require('x-ray-phantom')
var Xray = require('x-ray')

var ig = require('instagram-node').instagram()


var ig_ts = require('instagram-tagscrape')

var port = process.env.PORT || 8082


var keys = require('./keys')

var tw_key = keys.tw_key
var tw_secret = keys.tw_secret
var tw_bearer_token = keys.tw_bearer_token
var ig_key = keys.ig_key
var ig_secret = keys.ig_secret
var ig_access_token = ig_access_token

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

app.get('/search/insta/:query', function(req, res){
	getInsta(req.params.query, res)
})

var getTweets = function(search, res){
	try{
		var client = new twitter({
		  consumer_key: tw_key,
		  consumer_secret: tw_secret,
		  bearer_token: tw_bearer_token
		})

		client.get('search/tweets', {q: search, count: 100}, function(err, tweets, response) {
			if(!err){
				feeds = tweets.statuses
				feeds.forEach(function(feed){
					var date = new Date(feed.created_at)
					feed.date = date.getTime()
				})
				res.send(feeds)
			}else{
				res.send({})
			}
		})
	}catch(err){
		console.log(err)
	}
}

var getInsta = function(search, res){
	try{
		ig_ts.scrapeTagPage(search).then(function(result){
		    res.send(result.media)
		})
	}catch(err){
		console.log('catch '+ err)
	}
}


app.listen(port)

exports = module.exports = app