require('dotenv').load();

const Twitter   = require('twitter'),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    express     = require('express'),
    Tweet       = require('./models/tweet'),
    helper      = require('./helper');
    app         = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/hackercamp_twitter', { useNewUrlParser: true });

const PORT = process.env.PORT; 

const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

app.get("/", (req, res) =>{
    res.json({message: 'Welcome to the API'});
});

app.get("/api/tweets/search", (req, res) => {
    let keyword = req.query.q || "";
    let count = req.query.count || 15;
    console.log(keyword);
    let params = { 
        q: keyword,
        lang: 'en',
        count: count, 
        tweet_mode: 'extended', 
        result_type: 'mixed' 
    };
    client.get("search/tweets", params, (error, tweets) => {
        if(error){
            res.json(error);
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
            res.json({ success: "Search has saved " + tweets.statuses.length + " results" });
            console.log(tweets.statuses.length);
        }
    });
});

app.get("/api/tweets/:key", (req, res) => {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let sort = req.query.sort_by || "created_date";
    let order = req.query.order_by || "1";
    let keyword = req.params.key;
    Tweet.getAltTweets(keyword, page, limit, sort, order, (tweets) => {
        res.json(tweets);
    });
});

app.listen(PORT, 'localhost', () => {
    console.log("The server is running at port " + PORT);
});