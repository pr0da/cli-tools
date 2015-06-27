#! /usr/bin/env node

var https = require('https');
var opml = require('opml-generator');
var fs = require('fs');
var minimist = require('minimist');

var argv = minimist(process.argv.slice(2));

if (!argv.user || argv.help) {
    printHelp();
    process.exit(0);
}

var options = {
    hostname: 'api.github.com',
    path: '/users/' + argv.user + '/starred?page=1&per_page=100',
    headers: {
        'User-Agent': 'github-starred-opml'
    },
};

var now = new Date();

var opmlHeader = {
    "title": "Github Starred",
    "dateCreated": now,
    "ownerName": argv.user
};

var req = https.get(options, function (res) {
    var data = "";
    res.on('data', function (d) {
        data += d;
    });

    res.on('end', function () {
        var opmlOutlines = [{
            text: argv.user + ' starred github pages',
            _children: JSON.parse(data.toString()).map(generateOutlines)
        }];
        var opmlXml = opml(opmlHeader, opmlOutlines);
        console.log(opmlXml);

        fs.writeFile(argv.user + '-' + now.getTime() + ".xml", opmlXml, function (err) {
            if (err) throw err;
            console.log('It\'s saved!');
        });
    });
});
req.end();

req.on('error', function (e) {
    console.error(e);
});

function generateOutlines(repo) {
    var url = 'https://github.com/' + repo.full_name + '/releases.atom';
    return {
        "text": repo.full_name,
        "title": repo.full_name,
        "type": "rss",
        "xmlUrl": url
    };
}

function printHelp() {
    console.log('Usage:');
    console.log('--user={NAME}           github user name');
    console.log('--help                  display this help');
}