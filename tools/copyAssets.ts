import fse from 'fs-extra';

// Source and destination directory paths
const sourceDir: string = 'src/emails_templates';
const destinationDir: string = 'build/src/';

// Copy the contents of the source directory to the destination directory
fse.copySync(sourceDir, destinationDir);
