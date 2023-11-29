import { faker } from '@faker-js/faker';
import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		notifications: await prisma.notification.findMany()
	};
}) satisfies PageServerLoad;

export const actions = {
	create: async () => {
		console.log('called');
		await prisma.notification.create({
			data: {
				message: faker.lorem.paragraph()
			}
		});
	}
};
