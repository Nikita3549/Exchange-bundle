import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Exchange, Pair } from '@prisma/client';
import { ExchangesService } from '../exchanges/exchanges.service';

@Injectable()
export class PairsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly exchangesService: ExchangesService,
	) {}

	async createPair(
		firstCurrency: string,
		secondCurrency: string,
		exchange: Exchange,
	) {
		await this.prisma.pair.create({
			data: {
				firstCurrency,
				secondCurrency,
				exchange,
			},
		});
	}

	async getPairs(): Promise<Pair[]> {
		return this.prisma.pair.findMany();
	}

	async deletePair(id: string) {
		await this.prisma.pair.delete({
			where: {
				uuid: id,
			},
		});
	}
}
