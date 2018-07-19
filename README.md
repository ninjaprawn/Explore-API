Note from author - This package is obsolete due to GitHub modifying their explore page.

# Explore-API
A Node.js API for GitHub's Explore page. Be able to fetch showcases and trending repositories in simple functions.

## Installation
`npm install explore-api`

## Documentation
See https://ninjaprawn.github.io/explore-api for documentation

## Example
See `example.js` on basic usage or below:
```js
var exp = require('explore-api');

// Get the top showcases
exp.topShowcases(function(showcases) {
	console.log(showcases[0]);
	// Get details of the first showcase
	exp.showcaseDetails(showcases[0].url, function(showcase) {
		console.log(showcase);
	});
});

// Get the available languages
exp.availableTrendingLanguages(function(langs) {
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
```

## Contribution
Want to make a contribution? Fork the repo, add your changes, and submit a pull request. Any type of contributions (ideas, bug fixes, fixing typos, etc.) will be appreciated!
