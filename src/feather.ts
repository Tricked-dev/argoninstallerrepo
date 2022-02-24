import { FeatherMods, Mod } from './types.ts';

export default async () => {
	const featherMods: Mod[] = [];
	const feather = await fetch(
		'https://electron-launcher.feathermc.com/mods.json',
		{
			headers: {
				'user-agent':
					'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36',
			},
		}
	).then((r) => r.json() as unknown as FeatherMods);

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
				.map(([k, v]) => ({
					mcversion: k,
					version: v.version,
					hash: `sha1;${v.sha1}`,
					filename: v.name || v.download.split('/').at(-1)!,
					url: v.download,
				})),
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
};
