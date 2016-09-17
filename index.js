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

				showcase.url = "https://github.com" + $(this).attr('href');
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

api.showcaseDetails = function(showcaseURL, callback) {
    request(showcaseURL, function(err, resp, html) {
        if (!err && resp.statusCode == 200) {
            var $ = cheerio.load(html);
			var showcase = {};

            showcase.title = $($(".showcase-page-header").children()[0]).find("h1").text().trim();
            showcase.description = $($(".showcase-page-header").children()[0]).find("p").text().trim();
            showcase.languages = $($($($(".showcase-page-header").children()[0]).children()[2]).children()[1]).attr("aria-label").split(", ");
            showcase.languages[showcase.languages.length-1] = showcase.languages[showcase.languages.length-1].replace("and ", "").replace(".", "");
            showcase.repositories = [];
            $(".repo-list").children().each(function(i, element) {
                var repository = {};
                repository.author = $(this).find("h3").text().split("/")[0].trim();
                repository.name = $(this).find("h3").text().split("/")[1].trim();
                repository.description = $(this).find(".repo-list-description").text().trim();
                repository.url = "https://github.com/" + repository.author + "/" + repository.name;
                repository.image = $(this).find("img").attr("src");

                repository.stars = parseInt($($($(this).find(".repo-list-stats")).children()[0]).text().trim());
                repository.forks = parseInt($($($(this).find(".repo-list-stats")).children()[1]).text().trim());
                repository.language = $($(this).find(".repo-list-stats")).text().replace($($($(this).find(".repo-list-stats")).children()[0]).text(), "").replace($($($(this).find(".repo-list-stats")).children()[1]).text(), "").trim();

                showcase.repositories.push(repository);
            });

			if (callback) {
				callback(showcase);
			}
        } else if (err && resp.statusCode != 200) {
            console.log("Error: " + err + "\n with status code: " + resp.statusCode);
        } else {
            console.log("Unknown error");
        }
    });
}

module.exports = api;
