import fs from 'node:fs';
import {routeMeta} from '../src/metadata.js';
const template=fs.readFileSync('dist/index.html','utf8');
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
for(const [route,[title,description]] of Object.entries(routeMeta)){
 const html=template.replace(/<title>.*?<\/title>/,`<title>${escape(title)} — Shadow FPV Technology</title>`).replace(/<meta name="description" content="[^"]*"\s*\/>/,`<meta name="description" content="${escape(description)}"/>`).replace('</head>',`<link rel="canonical" href="https://shadowddev.com${route}"/></head>`);
 const folder='dist'+(route==='/'?'':route);fs.mkdirSync(folder,{recursive:true});fs.writeFileSync(folder+'/index.html',html);
}
fs.writeFileSync('dist/404.html',template.replace(/<title>.*?<\/title>/,'<title>Page not found — Shadow FPV Technology</title>').replace('</head>','<meta name="robots" content="noindex"/></head>'));
console.log(`Generated metadata for ${Object.keys(routeMeta).length} routes and 404.html`);
