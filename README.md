Find Developers by Projects
===========================

Description
-----------

Do you ever want to find local developers who contribute to frameworks that you use in your projects?
We require candidates to know certain frameworks or libraries. This module allows you to find all the contributors of
these projects from the specified region. It is logical to look for developers among their contributors. This module
allows you to find all the contributors of these projects from the specified region.

Parameters
----------

| Name 			| Type 			| Description 			|
| ------------- | ------------- | ---- 					|
| authenticate 	| object 		| GitHub credentials 	|
| repos 		| Array, String | Repositories for find |
| locations 	| Array, String | Locations for find 	|

Usage
-----

```javascript
const find = require("find-devs-by-project");

find({
	authenticate: {
		type: "token",
		token: "<your token>"
	},
	repos: ["dojo/dojo", "dojo/dijit", "dojo/dojox", "dojo/util"],
	locations: ["Russia", "Moscow"]
}).then(results => {
	results.forEach(repo => {
	    repo.forEach(user => {
	        console.log(user.login, user.html_url, "\n");
        });
    });
});
```
