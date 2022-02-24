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

export interface GithubRelease {
	url: string;
	assets_url: string;
	upload_url: string;
	html_url: string;
	id: number;
	author: Author;
	node_id: string;
	tag_name: string;
	target_commitish: string;
	name: string;
	draft: boolean;
	prerelease: boolean;
	created_at: string;
	published_at: string;
	assets: Asset[];
	tarball_url: string;
	zipball_url: string;
	body: string;
}

export interface Asset {
	url: string;
	id: number;
	node_id: string;
	name: string;
	label: null;
	uploader: Author;
	content_type: string;
	state: string;
	size: number;
	download_count: number;
	created_at: string;
	updated_at: string;
	browser_download_url: string;
}

export interface Author {
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id: string;
	url: string;
	html_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	starred_url: string;
	subscriptions_url: string;
	organizations_url: string;
	repos_url: string;
	events_url: string;
	received_events_url: string;
	type: string;
	site_admin: boolean;
}

//*  *//

export interface DownloadMod {
	mcversion: string;
	version: string;
	// Hash of the mod supported formats, sha256, sha512, sha1, md5; syntax md5;<hash>
	hash: string;
	url: string;
	filename: string;
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
