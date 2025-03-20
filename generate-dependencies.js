import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fs.readFile(path.resolve(__dirname, 'package.json'), 'utf8', (err, data) => {
  if (err) {
    console.error('Failed to read package.json:', err);
    return;
  }

  const packageJson = JSON.parse(data);
  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  const allDependencies = { ...dependencies, ...devDependencies };

  const output = {
    dependencies: allDependencies
  };

  const publicDir = path.resolve(__dirname, 'public');

  // Check if the 'public' directory exists, create it if not
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFile(path.resolve(publicDir, 'dependencies.json'), JSON.stringify(output, null, 2), err => {
    if (err) {
      console.error('Failed to write dependencies.json:', err);
    } else {
      console.log('dependencies.json generated successfully');
    }
  });
});

// Function to get the last modified date of all files in the src directory
function getLastModifiedDates(dir, fileList = {}) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      fileList = getLastModifiedDates(filePath, fileList);
    } else {
      fileList[filePath.replace(__dirname + '/', '')] = stat.mtime;
    }
  });

  return fileList;
}

// Generate last-modified.json
const lastModified = getLastModifiedDates(__dirname + '/src');
fs.writeFile(path.resolve(__dirname, 'public', 'last-modified.json'), JSON.stringify(lastModified, null, 2), err => {
  if (err) {
    console.error('Failed to write last-modified.json:', err);
  } else {
    console.log('last-modified.json generated successfully');
  }
});
