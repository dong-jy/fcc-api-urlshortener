'use strict';
module.exports = function(app, db) {
  app.route('/:url').get(handleGet);
  
  app.get('/new/:url*', handlePost);
  
  function handleGet(req, res) {
    var url = 'https://pool-birch.glitch.me/' + req.params.url;
    findURL(url, db, res);
  }
  
  function handlePost(req, res) {
    var url = req.url.slice(5);
    console.log(req.url);
    var urlObj = {};
    if (validateURL(url)) {
      linkGen(url, res, db, save);
    } else {
      urlObj = {
        'error': 'wrong url format, make sure you have a valid protocol and real site.'
      };
      res.send(urlObj);
    }
  }
  
  function linkGen(url, res, db, callback) {
    db.collection('sites').find().toArray((err, data) => {
      if (err) return callback(err);
      
      var urlList = data.map((obj) => {
        return obj.short_url;
      });
      console.log(urlList);
      
      var newLink;

      do {
        var num = Math.floor(Math.random() * 10000 + 10000);
        newLink = 'https://pool-birch.glitch.me/' + num.toString().substring(0,4);
      } while (urlList.indexOf(newLink) != -1);
      
      return callback(null, url, newLink, res, db);
    });
  }
  
  function save(err, url, newLink, res, db) {
    if (err) throw err;
    
    var urlObj = {
      'original_url': url,
      'short_url': newLink
    };
    
    var sites = db.collection('sites');
    sites.save(urlObj, function(err, result) {
      if (err) throw err;
      
      res.send({
        'original_url': url,
        'short_url': newLink
      });
      console.log('Saved: ' + result);
    });
  }
  
  function findURL(link, db, res) {
    var sites = db.collection('sites');
    sites.findOne({
      'short_url': link
    }, function(err, result) {
      if (err) throw err;
      if (result) {
        console.log('Found: ' + result);
        console.log('redirecting to: ' + result.original_url);
        res.redirect(result.original_url);
      } else {
        res.send({
          'error': 'this url is not in database'
        });
      }
    });
  }
  
  
  function validateURL(url) {
    //var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

    //return regex.test(url);\
    return true;
  }
};