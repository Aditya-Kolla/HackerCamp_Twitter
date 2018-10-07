var helperObj = {};

helperObj.setTweetModel = (data) => {
    var tweet = {
        twid: data['id'],
        body: data['full_text'],
        created_date: data['created_at'],
        user: {
            id: data['user']['id'],
            name: data['user']['name'],
            screenname: data['user']['screen_name'],
            avatar: data['user']['profile_image_url_https'],
            followers: data['user']['followers_count'],
            friends: data['user']['friends_count'],
        },
        retweet_count: data['retweet_count'],
        favorite_count: data['favorite_count'],
        entities: {
            hashtags: data['entities']['hashtags'],
            urls: data['entities']['urls'],
            user_mentions: data['entities']['user_mentions'],
        },
    };
    return tweet;
}

module.exports = helperObj;