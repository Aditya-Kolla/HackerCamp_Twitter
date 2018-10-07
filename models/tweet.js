const mongoosePaginate  = require('mongoose-paginate');
const mongoose          = require('mongoose');

var tweetSchema = new mongoose.Schema({
    twid: String,
    body: String,
    created_date: Date,
    user: {
        name: String,
        screenname: String,
        id: String,
        avatar: String,
        followers: Number,
        friends: Number,

    },
    retweet_count: Number,
    favorite_count: Number,
    entities: {
        hashtags: Array,
        urls: Array,
        user_mentions: Array,
    },
    save_date: {type: Date, default: Date.now()},
    search_word: String,
});

tweetSchema.plugin(mongoosePaginate);

// tweetSchema.statics.getTweets = (keyword ,page, skip, callback) => {
//     let tweets = [],
//         start = (page * 10) + (skip * 1);

//     Tweet.find({search_word: keyword}).sort({date: 'desc'}).exec(function(err, docs){
//         if(!err){
//             tweets = docs;
//         }else {
//             res.json(err);
//         }
//         callback(tweets);
//     });
// };


tweetSchema.statics.getAltTweets = (keyword, page, limit, sort_by, order, callback) =>{
    if(order=="asc")order=1;
    else if(order=="desc") order = -1;
    console.log(order + " is the order");
    var query = { 
        search_word: keyword 
    };
    var options = {
        page: page,
        limit: limit,
        sort: {[sort_by]: order}
    };

    Tweet.paginate(query, options, (err, result) => {
        if (err) {
            callback(err);
        } else {
            callback(result);
        }
    });
};

module.exports = Tweet = mongoose.model("Tweet", tweetSchema);