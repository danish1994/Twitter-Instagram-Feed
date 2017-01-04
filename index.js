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


var port = process.env.PORT || 8082


var keys = require('./keys')

var tw_key = keys.tw_key
var tw_secret = keys.tw_secret
var tw_bearer_token = keys.tw_bearer_token
var ig_key = keys.ig_key
var ig_secret = keys.ig_secret

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

		client.get('search/tweets', {q: search, count: 100}, function(error, tweets, response) {
			if(tweets){
				res.send(tweets.statuses)
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
		url = 'https://www.instagram.com/explore/tags/nyc/'

	 //    request(url, function(error, response, html){
	 //        if(!error){
	 //            var $ = cheerio.load(html)
	 //            console.log($)
	 //            $('._jjzlb').filter(function(){
	 //                var data = $(this)
	 //                console.log(data)
	 //            })
	 //        }
	 //    })

		// var x = Xray().driver(phantom())
		// console.log(x)
		// options = { 'web-security': 'no' }
		// x(url, '._jjzlb')(function(err, str) {
		// 	if (err) return done(err)
		// 	console.log(str)
		// 	assert.equal('Google', str)
		// 	done()
		// })

		// options = { 'web-security': 'no' }

		// phantom.create({parameters: options},function (ph) {
		// 	ph.createPage(function (page) {
		// 		page.open(url, function() {
		// 			console.log(page)
		// 			res.send(page)
		// 				page.evaluate(function($) {
		// 					console.log($('._jjzlb'))
		// 					$('.listMain > li').each(function () {
		// 						console.log($(this).find('a').attr('href'))
		// 					})
		// 				}, function(){
		// 					ph.exit()
		// 				})
		// 		})
		// 	})
		// })

		ig.use({
			client_id: ig_key,
			client_secret: ig_secret
		})

		ig.tag_search(search, function(err, result, remaining, limit) {
			if(err){
				console.log(err)
			}else{
				console.log(result)
			}
		})

	}catch(err){
		console.log(err)
	}
}


var redirect_uri = 'https://limitless-escarpment-55420.herokuapp.com/handleauth';
 
ig.use({
			client_id: ig_key,
			client_secret: ig_secret
		})

exports.authorize_user = function(req, res) {
  res.redirect(ig.get_authorization_url(redirect_uri, { scope: ['public_content'], state: 'a state' }));
}
 
exports.handleauth = function(req, res) {
  ig.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err.body);
      res.send("Didn't work");
    } else {
      console.log('Yay! Access token is ' + result.access_token);
      res.send(result.access_token);
    }
  })
}
 
// This is where you would initially send users to authorize 
app.get('/authorize_user', exports.authorize_user);
// This is your redirect URI 
app.get('/handleauth', exports.handleauth);


app.listen(port)

exports = module.exports = app