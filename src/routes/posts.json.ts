import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs/promises';
import syncfs from 'fs';
import MDIt from 'markdown-it';
import yaml from 'yaml';
import metadata_block from 'markdown-it-metadata-block';

export interface MDFile {
	slug: string,
	meta: any,
	title: string,
}

const listFiles :( () => Promise<MDFile[]>)  = async () => {
	let files = (await fs.readdir('src/posts'))
		.filter((filename) => filename.slice(-3) == '.md')
		.map((filename) => {
			let file = syncfs.readFileSync(`src/posts/${filename}`);

			let md = new MDIt();
			let meta : any = {};
			// Add metadata support
			md.use(metadata_block, {
				parseMetadata: yaml.parse,
				meta
			});
			md.render(file.toString());

			let title: string;
			if (meta.title) {
				title = meta.title;
			} else {
				title = filename.slice(0, -3)
			}

			return {
				slug: filename.slice(0, -3),
				meta,
				title,
			}
		});
	return files;
};

export const get: RequestHandler = async ({ params }) => {
	// let files = (await fs.readdir('src/posts'))
	// 	.filter((filename) => filename.slice(-3) == '.md')
	// 	.map((filename) => filename.slice(0, -3));

	let files = await listFiles();

	let json = {
		files
	};

	return {
		body: JSON.stringify(json)
	};
};

export const prerender = true;