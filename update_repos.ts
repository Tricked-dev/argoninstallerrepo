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

export interface FeatherMods {
	mcVersions: string[];
	categories: Category[];
	mods: FeatherMod[];
	dependencies: Dependency[];
	defaultMods: DefaultMod[];
}

export interface Category {
	name: Name;
	description: string;
}

export enum Name {
	Fun = 'Fun',
	Hypixel = 'Hypixel',
	Media = 'Media',
	Performance = 'Performance',
	Tools = 'Tools',
}

export interface DefaultMod {
	slug: string;
	name: string;
	author: string;
	description: string;
	image: string;
	mcVersions: { [key: string]: McVersion };
	categories?: Name[];
}

export interface McVersion {
	sha1?: string;
	name?: string;
	download: string;
	size?: number;
	version: string;
	type?: string;
}

export interface Dependency {
	name: string;
	slug: string;
	author: string;
	mcVersions: { [key: string]: McVersion };
}

export interface FeatherMod {
	slug: string;
	name: string;
	author: string;
	description: string;
	image: string;
	categories: Name[];
	mcVersions: { [key: string]: McVersion };
	dependencies?: string[];
}

let r = await fetch(
	'https://github.com/nacrt/SkyblockClient-REPO/blob/main/files/mods.json?raw=true'
).then((r) => r.json() as unknown as SkyClientMods[]);
const decoder = new TextDecoder();
let mods: Mod[] = [];
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
			}).then((r) => r.arrayBuffer());
			await Deno.writeFile(`hashes/${mod.file}`, new Uint8Array(r));
		}

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
		meta: {},
		downloads: [
			{
				mcversion: '1.8.9',
				version: version || '0.1.0',
				hash: mod.hash,
				url: mod.url,
				filename: mod.file,
				id: mod.id,
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

let featherMods: Mod[] = [];
let feather = await fetch('https://electron-launcher.feathermc.com/mods.json', {
	headers: {
		'user-agent':
			'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36',
	},
}).then((r) => r.json() as unknown as FeatherMods);

for (const mod of [...feather.mods, ...feather.defaultMods]) {
	featherMods.push({
		id: mod.slug,
		nicknames: [mod.name],
		display: mod.name,
		icon: mod.image,
		forgeid: mod.slug,
		description: mod.description,
		meta: {
			author: mod.author,
		},
		conflicts: [],
		categories: mod.categories || [],
		downloads: Object.entries(mod.mcVersions)
			.filter((x) => x[1].type !== 'link' && x[1].sha1)
			.map(([k, v]) => {
				return {
					mcversion: k,
					version: v.version,
					hash: `sha1;${v.sha1}`,
					filename: v.name || v.download.split('/').at(-1)!,
					url: v.download,
					id: mod.slug,
				};
			}),
	});
}

Deno.writeTextFile(
	'repos/feather.json',
	JSON.stringify(
		{
			id: 'feather',
			mods: featherMods.filter((x) => x.downloads.length !== 0),
		},
		null,
		2
	)
);
