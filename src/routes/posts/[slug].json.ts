import type { RequestHandler } from '@sveltejs/kit';
import MarkdownIt from 'markdown-it';
import fs from 'fs/promises';
import metadata_block from 'markdown-it-metadata-block';
import mk from 'markdown-it-katex';
import footnote from 'markdown-it-footnote';
import abbr from 'markdown-it-abbr';
import yaml from 'yaml';
// import hljs from 'hljs';
import hljs from 'highlight.js'

export const get: RequestHandler = async ({ params }) => {
	let slug = params.slug;
	let mdSource = await fs.readFile('src/posts/' + slug + '.md');

	let meta = {};

	let md = new MarkdownIt({
		highlight: function (str, lang) {
			if (lang && hljs.getLanguage(lang)) {
				try {
					return hljs.highlight(str, { language: lang }).value;
				} catch (__) {}
			}

			return ''; // use external default escaping
		},
		linkify: true
	});

	// Add metadata support
	md.use(metadata_block, {
		parseMetadata: yaml.parse,
		meta
	});

	// Add latex support
	md.use(mk);

	md.use(footnote);
	md.use(abbr);

	let md_rendered = md.render(mdSource.toString());

	let json = {
		content: md_rendered,
		meta
	};

	return {
		body: JSON.stringify(json)
	};
};
