const fs = require('fs');
const path = require('path');

const targetDir = path.join(
  process.cwd(),
  'node_modules',
  'react-native-worklets',
  'src'
);
const targetFile = path.join(targetDir, 'index.js');

if (!fs.existsSync(targetDir)) {
  process.exit(0);
}

if (!fs.existsSync(targetFile)) {
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(
    targetFile,
    "import '../lib/module/index.js';\nexport * from '../lib/module/index.js';\n",
    'utf8'
  );
}
