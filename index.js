var cheerio = require("cheerio");
var request = require("request");

var api = {};

api.topShowcases = function(callback) {
    request("https://github.com/explore", function(err, resp, html) {
        if (!err && resp.statusCode == 200) {
            var $ = cheerio.load(html);
			var showcases = [];
			$(".exploregrid").children().each(function(i, element) {

				var showcase = {};

				showcase.link = "https://github.com" + $(this).attr('href');
				showcase.title = $(this).find("h3").text().trim();
				showcase.description = $(this).text().replace($(this).find("h3").text(), '').replace($($(this).children()[1]).next().text(), '').trim();
				showcase.repositories = parseInt($($($(this).children()[1]).next().children()[0]).text().trim().split(" ")[0]);
				showcase.languages = parseInt($($($(this).children()[1]).next().children()[1]).text().trim().split(" ")[0]);

				showcases.push(showcase);

			});
			if (callback) {
				callback(showcases);
			}
        } else if (err && resp.statusCode != 200) {
            console.log("Error: " + err + "\n with status code: " + resp.statusCode);
        } else {
            console.log("Unknown error");
        }
    });
};

module.exports = api;
