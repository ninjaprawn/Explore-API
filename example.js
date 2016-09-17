var exp = require('./index') || require('explore-api');

exp.topShowcases(function(showcases) {
	console.log(showcases);
});
