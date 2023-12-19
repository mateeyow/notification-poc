<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { PUBLIC_VAPID_PUBLIC_KEY } from '$env/static/public';
	export let data;

	let canNotify = false;
	let denied = false;

	if (browser) {
		if (!('Notification' in window)) {
			console.error('This browser does not support notification');
		} else {
			if (Notification.permission === 'granted') {
				canNotify = true;
			}

			if (Notification.permission === 'denied') {
				denied = true;
			}
		}
	}

	const notify = async () => {
		const permission = await Notification.requestPermission();

		if (permission === 'granted') {
			canNotify = true;
		}

		if (permission === 'denied') {
			denied = true;
		}
	};

	const register = async () => {
		await navigator.serviceWorker.register('/service-worker.js', {
			type: dev ? 'module' : 'classic'
		});
	};

	const subscribe = async () => {
		const worker = await navigator.serviceWorker.getRegistration();

		if (!worker) return;

		try {
			const subscription = await worker.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: PUBLIC_VAPID_PUBLIC_KEY
			});
			const response = await fetch('/api/subscription', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(subscription)
			});

			console.log('Subscription response', await response.json());
		} catch (err) {
			console.error('Error in subscribing', err);
		}
	};

	const sendNotification = async () => {
		const sw = await navigator.serviceWorker.getRegistration();

		if (!sw) return;

		const subscription = await sw.pushManager.getSubscription();

		if (!subscription) return;

		await fetch(`/api/subscription?ep=${subscription.endpoint}`, {
			method: 'GET'
		});
	};
</script>

<h1>Notification POC</h1>

<div class="spaced-buttons">
	{#if denied}
		<p>We will not be sending you notifications, refresh the app and allow notifications</p>
	{/if}
	{#if !canNotify}
		<button on:click={notify}>Allow site to notify you</button>
	{/if}
	<button on:click={register}>Register Service Worker</button>
	<button on:click={subscribe}>Subscribe To Push Manager</button>
	<button on:click={sendNotification}>Send Notification</button>
</div>

<form method="POST" action="?/create">
	<button>Create Notification</button>
</form>

<div>
	<h1>Notifications</h1>
	{#each data.notifications as notification (notification.id)}
		<p>{notification.message}</p>
	{/each}
</div>

<style>
	.spaced-buttons button {
		display: block;
		margin-bottom: 25px;
		height: 40px;
	}
</style>
