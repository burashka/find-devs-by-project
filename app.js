const GitHubApi = require("github");

const github = new GitHubApi({
	version: "3.0.0"
});

async function find({ authenticate, repos, locations }) {
	github.authenticate(authenticate);

	repos = Array.isArray(repos) ? repos : [repos];
	locations = Array.isArray(locations) ? locations : [locations];
	locations = new RegExp(locations.join("|"), "gi");

	function checkUser(user){
		const username = user.login || user.owner.login;

		return github.users.getForUser({ username }).then(
			({data}) => {
				if (data.location && locations.test(data.location)){
					return data;
				}

				return false;
			},
			err => console.log(`Check user failed: ${err}`)
		);
	}

	const promiseUsers = repos.map(repository => {
		const [owner, repo] = repository.split("/");

		return Promise.all([
			github.repos.getContributors({ repo, owner }),
			github.repos.getForks({ repo, owner })
		])
		.then(
			([contributors, forks]) => {
				return Promise.all(contributors.data.concat(forks.data).map(user => checkUser(user)));
			}
		)
		.then(
			users => users.filter(user => !!user),
			err => console.log(`Get contributors and forks failed: ${err}`)
		);
	});

	return [].concat(await Promise.all(promiseUsers));
}

module.exports = find;