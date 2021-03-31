const fs = require('fs');

function getVersion() {
    let metaRaw = fs.readFileSync('package.json');
    let meta = JSON.parse(metaRaw);
    return meta.version
}

exports.getVersion = getVersion;