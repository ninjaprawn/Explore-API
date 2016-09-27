var cheerio = require("cheerio");
var request = require("request");

// Function from http://stackoverflow.com/a/24941988
function isString(obj) {
  return (Object.prototype.toString.call(obj) === '[object String]');
}

/** @namespace */
var api = {};

/**
 * Callback for when an list of showcases has been found
 *
 * @callback showcasesCallback
 * @param {Object[]} showcases - A list of showcases
 * @param {string} showcases[].url - The specific URL for a showcase
 * @param {string} showcases[].title - The title of a showcase
 * @param {string} showcases[].description - The description of a showcase
 * @param {integer} showcases[].repositories - The number of repositories a showcase has
 * @param {integer} showcases[].languages - The number of languages a showcase has
 */


/**
 * Gets all the top showcases from the default explore page
 *
 * @param {showcasesCallback} callback - A callback which is called once the top showcases have been located
 */
api.topShowcases = function(callback) {
    request("https://github.com/explore", function(err, resp, html) {
        if (!err && resp.statusCode == 200) {
            var $ = cheerio.load(html);
			var showcases = [];
			$(".exploregrid").children().each(function(i, element) {

				var showcase = {};

				showcase.url = "https://github.com" + $(this).find('a').attr('href');
				showcase.title = $(this).find("h3").text().trim();
				showcase.description = $(this).find("p").text();
				showcase.repositories = parseInt($($($(this).find("a").children()[3]).children()[0]).text().trim().split(" ")[0]);
				showcase.languages = parseInt($($($(this).find("a").children()[3]).children()[1]).text().trim().split(" ")[0]);

				showcases.push(showcase);

			});
			if (callback) {
				callback(showcases);
			} else {
                throw "Callback required";
            }
        } else if (err && resp.statusCode != 200) {
            throw "Error: " + err + "\n with status code: " + resp.statusCode;
        } else {
            throw "Unknown error";
        }
    });
};

function numberOfShowcases(callback) {
    request("https://github.com/showcases/search?utf8=%E2%9C%93&q=", function(err, resp, html) {
        if (!err && resp.statusCode == 200) {
            var $ = cheerio.load(html);

			if (callback) {
				callback(parseInt($(".search-results-info").find("strong").text().split(" ")[0]));
			} else {
                throw "Callback required";
            }
        } else if (err && resp && resp.statusCode != 200) {
            throw "Error: " + err + "\n with status code: " + resp.statusCode;
        } else {
            throw "Unknown error"
        }
    });
}

/**
 * Gets all the showcases that are available, with flexible options
 *
 * @param {showcasesCallback} callback - A callback which is called once the showcases have been located
 * @param {integer} [maxNumberOfShowcases=0] - A number representing the maximum number of showcases the function should fetch. A value of 0 means that all showcases will be fetched.
 * @param {integer} [start=0] - A number representing the number of items that should be skipped before being counted.
 */
api.allShowcases = function(callback, maxNumberOfShowcases, start) {

    maxNumberOfShowcases = maxNumberOfShowcases || Infinity;
    start = start || 0;

    if (isNaN(maxNumberOfShowcases)) {
        throw "Must pass an integer in <maxNumberOfShowcases>; currently: " + maxNumberOfShowcases;
    } else if (isNaN(start)) {
        throw "Must pass an integer in <start>; currently: " + start;
    }

    var showcases = [];

    numberOfShowcases(function(num) {
        var pages = Math.ceil(num / 15);

        var s = 0;

        function recurse(currentPage) {
            request("https://github.com/showcases?page="+currentPage, function(err, resp, html) {
                if (!err && resp.statusCode == 200) {
                    var $ = cheerio.load(html);

                    var shouldEnd = false;

                    $(".exploregrid").children().each(function(i, element) {

                        if (s < start) {
                            s += 1;
                            return;
                        }

        				var showcase = {};

        				showcase.url = "https://github.com" + $(this).find('a').attr('href');
        				showcase.title = $(this).find("h3").text().trim();
        				showcase.description = $(this).find("p").text();
        				showcase.repositories = parseInt($($($(this).find("a").children()[3]).children()[0]).text().trim().split(" ")[0]);
        				showcase.languages = parseInt($($($(this).find("a").children()[3]).children()[1]).text().trim().split(" ")[0]);

        				showcases.push(showcase);
                        if (showcases.length >= maxNumberOfShowcases) {
                            callback(showcases);
                            shouldEnd = true;
                            return false;
                        }

        			});

                    if (shouldEnd) {
                        return;
                    }

                    if (currentPage == pages) {
                        callback(showcases);
                        return
                    } else {
                        recurse(currentPage + 1);
                    }

                } else if (err && resp && resp.statusCode != 200) {
                    throw "Error: " + err + "\n with status code: " + resp.statusCode;
                } else {
                    throw "Unknown error"
                }
            });
        }

        recurse(1);

    });

}


