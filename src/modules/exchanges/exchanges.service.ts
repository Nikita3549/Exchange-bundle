import { HttpStatus, Injectable } from '@nestjs/common';
import { Exchange } from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ByBitResponse } from './interefaces/ByBit.response';
import { exchangesGetPriceURLs, NOT_SUPPORTED_SYMBOLS } from './constants';
import { BinanceResponse } from './interefaces/Binance.response';
import { WrongCurrencyException } from './exceptions/wrong-currency.exception';
import { UnknownException } from './exceptions/unknown.exception';

@Injectable()
export class ExchangesService {
	async getCurrencyPrice(
		exchange: Exchange,
		currency: string,
	): Promise<number> {
		if (exchange == Exchange.ByBit) {
			return this.getCurrencyPriceByBit(currency);
		}
		return this.getCurrencyPriceBinance(currency);
	}

	private async getCurrencyPriceBinance(currency: string): Promise<number> {
		const res: AxiosResponse<BinanceResponse> = await axios
			.get(exchangesGetPriceURLs.Binance, {
				params: {
					symbol: currency,
				},
			})
			.catch((err: unknown) => {
				if (
					err instanceof AxiosError &&
					err.status == HttpStatus.BAD_REQUEST
				) {
					throw new WrongCurrencyException();
				}
				throw new UnknownException();
			});

		return res.data.price;
	}
	private async getCurrencyPriceByBit(currency: string): Promise<number> {
		const res: AxiosResponse<ByBitResponse> = await axios.get(
			exchangesGetPriceURLs.ByBit,
			{
				params: {
					category: 'spot',
					symbol: currency,
				},
			},
		);
		if (res.data.retMsg == NOT_SUPPORTED_SYMBOLS) {
			throw new WrongCurrencyException();
		} else if (res.data.retCode != 0) {
			throw new UnknownException();
		}

		return parseFloat(res.data.result.list[0].lastPrice);
	}
}
