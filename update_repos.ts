import { feather, skyclient, std } from './src/mod.ts';

await Promise.all([feather(), skyclient(), std()]);
