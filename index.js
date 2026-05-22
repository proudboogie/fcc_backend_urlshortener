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
    required : true,
    unique : true
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

// 1. POST a URL to /api/shorturl, and get a JSON response with original_url and short_url properties
app.post('/api/shorturl', async function (req,res){
  const newUrl = req.body.url;
  var matchUrl = await Url.findOne({ originalUrl : newUrl });
  const count = await Url.countDocuments();

  if(newUrl.startsWith("https://") || newUrl.startsWith("http://")){

    // buscar entradas similares, y añadir
    if(!matchUrl){
      // new entry
      let insertUrl = new Url({ originalUrl : newUrl, shortUrl : count});
      await insertUrl.save();
      matchUrl = insertUrl;
    }

    res.json({"original_url": matchUrl.originalUrl, "short_url":matchUrl.shortUrl})
  }
  // 3. If entered URL is invalid return JSON error response
  else{
    res.json({error:'Invalid url'})
  }

})

// 2. When visiting /api/shorturl/<short_url> --> redirect to original URL
app.get('/api/shorturl/:short_url', async function(req,res){
  const requestUrl = req.params.short_url;
  const resultUrl = await Url.findOne({shortUrl : requestUrl},'originalUrl -_id');

  if(resultUrl){
    res.redirect(resultUrl.originalUrl);
  }
  else{
    res.json({error:'there is no short URL for that input'})
  }
  
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
