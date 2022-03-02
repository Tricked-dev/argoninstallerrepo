import { feather, skyclient, std } from './src/mod.ts';
try {
	await Deno.mkdir('hashes');
} catch (_) {}
await Promise.all([feather(), skyclient(), std()]);
await Deno.run({ cmd: ['deno', 'fmt', 'repos/'] }).status();
