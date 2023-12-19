import { faker } from '@faker-js/faker';
import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		notifications: await prisma.notification.findMany()
	};
}) satisfies PageServerLoad;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const actions = {
	create: async () => {
		await sleep(1000);
		await prisma.notification.create({
			data: {
				message: faker.lorem.paragraph()
			}
		});
	}
};
