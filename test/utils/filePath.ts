export async function getPdfPath(): Promise<string> {
  const homedir = require('os').homedir();
  const downloadDir = require('path').join(homedir, 'Downloads');
  const files: string[] = await require('fs').readdirSync(downloadDir);
  const attachment = files.find((file) => file.endsWith('.pdf'));
  const attachmentPath = await require('path').join(
    downloadDir,
    attachment ?? ''
  );
  return attachmentPath;
}

export async function getCSVPath(): Promise<string> {
  const homedir = require('os').homedir();
  const downloadDir = require('path').join(homedir, 'Downloads');
  const files: string[] = await require('fs').readdirSync(downloadDir);
  const attachment = files.find((file) => file.endsWith('.csv'));
  const attachmentPath = await require('path').join(
    downloadDir,
    attachment ?? ''
  );
  return attachmentPath;
}
