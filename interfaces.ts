export interface DownloadMod {
	mcversion: string;
	version: string;
	// Hash of the mod supported formats, sha256, sha512, sha1, md5; syntax md5;<hash>
	hash: string;
	url: string;
	filename: string;
	id: string;
}

export interface Mod {
	// ID - Mods are placed in the database using this id
	id: string;
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

export interface Repo {
	// THE id of your repo this allows users to remove your repo and have all mods be removed and allows them to view where the mod is from
	id: string;
	// Mods that exist
	mods: Mod[];
}
