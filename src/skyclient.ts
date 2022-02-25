import { turnBuffer } from './mod.ts';
import { Mod, SkyClientMods } from './types.ts';

export default async () => {
	const r = await fetch(
		'https://github.com/nacrt/SkyblockClient-REPO/blob/main/files/mods.json?raw=true'
	).then((r) => r.json() as unknown as SkyClientMods[]);
	const decoder = new TextDecoder();
	const mods: Mod[] = [];
	for (const mod of r) {
		if (mod.hidden) continue;
		if (mod.ignored) continue;
		if (!mod.url) continue;
		if (!mod.hash) {
			try {
				await Deno.stat(`hashes/${mod.file}`);
			} catch (_) {
				const r = await fetch(mod.url, {
					headers: {
						'user-agent':
							'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36',
					},
				}).then(turnBuffer);
				await Deno.writeFile(`hashes/${mod.file}`, new Uint8Array(r));
			}

			const cmd = await Deno.run({
				cmd: ['md5', `hashes/${mod.file}`],
				stdout: 'piped',
			});
			const data = decoder.decode(await cmd.output());
			cmd.close();
			const hash = data.split(' ')[0];
			mod.hash = `md5;${hash}`;
		} else {
			mod.hash = `sha256;${mod.hash}`;
		}
		if (!mod.hash || !mod.url) {
			console.log('NOHASH');
			console.log(mod);
			continue;
		}
		const version = mod.file
			.replace('1.8.9', '')
			.replace('.jar', '')
			.replace('()', '')
			.replace('-beta', ';beta')
			.replace('-pre', ';pre')
			.trim()
			.split(/-| /gim)
			.at(-1)!
			.replace(';beta', '-beta')
			.replace(';pre', '-pre');
		mods.push({
			id: mod.id,
			nicknames: mod.nicknames || [],
			forgeid: mod.forge_id || mod.id,
			display: mod.display,
			description: mod.description,
			icon: `https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/icons/${
				mod.icon || 'skyclient.png'
			}`,
			categories: mod.categories?.map((x) => x.split(';')?.[1]) || [],
			conflicts: [],
			meta: {
				author: mod.creator,
				body_url: mod.actions?.find((x) => x.method == 'hover')?.document,
			},
			downloads: [
				{
					mcversion: '1.8.9',
					mcversions: ['1.8.9'],
					version: version || '0.1.0',
					hash: mod.hash,
					url: mod.url,
					filename: mod.file,
				},
			],
		});
	}

	Deno.writeTextFile(
		'repos/skyclient.json',
		JSON.stringify(
			{
				id: 'skyclient',
				mods,
			},
			null,
			2
		)
	);
};
