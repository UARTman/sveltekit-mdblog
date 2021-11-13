<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
import type { MDFile } from './posts.json';

	export const load: Load = async ({ fetch }) => {
		let res = await fetch('/posts.json');

		if (res.ok) {
			let json = await res.json();
			return {
				props: {
					posts: json.files
				}
			};
		} else {
			return {
				status: res.status,
				error: new Error(`Could not load /posts.json`)
			};
		}
	};

    export const prerender = true;
</script>

<script lang="ts">
	export let posts: MDFile[];
</script>

<ul>
{#each posts as post}
    <li><a href={`/posts/${post.slug}`}>{post.title}</a></li>
{/each}
</ul>
