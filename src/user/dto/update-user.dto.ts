import { OmitType, PartialType } from '@nestjs/mapped-types'
import { UserDto } from './user.dto'
import { IsEmail } from 'class-validator'

export class UpdateUserDto extends PartialType(OmitType(UserDto, ['email'])) {
	@IsEmail()
	email: string
}
