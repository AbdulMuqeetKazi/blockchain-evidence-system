const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('d:/blockchain-evidence-system/frontend/src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    // Replace /ui/Uppercase with /ui/lowercase
    let newContent = content.replace(/\/ui\/([A-Za-z0-9_-]+)/g, (match, p1) => {
        return '/ui/' + p1.toLowerCase();
    });
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Fixed /ui/ casing in:', file);
    }
});
