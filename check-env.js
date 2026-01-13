const fs = require('fs');
const path = require('path');

function checkEnvFile(filename) {
  const filePath = path.join(process.cwd(), filename);
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${filename} does not exist.`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let found = false;
  
  lines.forEach(line => {
    if (line.trim().startsWith('DATABASE_URL=')) {
      found = true;
      const value = line.split('=')[1].trim();
      const protocol = value.split(':')[0];
      const isQuoted = value.startsWith('"');
      const realProtocol = isQuoted ? value.slice(1).split(':')[0] : protocol;
      
      console.log(`Checking ${filename}:`);
      console.log(`  - Found DATABASE_URL`);
      console.log(`  - Protocol: ${realProtocol}://...`);
      
      if (realProtocol !== 'prisma') {
        console.log(`  ⚠️  WARNING: Protocol is '${realProtocol}', but it should be 'prisma'.`);
      } else {
        console.log(`  ✅  OK: URL starts with prisma://`);
      }
    }
  });
  
  if (!found) {
    console.log(`Checking ${filename}:`);
    console.log(`  - DATABASE_URL not set in this file.`);
  }
  console.log('---');
}

console.log('--- Environment Variable Check ---\n');
checkEnvFile('.env');
checkEnvFile('.env.local');
