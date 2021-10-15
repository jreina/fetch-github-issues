# Fetch Github issues
A dirty script to fetch all issues for a given repo.

## Using
- Clone this repo
- Run `npm install` to install dependencies
- [Generate a personal access token](https://github.com/settings/tokens)
- Create a `.env` file with an entry for `GITHUB_OAUTH_TOKEN=<your token here>`
- Run `npm start <owner> <repo>` to fetch all issues for the repo. The console output will tell you where the data is stored.