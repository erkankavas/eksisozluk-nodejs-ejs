const cheerio = require("cheerio");
const request = require("request-promise");
const express = require("express");

const app = express();
const port = 3000;

app.get("/", (req, res) => {

    try { 
     getTitleInfo();
        async function getTitleInfo() {
            let body = await request({
                url: "https://eksisozluk1923.com/basliklar/gundem",
                method: "GET"
            });
            let $ = cheerio.load(body);
            let resultx = extractWithCheerio($);
           
            resultx.then(result => {
            res.render("index.ejs", {
              data: result
              })
            })
            .catch(error => {
              console.error(error);
            })  
        }
        
        async function extractWithCheerio($) {
            const links = [];
            const listItems = $(".topic-list li");
              listItems.each((idx, el) => {
                const link = { title: "", href: "" };
                link.title = $(el).children("a").text();
                link.href = $(el).children("a").attr('href');
                links.push(link);

            });
            return links
        }
        
        
    } catch (err) {
        console.error("ERR", err);
    }


 
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });