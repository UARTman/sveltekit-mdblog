import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs/promises';

export const get: RequestHandler = async ({ params }) => {
	let files = (await fs.readdir('src/posts'))
		.filter((filename) => filename.slice(-3) == '.md')
		.map((filename) => filename.slice(0, -3));

	let json = {
		files
	};

	return {
		body: JSON.stringify(json)
	};
};
