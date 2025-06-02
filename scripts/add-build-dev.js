
const fs = require('fs');
const path = require('path');

// Read package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add the build:dev script if it doesn't exist
if (!packageJson.scripts['build:dev']) {
  packageJson.scripts['build:dev'] = 'vite build --mode development';
  
  // Write back to package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Added build:dev script to package.json');
} else {
  console.log('build:dev script already exists');
}
