require('dotenv').load();

const Twitter   = require('twitter'),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    http        = require('http');
    express     = require('express'),
    Tweet       = require('./models/tweet'),
    helper      = require('./helper'),
    csv         = require('csv-express'),
    app         = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

mongoose.connect('mongodb://localhost/hackercamp_twitter', { useNewUrlParser: true });

const PORT = process.env.PORT; 

const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret:process.env.ACCESS_SECRET
});

app.get("/", (req, res) =>{
    res.status(200).json({message: 'Welcome to the API'});
});

app.get("/api/tweets/search", (req, res) => {
    let keyword = req.query.q || "";
    let count = req.query.count || 15;
    let params = { 
        q: keyword,
        lang: 'en',
        count: count, 
        tweet_mode: 'extended', 
        result_type: 'mixed' 
    };
    client.get('search/tweets', params, (error, tweets) => {
        if(error){
            res.status(400).json(error);
        }else{
            tweets.statuses.forEach( data => {
                var tweet = helper.setTweetModel(data);
                tweet.search_word = keyword;

                // Create a new model instance with our object
                var tweetEntry = new Tweet(tweet);

                // Save tweet to the database
                tweetEntry.save(function (err) {
                    if (err) {
                        res.json(err);
                    } else {
                        // If everything is cool
                        console.log("Saved.");
                    }
                });
            });
            res.status(200).json({ success: "Search has saved " + tweets.statuses.length + " results" });
        }
    });
});

app.get("/api/tweets/stream", (req, res) => {
    let keyword = req.query.q;
    client.stream('statuses/filter', { track: keyword, tweet_mode: 'extended'}, stream => {
        stream.on('data', (data) => {
            var tweet = helper.setTweetModel(data);
            tweet.search_word = keyword;
            console.log(data);
            // io.sockets.emit('tweet', tweet);
            // Create a new model instance with our object
            var tweetEntry = new Tweet(tweet);

            // Save tweet to the database
            tweetEntry.save(function (err) {
                if (err) {
                    res.status(400).json(err);
                } else {
                    // If everything is cool
                    res.status(200).json(tweet);
                    console.log("Saved.");
                }
            });
        });
    });
});

app.get("/api/tweets/:key", (req, res) => {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let contains = req.query.q || "";
    let sort = req.query.sort_by || "created_date";
    let order = req.query.order_by || "1";
    let keyword = req.params.key;
    let select = req.query.select || "";
    let filter = req.query.filter || "";

    Tweet.getTweets(keyword, contains, filter, select, page, limit, sort, order, (tweets) => {
        res.status(200).json(tweets);
    });
});

app.get("/api/tweets/csv/:key", (req, res) => {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let sort = req.query.sort_by || "created_date";
    let order = req.query.order_by || "1";
    let keyword = req.params.key;
    let select = req.query.select;
    let filter = req.query.filter;

    var filename = keyword + "_tweets.csv"
    var array;

    Tweet.getAltTweets(keyword, filter, select, page, limit, sort, order, (tweets) => {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader("Content-Disposition", 'attachment; filename=' + filename);
        console.log(tweets.docs);
        res.status(200).csv(tweets.docs);
    });
});

server.listen(PORT, 'localhost', () => {
    console.log("The server is running at port " + PORT);
});
