import { Module } from '@nestjs/common';
import { PairsService } from './pairs.service';
import { PairsController } from './pairs.controller';
import { ExchangesModule } from '../exchanges/exchanges.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
	imports: [ExchangesModule, PrismaModule],
	providers: [PairsService],
	controllers: [PairsController],
})
export class PairsModule {}