/**
 * Callback for the details of a showcase
 *
 * @callback showcaseCallback
 * @param {Object} showcase - The updated showcase
 * @param {string} showcase[].title - The title of a showcase
 * @param {string} showcase[].description - The description of a showcase
 * @param {string[]} showcase[].languages - A list of all the languages which the showcase is made up of
 * @param {Object[]} showcase[].repositories - A list of all the repositories which the showcase has
 * @param {string} showcase[].repositories[].author - The author of the repository
 * @param {string} showcase[].repositories[].name - The name of the repository
 * @param {string} showcase[].repositories[].description - The description of the repository
 * @param {string} showcase[].repositories[].url - The URL of the repository
 * @param {string} showcase[].repositories[].image - The URL of the image of the repository
 * @param {string} showcase[].repositories[].language - The primary language of the repository
 * @param {integer} showcase[].repositories[].stars - The number of stars of the repository
 * @param {integer} showcase[].repositories[].forks - The number of forks of the repository
 */


/**
 * Gets all the top showcases from the default explore page
 *
 * @param {string} showcaseURL - A URL found from a showcase object
 * @param {showcaseCallback} callback - A callback which is called once the details of the original showcase have been found
 */

api.showcaseDetails = function(showcaseURL, callback) {
    if (!isString(showcaseURL)) {
        throw "showcaseURL must be of type 'String'";
    }
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

                repository.stars = parseInt($($($(this).find(".repo-list-stats")).children()[0]).text().split(",").join("").trim());
                repository.forks = parseInt($($($(this).find(".repo-list-stats")).children()[1]).text().split(",").join("").trim());
                repository.language = $($(this).find(".repo-list-stats")).text().replace($($($(this).find(".repo-list-stats")).children()[0]).text(), "").replace($($($(this).find(".repo-list-stats")).children()[1]).text(), "").trim();

                showcase.repositories.push(repository);
            });

			if (callback) {
				callback(showcase);
			} else {
                throw "Callback required";
            }
        } else if (err && resp && resp.statusCode != 200) {
            throw "Error: " + err + "\n with status code: " + resp.statusCode;
        } else {
            throw "Unknown error"
        }
    });
}

/**
 * Callback for the list of available trending languages
 *
 * @callback languageCallback
 * @param {Object[]} languages - A list of languages
 * @param {string} languages[].name - The name of the language
 * @param {string} languages[].code - The code of the language for use in api.trendingRepos
 */


/**
 * Gets all the available languages for use in api.trendingRepos
 *
 * @param {languageCallback} callback - A callback which is called once the languages have been found
 */

api.availableTrendingLanguages = function(callback) {
    if (!callback) {
        throw "Callback required";
    }
    request("https://github.com/trending", function(err, resp, html) {
        if (!err && resp.statusCode == 200) {
            var $ = cheerio.load(html);

            var languages = [{name:"All languages", code:""}, {name:"Unknown languages", code:"unknown"}];

            $($(".select-menu-list[role='menu']").children()[1]).children().each(function(i, element) {
                var currentLanguage = {};
                currentLanguage.name = $(this).text().trim();
                currentLanguage.code = $(this).attr("href").replace("https://github.com/trending/","");
                languages.push(currentLanguage);
            });

            callback(languages);
        } else if (err && resp.statusCode != 200) {
            throw "Error: " + err + "\n with status code: " + resp.statusCode;
        } else {
            throw "Unknown error"
        }
    });
}

/**
 * Callback for the list of trending repositories
 *
 * @callback repositoryCallback
 * @param {Object[]} repositories - A list of repositories
 * @param {string} repositories[].author - The author of the repository
 * @param {string} repositories[].name - The name of the repository
 * @param {string} repositories[].description - The description of the repository
 * @param {string} repositories[].url - The URL of the repository
 * @param {string} repositories[].stars - The number of stars the repository has (based on the time period)
 * @param {string} repositories[].language - The language of the repository
 */


/**
 * Gets all the trending repositories
 *
 * @param {repositoryCallback} callback - A callback which is called once the repositories have been found
 * @param {string} [languageCode=''] - The code for a language found from api.availableTrendingLanguages. "" is all languages
 * @param {string} [timePeriod=daily] - The time period for the trending repositories. Available options are "daily", "weekly" and "monthly"
 */
api.trendingRepos = function(callback, languageCode, timePeriod) {
    languageCode = languageCode || "";
    timePeriod = timePeriod || "daily"
    if (!callback) {
        throw "Callback required";
    }
    request("https://github.com/trending" + (languageCode.length > 0 ? "/" : "") + languageCode + "?since=" + timePeriod, function(err, resp, html) {
        if (!err && resp.statusCode == 200) {
            var $ = cheerio.load(html);

            var repos = [];

            $(".repo-list").children().each(function(i, element) {
                var repository = {};
                repository.author = $(this).find("h3").text().split("/")[0].trim();
                repository.name = $(this).find("h3").text().split("/")[1].trim();
                repository.description = $(this).find(".repo-list-description").text().trim();
                repository.url = "https://github.com/" + repository.author + "/" + repository.name;

                var stats = $(this).find(".repo-list-meta").text().split("•");

                if (stats[0].includes("star")) {
                    repository.language = null;
                    repository.stars = stats[0].trim();
                } else if (!$(this).find(".repo-list-meta").text().includes("star")) {
                    repository.language = stats[0].trim();
                    repository.stars = null;
                } else {
                    repository.language = stats[0].trim();
                    repository.stars = stats[1].trim();
                }

                repos.push(repository);
            });

            callback(repos);
        } else if (err && resp.statusCode != 200) {
            throw "Error: " + err + "\n with status code: " + resp.statusCode;
        } else {
            throw "Unknown error"
        }
    });
}

module.exports = api;
