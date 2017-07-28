const GitHubApi = require("github");

const github = new GitHubApi({
	version: "3.0.0",
	// debug: true
});

async function find({ authenticate, repos, locations }) {
	github.authenticate(authenticate);

	locations = Array.isArray(locations) ? locations : [locations];
	locations = new RegExp(locations.join("|"), "gi");

	function checkUser(username){
		return github.users.getForUser({ username }).then(
			({data}) => {
				if (data.location && locations.test(data.location)){
					console.log(data.login, data.html_url);
					return data;
				}

				return false;
			},
			err => console.log(err)
		);
	}

	const promiseUsers = repos.map(repository => {
		const [owner, repo] = repository.split("/");

/*		Promise.all([
			github.repos.getContributors({ repo, owner }),
			github.repos.getForks({ repo, owner })
		]).then(
			([contributors, forks]) => {
				contributors.data.concat(forks.data).forEach(item => checkUser(item.login || item.owner.login));
			},
			err => console.log(err)
		);	*/

		const promiseUsersFromContribs = github.repos.getContributors({ repo, owner })
			.then(({ data }) => data.map(({login}) => checkUser(login)))
			.then(
				promiseUsers => Promise.all(promiseUsers),
				err => console.log(err)
			);

		const promiseUsersFromForks = github.repos.getForks({repo, owner})
			.then(({data}) => data.map(({owner}) => checkUser(owner.login)))
			.then(
				promiseUsers => Promise.all(promiseUsers),
				err => console.log(err)
			);

		return Promise.all([ promiseUsersFromContribs, promiseUsersFromForks ]).then(
			([ usersFromContribs, usersFromForks ]) => usersFromContribs.concat(usersFromForks).filter(user => !!user),
			err => console.log(err)
		);
	});

	return [].concat(await Promise.all(promiseUsers));
}

module.exports = find;