<script lang="ts">
	export let data;

	const notify = () => {
		if (!('Notification' in window)) {
			// Check if the browser supports notifications
			alert('This browser does not support desktop notification');
		} else if (Notification.permission === 'granted') {
			// Check whether notification permissions have already been granted;
			// if so, create a notification
			const notification = new Notification('Hi there!');
			console.log('notification', notification);
			// …
		} else if (Notification.permission !== 'denied') {
			// We need to ask the user for permission
			Notification.requestPermission().then((permission) => {
				// If the user accepts, let's create a notification
				if (permission === 'granted') {
					const notification = new Notification('Hi there!');
					console.log('notification 2', notification);
					// …
				}
			});
		}
	};
	$: console.log(data);
</script>

<h1>Notification POC</h1>
<button>Get Notified!</button>
<form method="POST" action="?/create">
	<button>Create Notification</button>
</form>

<div>
	<h1>Notifications</h1>
	<button on:click={notify}>Notify me!</button>
	{#each data.notifications as notification (notification.id)}
		<p>{notification.message}</p>
	{/each}
</div>
