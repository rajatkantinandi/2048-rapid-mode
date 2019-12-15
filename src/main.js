import App from './App.svelte';
import { register } from '../service-worker';

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

register();

export default app;