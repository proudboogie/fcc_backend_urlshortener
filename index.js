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

// 1. POST a URL to /api/shorturl, and get a JSON response with original_url and short_url properties
app.post('/api/shorturl', function (req,res){
  // recover url is in req.body.url (input type='text' name='url')
  var original_url = req.body.url;
  var short_url = 1;

  res.json({"original_url": original_url, "short_url":short_url})
})
// 2. When visiting /api/shorturl/<short_url> --> redirect to original URL

// 3. If entered URL is invalid return JSON error response




app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
