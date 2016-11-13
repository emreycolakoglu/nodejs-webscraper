var request = require('request');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

/*
 * Scraper Constructor
**/
function Scraper (url, json, parser) {
    this.url = url;
    this.json = json;
    this.parser = parser;
    this.init();
}

/*
 * Make it an EventEmitter
**/
util.inherits(Scraper, EventEmitter);

/*
 * Initialize scraping
**/
Scraper.prototype.init = function () {
    var model;
    var self = this;
    self.on('loaded', function (data) {
        model = self.parsePage(data);
        self.emit('complete', model);
    });
    self.loadWebPage();
};

Scraper.prototype.loadWebPage = function () {
  var self = this;
  console.log('loading ', this.url);
  request({url: self.url, json: this.json}, function(error, res, body){
    if(error){
      self.emit('error', error);
    }
    else if(res.statusCode !== 200){
      return self.emit('error', err);
    }
    else{
      self.emit('loaded', body);
    }
  });  
};

/*
 * Parse html and return an object
**/
Scraper.prototype.parsePage = function (data) {
  var self = this;
  
  var result = [];

  result = self.parser(data);

  return self.parser(data);
};

/*
 * Wrapper object
**/
function ScraperWrapper(config){
  this.config = config;
  this.result = [];
  this.init();
};
util.inherits(ScraperWrapper, EventEmitter);

ScraperWrapper.prototype.init = function(){
  var self = this;
  var completedCount = 0;
  for (var i = 0; i < self.config.numberOfParallelRequests; i++) {
    self.wizard();
  }
  self.on('threadCompleted', function(){
    completedCount++;
    if(completedCount == self.config.numberOfParallelRequests){
      console.log('all threads are finished');
      self.emit('complete', self.result);
    }
  })
};

ScraperWrapper.prototype.wizard = function(){
  var self = this;
  if (!self.config.pages.length) {
    console.log('a thread has finished!!')
    self.emit('threadCompleted');
    return;
  }
  var url = self.config.pages.pop();
  console.log('remaining', self.config.pages.length);
  var scraper = new Scraper(url, self.config.json, this.config.parser);

  scraper.on('error', function (error) {
    console.log(error);
    self.wizard();
  });

  scraper.on('complete', function (x) {
    self.result = self.result.concat(x);
    self.wizard();
  });
};

module.exports = ScraperWrapper;