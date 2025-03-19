import {
	Body,
	Param,
	Controller,
	Get,
	Post,
	UsePipes,
	ValidationPipe,
	Put,
	Delete,
	Patch
} from '@nestjs/common'
import { QuoteService } from './quote.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { QuoteDto } from './dto/quote.dto'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { UpdateQuoteDto } from './dto/update-quote.dto'

@Controller('quote')
export class QuoteController {
	constructor(private readonly quoteService: QuoteService) {}

	@UsePipes(new ValidationPipe())
	@Post()
	@Auth()
	createQuote(@Body() dto: QuoteDto, @CurrentUser('id') userId: string) {
		return this.quoteService.create(+userId, dto)
	}

	@Get('by-id/:id')
	@Auth()
	getTaskById(@Param('id') quoteId: string) {
		return this.quoteService.getById(+quoteId)
	}

	@Get()
	@Auth()
	getAllQuotes() {
		return this.quoteService.getAll()
	}

	@Get('by-user')
	@Auth()
	getAllUserQuotes(@CurrentUser('id') userId: string) {
		return this.quoteService.getMy(+userId)
	}

	@Get('favorite')
	@Auth()
	getAllFavoriteQuotes(@CurrentUser('id') userId: string) {
		return this.quoteService.getFavorite(+userId)
	}

	@Put(':quoteId')
	@Auth()
	update(
		@Param('quoteId') quoteId: string,
		@Body() updateDto: UpdateQuoteDto,
		@CurrentUser('id') userId: string
	) {
		return this.quoteService.update(+userId, +quoteId, updateDto)
	}

	@Delete(':quoteId')
	@Auth()
	delete(@Param('quoteId') taskId: string, @CurrentUser('id') userId: string) {
		return this.quoteService.delete(+userId, +taskId)
	}

	@Patch(':quoteId')
	@Auth()
	addToFavorite(
		@Param('quoteId') quoteId: string,
		@CurrentUser('id') userId: string
	) {
		return this.quoteService.addToFavorite(+userId, +quoteId)
	}
}
