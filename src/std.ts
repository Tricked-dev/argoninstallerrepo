import { GithubRelease, Mod } from './types.ts';
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
						url: download.browser_download_url,
						filename: filename,
					},
				],
			});
		}
	}
	Deno.writeTextFile('repos/std.json', JSON.stringify(mods));
};
