import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { QuoteModule } from './quote/quote.module';

@Module({
	imports: [ConfigModule.forRoot(), UserModule, AuthModule, QuoteModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
