require("dotenv").config();
const express = require("express");
const cors = require("cors");
const isValidHost = require("./helpers/isValidHost");

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use(express.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const urls = new Map();
const references = new Map();
let counter = 1;

app.post("/api/shorturl", async function(req, res) {
  try {
    const { url } = req.body;
    const { href, host } = new URL(url);

    if(references.has(href)) {
      return res.json({
        original_url: href, 
        short_url: references.get(href) 
      });
    }
    
    const valid = await isValidHost(host);
    if(!valid) {
      return res.json({ 
        error: 'invalid url' 
      });
    }
    
    urls.set(counter, href);
    references.set(href, counter);
  
    return res.json({
      original_url: href, 
      short_url : counter++
    });
  } catch(error) {
    return res.json({ 
      error: 'invalid url' 
    });
  }
});

app.get("/api/shorturl/:short_url", function(req, res) {
  const { short_url } = req.params;

  return res.redirect(urls.get(Number.parseInt(short_url)));
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
