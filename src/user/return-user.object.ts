import { Prisma } from '@prisma/client'

export const returnUserObject: Prisma.UserSelect = {
	id: true,
	email: true,
	name: true,
	password: false,
	userQuotes: {
		select: {
			quote: true,
			user: true
		}
	},
	favoriteQuotes: {
		select: {
			quote: true,
			user: true
		}
	}
}
