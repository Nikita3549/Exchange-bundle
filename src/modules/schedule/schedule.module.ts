import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { PairsModule } from '../pairs/pairs.module';
import { ExchangesModule } from '../exchanges/exchanges.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { config } from 'dotenv';
import { BotUpdate } from '../../botUpdate/bot.update';

config();
@Module({
	imports: [
		PairsModule,
		ExchangesModule,
		TelegrafModule.forRoot({
			token: process.env.BOT_TOKEN!,
		}),
	],
	providers: [ScheduleService, BotUpdate],
})
export class ScheduleModule {}
