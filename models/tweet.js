const mongoosePaginate  = require('mongoose-paginate');
const mongoose          = require('mongoose');
const helper            = require('../helper/');

//Defining the tweet Schema for structure
var tweetSchema = new mongoose.Schema({
    twid: String,
    body: String,
    created_date: Date,
    username: String,
    screenname: String,
    usid: String,
    avatar: String,
    followers: Number,
    friends: Number,
    retweet_count: Number,
    favorite_count: Number,
    hashtags: Array,
    urls: Array,
    user_mentions: Array,
    save_date: {type: Date, default: Date.now()},
    search_word: String,
});

tweetSchema.plugin(mongoosePaginate);

//Method to get data from the database
tweetSchema.statics.getTweets = (keyword, contains, filter, select, page, limit, sort_by, order, callback) =>{
    let orderNum = helper.getOrder(order);
    var query = {
        search_word: keyword, 
        body: new RegExp(contains, 'i'), 
    };
    console.log(filter);
    var options = {
        page: page,
        limit: limit,
        select: select,
        sort: {[sort_by]: orderNum},
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