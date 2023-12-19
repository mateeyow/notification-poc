import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import webPush from 'web-push';
import { error } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const body = (await request.json()) as PushSubscriptionJSON;

	try {
		const subscription = await prisma.subscription.create({
			data: {
				endpoint: body.endpoint ?? '',
				p256dh: body.keys?.p256dh ?? '',
				auth: body.keys?.auth ?? ''
			}
		});

		const data = JSON.stringify({
			status: 'ok',
			endpoint: subscription.endpoint,
			id: subscription.id
		});

		return new Response(data);
	} catch (err) {
		console.error(err);
		error(500, 'Error creating subscription');
	}
};

export const GET: RequestHandler = async ({ url }) => {
	const search = new URLSearchParams(url.search);
	const endpoint = search.get('ep') ?? '';
	try {
		const subscriptions = await prisma.subscription.findFirstOrThrow({ where: { endpoint } });
		const data = JSON.stringify(subscriptions);

		const payload = JSON.stringify({
			title: 'Sample Notification',
			options: {
				body: 'This is a sample body'
			}
		});

		const pushSubscription = {
			endpoint: subscriptions.endpoint,
			keys: {
				auth: subscriptions.auth,
				p256dh: subscriptions.p256dh
			}
		};

		webPush.sendNotification(pushSubscription, payload, {
			TTL: 60 * 60 * 24,
			vapidDetails: {
				publicKey: process.env.PUBLIC_VAPID_PUBLIC_KEY ?? '',
				privateKey: process.env.VAPID_PRIVATE_KEY ?? '',
				subject: 'mailto:johndoe@mail.com'
			}
		});
		return new Response(data);
	} catch (err) {
		console.error(err);
		error(400, 'Invalid subscription endpoint');
	}
};
