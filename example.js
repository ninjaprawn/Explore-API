var exp = require('./index') || require('explore-api');

exp.topShowcases(function(showcases) {
	exp.showcaseDetails(showcases[0].url, function(showcase) {
		console.log(showcases[0]);
		console.log("---------------------");
		console.log(showcase);
	});
});
