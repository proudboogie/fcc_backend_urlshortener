require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
// Basic Configuration
const port = process.env.PORT || 3000;
// Initialize bodyParser
app.use(bodyParser.urlencoded({extended:false}));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// MONGOOSE
mongoose.connect(process.env.MONGO_URI, {dbName : "urlshortener"}).
then(() => console.log('Successfully connected to MongoDB!')).
catch( error => console.error(error));

// Schema
const urlSchema = new mongoose.Schema({
  originalUrl : {
    type : String,
    required : true
  },
  shortUrl : {
    type: Number,
    required : true,
  }

});

// model
const Url = mongoose.model('Url', urlSchema);

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});



var url = [];

// 1. POST a URL to /api/shorturl, and get a JSON response with original_url and short_url properties
app.post('/api/shorturl', function (req,res){
  const newUrl = req.body.url;
  
  if(newUrl.startsWith("https://") || newUrl.startsWith("http://")){

    if(!url.includes(newUrl)){
      url.push(newUrl)
    }
    
    // array.find(function) will return the first matching value
    let originalUrl = url.find((value) => value == newUrl);
    
    // array.indexOf("arrayValue") --> will return value position
    let shortUrl = url.indexOf(originalUrl);

    res.json({"original_url": originalUrl, "short_url":shortUrl})

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
  
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
