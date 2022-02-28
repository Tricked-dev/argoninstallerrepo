import { feather, skyclient, std } from './src/mod.ts';

await Promise.all([feather(), skyclient(), std()]);
await Deno.run({ cmd: ['deno', 'fmt', 'repos/'] }).status();
