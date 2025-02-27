import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	InternalServerErrorException,
	NotFoundException,
	Param,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { PairsService } from './pairs.service';
import { CreatePairDto } from './dto/create-pair.dto';
import { Pair } from '@prisma/client';
import { ExchangesService } from '../exchanges/exchanges.service';
import { WrongCurrencyException } from '../exchanges/exceptions/wrong-currency.exception';
import {
	NOT_SUPPORTED_CURRENCY,
	UNKNOWN_ERROR_IN_EXCHANGE_RESPONSE,
} from '../exchanges/constants';
import { UnknownException } from '../exchanges/exceptions/unknown.exception';

@Controller('pairs')
export class PairsController {
	constructor(
		private readonly pairsService: PairsService,
		private readonly exchangeService: ExchangesService,
	) {}

	@Post('create')
	@UsePipes(new ValidationPipe())
	async createPair(@Body() createPairDto: CreatePairDto) {
		const { firstCurrency, secondCurrency, exchange } = createPairDto;

		try {
			await this.exchangeService.getCurrencyPrice(
				exchange,
				firstCurrency,
			);
			await this.exchangeService.getCurrencyPrice(
				exchange,
				secondCurrency,
			);

			await this.pairsService.createPair(
				firstCurrency,
				secondCurrency,
				exchange,
			);
		} catch (e: unknown) {
			if (e instanceof WrongCurrencyException) {
				throw new BadRequestException(NOT_SUPPORTED_CURRENCY);
			} else if (e instanceof UnknownException) {
				throw new InternalServerErrorException(
					UNKNOWN_ERROR_IN_EXCHANGE_RESPONSE,
				);
			}

			throw new Error();
		}

		return;
	}

	@Get()
	async getPairs(): Promise<Pair[]> {
		return await this.pairsService.getPairs();
	}

	@Delete(':id')
	async deletePair(@Param('id') id: string) {
		return await this.pairsService.deletePair(id).catch(() => {
			throw new NotFoundException();
		});
	}
}
