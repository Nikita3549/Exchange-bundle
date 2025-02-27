import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { PairsModule } from './modules/pairs/pairs.module';
import { ExchangesModule } from './modules/exchanges/exchanges.module';
import { ScheduleModule } from './modules/schedule/schedule.module';

@Module({
	imports: [PrismaModule, PairsModule, ExchangesModule, ScheduleModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
