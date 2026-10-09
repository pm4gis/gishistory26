import fs from 'node:fs';import crypto from 'node:crypto';
const baseline=JSON.parse(fs.readFileSync('content/preservation-manifest.json'));const errors=[];
for(const [p,h] of Object.entries(baseline)){if(!fs.existsSync(p)||crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')!==h)errors.push(p);}
if(errors.length)throw Error('Baseline changes require an explicit reviewed preservation manifest: '+errors.join(', '));
console.log('Preservation passed: '+Object.keys(baseline).length+' complete files');
