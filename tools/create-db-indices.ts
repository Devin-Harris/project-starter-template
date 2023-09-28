import * as path from 'path';
import { syncEntities, syncMigrations } from './sync-scripts';

(function () {
  const dirname = path.dirname(__dirname).replace(/\\/g, '/');
  syncMigrations(dirname);
  syncEntities(dirname);
})();
