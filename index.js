const cheerio = require("cheerio");
const request = require("request-promise");
const express = require("express");

const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  try {
    const body = await request({
      url: "https://eksisozluk.com/basliklar/gundem",
      method: "GET"
    });
    const $ = cheerio.load(body);
    const result = await extractWithCheerio($);

    res.render("index.ejs", {
      data: result
    });
  } catch (error) {
    console.error("Error fetching or processing data:", error);
    res.status(500).send("Internal Server Error");
  }
});

async function extractWithCheerio($) {
  const links = [];
  const listItems = $(".topic-list li");
  listItems.each((idx, el) => {
    const link = { title: "", href: "" };
    link.title = $(el).children("a").text();
    link.href = $(el).children("a").attr("href");
    links.push(link);
  });
  return links;
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
