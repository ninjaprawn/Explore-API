var exp = require('./index') || require('explore-api');

// exp.topShowcases(function(showcases) {
// 	console.log(showcases[0]);
// 	exp.showcaseDetails(showcases[0].url, function(showcase) {
// 		console.log(showcase);
// 	});
// });



// exp.availableTrendingLanguages(function(langs) {
// 	console.log(langs);
// });

// exp.trendingRepos(function(repos) {
// 	console.log(repos);
// }, "", "monthly");

exp.allShowcases(function(showcases) {
	console.log(showcases);
	console.log(showcases.length);
}, 3);

exp.allShowcases(function(showcases) {
	console.log(showcases);
	console.log(showcases.length);
}, 3, 1);
