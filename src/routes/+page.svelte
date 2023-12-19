<script lang="ts">
	import { browser } from '$app/environment';
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
</script>

<h1>Notification POC</h1>

{#if denied}
	<p>We will not be sending you notifications, refresh the app and allow notifications</p>
{/if}
{#if !canNotify}
	<button on:click={notify}>Allow site to notify you</button>
{:else}
	<button on:click={() => new Notification('Hello World')}>Send Notification</button>
{/if}

<form method="POST" action="?/create">
	<button>Create Notification</button>
</form>

<div>
	<h1>Notifications</h1>
	{#each data.notifications as notification (notification.id)}
		<p>{notification.message}</p>
	{/each}
</div>
