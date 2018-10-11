# Twitter API Wrapper


#### A wrapper for the Twitter API made for the HackerCamp challenge.

  

### Contents

*   **[Prerequisites](#pre)**
*   **[API Endpoints](#APIe)**
    *   [/api/tweets/search](#e1)
    *   [/api/tweets/streams](#e2)
    *   [/api/tweets/"keyword"](#e3)
    *   [/api/tweets/csv/"keyword"](#e4)
*   

#### Prerequisites

*   A Twitter Consumer Key
*   A Twitter Consumer Secret Key
*   An Access Token
*   An Access Secret Token

#### API Endpoints

*   _/api/tweets/search_  
    _Parameters:_
    
    *   _q:_ the key term to search for in tweets
    *   _count:_ the number of tweets to limit to (default: 15)
    
    _Result:_ a JSON error is returned if the operation fails, otherwise the tweet is stored.
*   _/api/tweets/stream_  
    _Parameters:_
    
    *   _q:_ the key term to start the stream for
    
    _Result:_ a JSON error is returned if the operation fails, otherwise the tweet is stored.
*   _/api/tweets/"key"_  
    _Parameters:_
    
    *   _key:_ the key term to search for in tweets
    *   _contains:_ returns tweets that contains the word in their body
    *   _select:_ the fields that are to be returned
    *   _page:_ page number to be displayed
    *   _limit:_ the number of records per page
    *   _sort\_by:_ the field with whose respect the results have to be sorted
    *   _order\_by:_ whether ascending(asc) or descending(desc) 
    
    _Result:_ a JSON error is returned if the operation fails, otherwise the tweets satisfying the query.
*   _/api/tweets/csv/:key_  
    _Parameters:_
    
    *   Same as /api/tweets/"key"
    
    _Result:_ a JSON error is returned if the operation fails, otherwise a .csv file containing the tweets satisfying the query.


