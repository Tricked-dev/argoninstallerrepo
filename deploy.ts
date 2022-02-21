import { serve } from 'https://deno.land/std@0.123.0/http/server.ts';

import {
	createRouteMap,
	createRouter,
	MissingRouteError,
} from 'https://deno.land/x/reno@v2.0.26/reno/mod.ts';

const PORT = 8000;

function createErrorResponse(status: number, { message }: Error) {
	return new Response(message, {
		status,
	});
}

export const routes = createRouteMap([
	[
		'/skyclient.json',
		async () => new Response(await Deno.readTextFile('repos/skyclient.json')),
	],
	//TODO- add own std repo
]);

const notFound = (e: MissingRouteError) => createErrorResponse(404, e);
const serverError = (e: Error) => createErrorResponse(500, e);

const mapToErrorResponse = (e: Error) =>
	e instanceof MissingRouteError ? notFound(e) : serverError(e);

const router = createRouter(routes);

console.log(`Listening for requests on port ${PORT}...`);

await serve(
	async (req) => {
		try {
			return await router(req);
		} catch (e) {
			return mapToErrorResponse(e);
		}
	},
	{
		port: PORT,
	}
);
