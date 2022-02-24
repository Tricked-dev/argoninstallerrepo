export { default as skyclient } from './skyclient.ts';
export { default as feather } from './feather.ts';
export { default as std } from './std.ts';

export function turnBuffer(r: Response) {
	if (!r.ok) throw new Error('INVALID RESPONSE');
	return r.arrayBuffer();
}
