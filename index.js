require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
// Basic Configuration
const port = process.env.PORT || 3000;
// Initialize bodyParser
app.use(bodyParser.urlencoded({extended:false}));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});



var url = [];

// 1. POST a URL to /api/shorturl, and get a JSON response with original_url and short_url properties
app.post('/api/shorturl', function (req,res){
  // recover url is in req.body.url (input type='text' name='url')
  
  // check http:// OR https:// use
  if(req.body.url.startsWith("https://") || req.body.url.startsWith("http://")){

    // If url is not stored yet add new url
    if(!url.includes(req.body.url)){
      url.push(req.body.url)
    }
    // array.find(function) will return the first matching value
    let originalUrl = url.find((value) => value == req.body.url);
    
    // array.indexOf("arrayValue") --> will return value position
    let shortUrl = url.indexOf(originalUrl);

    res.json({"original_url": originalUrl, "short_url":shortUrl})

    //console.log('POST URL','\n', 'req.body: ',req.body, '\n', 'req.params: ', req.params, '\n', {"original_url": original_url, "short_url":short_url})
  }
  // 3. If entered URL is invalid return JSON error response
  else{
    res.json({error:'Invalid url'})
  }

})

// 2. When visiting /api/shorturl/<short_url> --> redirect to original URL
app.get('/api/shorturl/:short_url', function(req,res){
  let original_url = url[req.params.short_url];

  if(original_url){
    res.redirect(original_url);
  }
  else{
    res.json({error:'there is no short URL for that input'})
  }
  
  //console.log('GET URL','\n', 'req.body: ',req.body, '\n', 'req.params: ', req.params, '\n', 'redirecting to :',original_url ,' with: ',req.params.short_url)
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
