import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UserService } from '../user/user.service'
import { QuoteDto } from './dto/quote.dto'
import { checkIdIsNumber } from '../utils/id-is-number'
import { UpdateQuoteDto } from './dto/update-quote.dto'
import { returnQuoteObject } from './return-quote.object'

@Injectable()
export class QuoteService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userService: UserService
	) {}

	async create(userId: number, dto: QuoteDto) {
		const { author, title } = dto

		await this.userService.getUserById(userId)

		const quote = await this.prisma.quote.create({
			data: { title, author }
		})

		await this.prisma.userQuotes.create({
			data: {
				userId: userId,
				quoteId: quote.id
			}
		})

		return quote
	}

	async getById(quoteId: number) {
		const id = checkIdIsNumber(quoteId)

		const quote = await this.prisma.quote.findUnique({
			where: { id },
			select: returnQuoteObject
		})

		if (!quote)
			throw new NotFoundException('The quote with such id was not found!')

		return quote
	}

	async getAll() {
		return this.prisma.quote.findMany()
	}

	async getFavorite(userId: number) {
		await this.userService.getUserById(userId)

		return this.prisma.favoriteQuotes.findMany({
			where: {
				userId: userId
			},
			include: {
				quote: true
			}
		})
	}

	async getMy(userId: number) {
		await this.userService.getUserById(userId)

		return this.prisma.userQuotes.findMany({
			where: {
				userId: userId
			},
			include: {
				quote: true
			}
		})
	}

	async update(
		userId: number,
		quoteId: number,
		updateQuoteDto: UpdateQuoteDto
	) {
		const userQuote = await this.prisma.userQuotes.findFirst({
			where: { userId, quoteId }
		})

		if (!userQuote) {
			throw new ForbiddenException(
				"Quote not found or you don't have permission to edit it"
			)
		}

		const { title, author } = updateQuoteDto
		if (!title && !author) {
			throw new BadRequestException(
				'At least one field (title or author) must be updated'
			)
		}

		return this.prisma.quote.update({
			where: { id: quoteId },
			data: {
				...(title && { title }),
				...(author && { author })
			}
		})
	}

	async delete(userId: number, quoteId: number) {
		const userQuote = await this.prisma.userQuotes.findFirst({
			where: { userId, quoteId }
		})

		if (!userQuote) {
			throw new ForbiddenException(
				"Quote not found or you don't have permission to delete it"
			)
		}

		await this.prisma.userQuotes.deleteMany({
			where: { userId, quoteId }
		})

		const stillUsed = await this.prisma.userQuotes.findFirst({
			where: { quoteId }
		})

		if (!stillUsed) {
			await this.prisma.quote.delete({
				where: { id: quoteId }
			})
		}

		return { message: 'Quote removed successfully' }
	}

	async addToFavorite(userId: number, quoteId: number) {
		const quoteExists = await this.prisma.quote.findUnique({
			where: { id: quoteId }
		})

		if (!quoteExists) {
			throw new NotFoundException('Quote not found!')
		}

		const existingFavorite = await this.prisma.favoriteQuotes.findFirst({
			where: { userId, quoteId }
		})

		if (existingFavorite) {
			throw new BadRequestException('Quote is already in favorites')
		}

		return this.prisma.favoriteQuotes.create({
			data: { userId, quoteId }
		})
	}
}
