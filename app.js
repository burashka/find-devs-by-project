var GitHubApi = require("github");

var github = new GitHubApi({
	version: "3.0.0",
	// debug: true
});

github.authenticate({
    type: "basic",
    username: "login",
    password: "password"
});




var repos = ["dojo/dojo", "dojo/dijit", "dojo/dojox", "dojo/util"],
	location = ["Russia", "Moscow"];

location = new RegExp(location.join("|"), "gi");

function checkUser(login){
	console.log(login);
	github.user.getFrom({
		user: login
	}, function(err, data){
		if(err){
			console.log(err);
			return;
		}
		if(!data.location) return;
		if(location.test(data.location)) console.log(data.login, data.html_url);
	});
}

repos.forEach(function(repo){
	repo = repo.split("/");

	github.repos.getContributors({
		repo: repo[1],
		user: repo[0]
	}, function(err, data){
		if(err){
			console.log(err);
			return;
		}

		data.forEach(function(user){
			checkUser(user.login);
		});
	});

	github.repos.getForks({
		repo: repo[1],
		user: repo[0]
	}, function(err, data){
		if(err){
			console.log(err);
			return;
		}

		data.forEach(function(fork){
			checkUser(fork.owner.login);
		});
	});
});