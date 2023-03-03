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
    const { origin, host } = new URL(url);

    if(references.has(origin)) {
      return res.json({
        original_url: origin, 
        short_url: references.get(origin) 
      });
    }
    
    const valid = await isValidHost(host);
    if(!valid) {
      return res.json({ 
        error: 'invalid url' 
      });
    }
    
    urls.set(counter, origin);
    references.set(origin, counter);
  
    return res.json({
      original_url: origin, 
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
