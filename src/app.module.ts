import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotUpdate } from './botUpdate/bot.update';
import { config } from 'dotenv';
import { PrismaModule } from './modules/prisma/prisma.module';
import { PairsModule } from './modules/pairs/pairs.module';
import { ExchangesModule } from './modules/exchanges/exchanges.module';
import * as process from 'process';

config();
@Module({
	imports: [
		TelegrafModule.forRoot({
			token: process.env.BOT_TOKEN!,
		}),
		PrismaModule,
		PairsModule,
		ExchangesModule,
	],
	controllers: [AppController],
	providers: [AppService, BotUpdate],
})
export class AppModule {}
