import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class QuoteDto {
	@IsString()
	@MinLength(5)
	@MaxLength(100)
	title: string

	@IsString()
	@IsNotEmpty()
	author: string
}
