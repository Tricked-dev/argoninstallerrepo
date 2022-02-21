import { DownloadMod, Mod } from './interfaces.ts';

export interface SkyClientMods {
	id: string;
	nicknames?: string[];
	forge_id?: string;
	enabled?: boolean;
	file: string;
	hash?: string;
	url?: string;
	display: string;
	description: string;
	icon?: string;
	actions?: Action[];
	categories?: string[];
	packages?: string[];
	config?: boolean;
	files?: string[];
	command?: string;
	discordcode?: string;
	creator?: string;
	icon_scaling?: string;
	warning?: Warning;
	packs?: string[];
	hidden?: boolean;
	update_to_id?: string;
	update_to_ids?: string[];
	ignored?: boolean;
}

export interface Action {
	method?: string;
	document?: string;
	icon?: string;
	text?: string;
	link?: string;
	creator?: string;
}

export interface Warning {
	lines: string[];
}

let r = await fetch(
	'https://github.com/nacrt/SkyblockClient-REPO/blob/main/files/mods.json?raw=true'
).then((r) => r.json() as unknown as SkyClientMods[]);
const decoder = new TextDecoder();
let mods: Mod[] = [];
let versions: DownloadMod[] = [];
for (const mod of r) {
	if (mod.hidden) continue;
	if (mod.ignored) continue;
	if (!mod.url) continue;
	if (!mod.hash) {
		let r = await fetch(mod.url, {
			headers: {
				'user-agent':
					'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36',
			},
		}).then((r) => r.arrayBuffer());
		await Deno.writeFile(`hashes/${mod.file}`, new Uint8Array(r));
		let cmd = await Deno.run({
			cmd: ['md5', `hashes/${mod.file}`],
			stdout: 'piped',
		});
		let data = decoder.decode(await cmd.output());
		cmd.close();
		let hash = data.split(' ')[0];
		mod.hash = `md5;${hash}`;
	} else {
		mod.hash = `sha256;${mod.hash}`;
	}
	if (!mod.hash || !mod.url) {
		console.log('NOHASH');
		console.log(mod);
		continue;
	}
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
		meta: {},
	});
	versions.push({
		mcversion: '1.8.9',
		version: mod.file.split('-').at(-1)!.split('.')[0] || '0.1.0',
		hash: mod.hash,
		url: mod.url,
		filename: mod.file,
		id: mod.id,
	});
}

Deno.writeTextFile(
	'repos/skyclient.json',
	JSON.stringify(
		{
			id: 'skyclient',
			mods,
			downloads: versions,
		},
		null,
		2
	)
);
