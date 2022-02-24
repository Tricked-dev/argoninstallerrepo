# TModInstaller repo

Minecraft mod installer gui application repository

current repos:

- [Skyclient](https://tmod.deno.dev/skyclient.json)
- [Feather](https://tmod.deno.dev/feather.json)
- [std](https://tmod.deno.dev/std.json)

## Contributing to the STD repo

The std repo is mend to be a selective repo for useful mods you can add new mods by editing the [std_data.json](./std_data.json) file.

## Creating a TMOD Installer repo

Creating a TMOD Installer repo is pretty easy you can view the example above.

important notes for hosting a repo:

- Use a fast host the repos get downloaded on each startup and having a slow host will slow everything down by alot
- Dont use github as a host but instead a service thats mend for things like this here's a few examples: [Deno deploy](https://deno.com/deploy), [Cloudflare Pages](https://pages.cloudflare.com/), [Cloudflare workers](https://workers.cloudflare.com/), [Heroku](https://heroku.com/), [A vps](https://www.ovhcloud.com/en/vps/), [Netlify](http://netlify.com/), [Vercel](https://vercel.com/), [More..](https://free-for.dev/#/?id=web-hosting#/?id=web-hosting#/?id=web-hosting).

Typescript interfaces to create a repo:

```typescript
interface DownloadMod {
	mcversion: string;
	version: string;
	// Hash of the mod supported formats, sha256, sha512, sha1, md5; syntax md5;<hash>
	hash: string;
	url: string;
	filename: string;
	id: string;
}

interface Mod {
	// Nicknames of this mod
	nicknames: string[];
	// ID OF THIS MOD
	forgeid: string;
	// Displayname
	display: string;
	description: string;
	// URL to the icon of this mod
	icon: string;
	categories: string[];
	// Array of mod-ids this "mod" conflicts with
	conflicts: string[];
	// Room for additional meta for this mod homepage github, discord, Creator...
	meta: Record<string, string>;
	downloads: DownloadMod[];
}

interface repo {
	// THE id of your repo this allows users to remove your repo and have all mods be removed and allows them to view where the mod is from
	id: string;
	// Mods that exist
	mods: Mod[];
}
```
