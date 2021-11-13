<script context="module" type="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ page, fetch }) => {
		const url = `/posts/${page.params.slug}.json`;
		const res = await fetch(url);
		if (res.ok) {
			return {
				props: {
					article: await res.json()
				}
			};
		} else {
			return {
				status: res.status,
				error: new Error(`Could not load ${url}`)
			};
		}
	};
</script>

<script type="ts">
    export let article: {content: string, meta: any};
</script>

{@html article.content}
