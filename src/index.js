require('dotenv').config();
const log = (...args) => console.log(`[${new Date().toISOString()}]`, ...args);

const fs = require('fs');
const path = require('path');
const axios = require('axios').default;
const [, , owner, repo] = process.argv;

if (!owner || !repo) {
    throw new Error("Must include owner and repo as arguments");
}
log(`Fetching Github issues for repo ${owner}/${repo}`);


function configureRequest(config) {
    config.baseURL = 'https://api.github.com';
    config.headers = config.headers || {};
    config.headers.accept = 'application/vnd.github.v3+json';
    config.headers.Authorization = `token ${process.env.GITHUB_OAUTH_TOKEN}`;

    return config;
}

async function getAllIssues() {
    const allData = [];

    let results, page = 1;

    while (true) {
        log(`fetching page ${page}`);
        results = await axios
            .get(`/repos/${owner}/${repo}/issues?state=all&per_page=100&page=${page}`, configureRequest({}))
            .then(x => x.data);
        allData.push(...results);
        if (results.length < 100) break;
        page++;
    }
    const destinationPath = ensureStorage(owner);
    const filePath = path.join(destinationPath, `${repo}.json`);

    log(`Writing ${allData.length} issues to ${filePath}`);
    fs.writeFileSync(filePath, JSON.stringify(results), { encoding: 'utf-8' });
}

getAllIssues();

function ensureStorage(owner) {
    const resultsPath = path.join(process.cwd(), 'results');
    if (!fs.existsSync(resultsPath)) {
        log(`Creating ${resultsPath}`);
        fs.mkdirSync(resultsPath);
    }
    const destinationPath = path.join(resultsPath, owner);
    if (!fs.existsSync(destinationPath)) {
        log(`Creating ${destinationPath}`);
        fs.mkdirSync(destinationPath);
    }

    return destinationPath;
}