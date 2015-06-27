#! /usr/bin/env node

var execSync = require('child_process').execSync;
var svnUrl = process.argv[2];

if(svnUrl.charAt(svnUrl.length - 1) != '/'){
	svnUrl += '/';
}

var svnList = execSync('svn list ' + svnUrl, { encoding : 'utf8'});
var folders = svnList.trim().split('\r\n');

console.log('CWD:', process.cwd());
folders.forEach(function(folder){
	execSync('svn co ' + svnUrl + folder + 'trunk ' + process.cwd() + '/' + folder);
	console.log('Finished: ', svnUrl + folder + 'trunk');
});