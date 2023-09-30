import * as fg from 'fast-glob';
import * as fs from 'fs';
import * as path from 'path';

type IndexType = 'migrations' | 'entities';

function createIndex(indexType: IndexType, outDir: string, searchPath: string) {
  console.log(`Creating ${indexType}-index.ts`);
  if (!fs.existsSync(outDir)) {
    console.log(`Path not exist: ${outDir}`);
    process.exit(1);
  }
  const tmpFile = `${outDir}/tmp-${indexType}-index.ts`;
  const outFile = `${outDir}/${indexType}-index.ts`;
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  for (const item of fg.sync([searchPath])) {
    const filePath = path
      .relative(outDir, item)
      .replace(/\.ts$/, '')
      .replace(/\\/g, '/');
    const data = `export * from '${filePath}'\n`;
    fs.writeFileSync(tmpFile, data, { flag: 'a+' });
  }
  if (fs.existsSync(outFile) && fs.existsSync(tmpFile)) {
    fs.unlinkSync(outFile);
    console.log(`Old file '${outFile}' removed`);
  }
  if (fs.existsSync(tmpFile)) {
    fs.renameSync(tmpFile, outFile);
    console.log(`New file ${outFile} saved`);
  }
}

const outDirBase = `apps/backend/src/app/database-connection/indices`;

export function syncMigrations(dirname: string | null = null) {
  const migrationSearchPath = `${
    dirname ? dirname + '/' : ''
  }apps/backend/src/app/migrations/*.ts`;
  const outDir = `${dirname ? dirname + '/' : ''}${outDirBase}`;
  console.log(outDir, migrationSearchPath);
  createIndex('migrations', outDir, migrationSearchPath);
}

export function syncEntities(dirname: string | null = null) {
  const entitySearchPath = `${
    dirname ? dirname + '/' : ''
  }libs/shared/src/entities/**/*.entity.ts`;
  const outDir = `${dirname ? dirname + '/' : ''}${outDirBase}`;
  createIndex('entities', outDir, entitySearchPath);
}
