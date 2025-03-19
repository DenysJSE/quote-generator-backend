import { Prisma } from '@prisma/client'

export const returnQuoteObject: Prisma.QuoteSelect = {
	id: true,
	title: true,
	author: true,
	createdAt: true
}
