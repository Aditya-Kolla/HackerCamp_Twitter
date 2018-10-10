var helperObj = {};
//This object will contain all the helper methods

//Will set the tweet into tweet model structure and return the tweet object
helperObj.setTweetModel = (data) => {
    var tweet = {
        usid: data['user']['id'],
        username: data['user']['name'],
        screenname: data['user']['screen_name'],
        avatar: data['user']['profile_image_url_https'],
        followers: data['user']['followers_count'],
        friends: data['user']['friends_count'],
        twid: data['id'],
        body: data['full_text'],
        created_date: data['created_at'],
        retweet_count: data['retweet_count'],
        favorite_count: data['favorite_count'],
        hashtags: data['entities']['hashtags'],
        urls: data['entities']['urls'],
        user_mentions: data['entities']['user_mentions'],
    };
    return tweet;
}

helperObj.doFilter = string => {

}

helperObj.getOrder = order => {
    return (order==="asc" ? 1 : -1);
}

module.exports = helperObj;