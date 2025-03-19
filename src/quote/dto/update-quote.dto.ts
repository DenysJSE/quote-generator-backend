import { PartialType } from '@nestjs/mapped-types'
import { QuoteDto } from './quote.dto'

export class UpdateQuoteDto extends PartialType(QuoteDto) {}
