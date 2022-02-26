import {
	DownloadMod,
	GithubRelease,
	Mod,
	ModRinthMembers,
	ModRinthMod,
	ModRinthVersion,
} from './types.ts';
import { turnBuffer } from './mod.ts';

const moddata = JSON.parse(await Deno.readTextFile('std_data.json'));
export default async () => {
	const decoder = new TextDecoder();

	const mods: Mod[] = [];

	for (const mod of moddata) {
		if (mod.download.github) {
			const r: GithubRelease = await fetch(
				`https://api.github.com/repos/${mod.download.github}/releases/latest`
			).then((r) => r.json());
			const download = r.assets.find((x) =>
				x.browser_download_url.endsWith('.jar')
			)!;
			const filename = download.browser_download_url.split('/').at(-1)!;
			try {
				await Deno.stat(`hashes/${filename}`);
			} catch (_) {
				const r = await fetch(download.browser_download_url, {
					headers: {
						'user-agent':
							'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36',
					},
				}).then(turnBuffer);
				await Deno.writeFile(`hashes/${filename}`, new Uint8Array(r));
			}

			const cmd = await Deno.run({
				cmd: ['md5', `hashes/${filename}`],
				stdout: 'piped',
			});
			const data = decoder.decode(await cmd.output());
			cmd.close();
			const hash = `md5;${data.split(' ')[0]}`;

			mods.push({
				id: mod.id,
				forgeid: mod.forgeid,
				display: mod.display,
				description: mod.description,
				meta: mod.meta,
				nicknames: mod.nicknames,
				conflicts: mod.conflicts,
				icon: mod.icon,
				categories: mod.categories,
				downloads: [
					{
						version: r.tag_name.replace('v', ''),
						hash,
						mcversion: mod.download.version,
						mcversions: [mod.download.version],
						url: download.browser_download_url,
						filename: filename,
					},
				],
			});
		} else if (mod.download.modrinth) {
			const r: ModRinthMod = await fetch(
				`https://api.modrinth.com/v2/project/${mod.download.modrinth}`
			).then((r) => r.json());
			await new Promise((res) => setTimeout(res, 200));
			const version: ModRinthVersion[] = await fetch(
				`https://api.modrinth.com/v2/project/${mod.download.modrinth}/version`
			).then((r) => r.json());
			const members: ModRinthMembers[] = await fetch(
				`https://api.modrinth.com/v2/project/${mod.download.modrinth}/members`
			).then((r) => r.json());
			const versions: Record<string, boolean> = {};
			const data: Mod = {
				downloads: version
					.map((vers) => {
						if (versions[vers.game_versions.join('')] || vers.files.length == 0)
							return;
						else versions[vers.game_versions.join('')] = true;
						const prim = vers.files.find((x) => x.primary) || vers.files[0];

						return {
							mcversion: vers.game_versions.map(
								(x) => `${x}-${vers.loaders[0]}`
							)[0],
							mcversions: vers.game_versions.map(
								(x) => `${x}-${vers.loaders[0]}`
							),
							version: vers.version_number,
							hash: Object.entries(prim.hashes).map(
								(x) => `${x[0]};${x[1]}`
							)[0],
							url: `${encodeURI(prim.url)}`,
							filename: `${prim.filename}`,
						};
					})
					.filter((x) => x != undefined) as unknown as DownloadMod[],
				id: r.slug,
				display: r.title,
				icon: r.icon_url,
				forgeid: mod.forgeid || r.slug,
				nicknames: mod.nicknames || [],
				description: r.description,
				conflicts: mod.conflicts || [],
				categories: [...(mod.categories || []), ...r.categories],
				meta: {
					body_url: r.body_url,
					discord: r.discord_url,
					src: r.source_url,
					modrinth: `https://modrinth.com/mod/${mod.download.modrinth}`,
					author: members.map((x) => x.user.username).join(', '),
					...(mod.meta || {}),
				},
			};
			mods.push(data);
			// for (const vers of version) {
			// 	if (versions[vers.game_versions.join('')]) continue;
			// 	else versions[vers.game_versions.join('')] = true;
			// 	const prim = vers.files.find((x) => x.primary) || vers.files[0];
			// 	data.downloads!.push({
			// 		mcversions: vers.game_versions.map((x) => `${x}-${vers.loaders[0]}`),
			// 		version: vers.version_number,
			// 		hash: `sha1;${prim.hashes.sha1}`,
			// 		url: `${prim.url}`,
			// 		filename: `${prim.filename}`,
			// 	});
			// }
		}
	}
	Deno.writeTextFile('repos/std.json', JSON.stringify({ id: 'std', mods }));
};
