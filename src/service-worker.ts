/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
const sw = self as unknown as ServiceWorkerGlobalScope;

type ReceivedNotification = {
	title: string;
	options: NotificationOptions;
};

sw.addEventListener('push', (event) => {
	const data = event.data?.json() as ReceivedNotification;
	sw.registration.showNotification(data.title, data.options);
});
