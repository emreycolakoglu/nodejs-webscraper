## nodejs-webscraper
this is a web scraper wrapper I personally use on my projects

### Features
* Parallel requests
* Customizable parser logic
* Handles json / html responses
* No callbacks, all events

### Configuration
```
var ScraperWrapper = require('./scraper');

var pages = [/*your urls here*/];

var x = new ScraperWrapper({
  json: true, //if the result is json
  pages: pages, //urls to parse
  numberOfParallelRequests: 1, //how many threads
  parser: function(data){ //parser function
    var temp = [];
    // parse the data however you need
    return temp;
  }
});

x.on('complete', function(data){
  //use the result as data
});
```