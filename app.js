require('dotenv').load();

const Twitter   = require('twitter'),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    express     = require('express'),
    Tweet       = require('./models/tweet'),
    helper      = require('./helper'),
    csv         = require('csv-express'),
    app         = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());




mongoose.connect('mongodb://localhost/hackercamp_twitter', { useNewUrlParser: true });

const PORT = process.env.PORT; 

const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret:process.env.ACCESS_SECRET
});

//Base route
app.get("/", (req, res) =>{
    res.status(200).json({message: 'Welcome to the API'});
});


//Search route. Will store results in the DB.
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

//Stream route. Will start the stream.  Not properly implemented.
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
                    console.log("Saved.");
                }
            });
        });
        res.status(200).json({success: "Stream has been started"});
    });
});

//Key is the keyword by for which we did a search
app.get("/api/tweets/:key", (req, res) => {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let contains = req.query.q || "";
    let sort = req.query.sort_by || "created_date";
    let order = req.query.order_by || "1";
    let keyword = req.params.key;
    let select = req.query.select || "";

    Tweet.getTweets(keyword, contains, select, page, limit, sort, order, (tweets) => {
        res.status(200).json(tweets);
    });
});

//Route to export the results as csv
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

    Tweet.getTweets(keyword, filter, select, page, limit, sort, order, (tweets) => {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader("Content-Disposition", 'attachment; filename=' + filename);
        console.log(tweets.docs);
        res.status(200).csv(tweets.docs);
    });
});

//Starts the server 
app.listen(PORT, 'localhost', () => {
    console.log("The server is running at port " + PORT);
});
