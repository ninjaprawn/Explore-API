var exp = require('./index') || require('explore-api');

// Get the top showcases
exp.topShowcases(function(showcases) {
	// Log the contents of the first showcase
	console.log(showcases[0]);
	// Get details of the first showcase
	exp.showcaseDetails(showcases[0].url, function(showcase) {
		console.log(showcase);
	});
});

// Get the available languages
exp.availableTrendingLanguages(function(langs) {
	// Log them
	console.log(langs);
});

// Get the trending repositories of the month, for any language
exp.trendingRepos(function(repos) {
	console.log(repos);
}, "", "monthly");

// Get 3 showcases from all the showcases, skipping the first showcase
exp.allShowcases(function(showcases) {
	console.log(showcases);
}, 3, 1);
