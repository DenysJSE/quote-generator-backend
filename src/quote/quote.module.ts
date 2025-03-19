import { Module } from '@nestjs/common'
import { QuoteService } from './quote.service'
import { QuoteController } from './quote.controller'
import { PrismaService } from '../prisma.service'
import { UserModule } from '../user/user.module'

@Module({
	imports: [UserModule],
	controllers: [QuoteController],
	providers: [QuoteService, PrismaService]
})
export class QuoteModule {}
