import App from './App.svelte';
import { mount } from 'svelte';
import { register } from '../service-worker';

const app = mount(App, {
	target: document.body,
	props: {
		name: 'world'
	}
});

register();

export default app;
