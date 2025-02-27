import { Exchange } from '@prisma/client';

export const exchangesGetPriceURLs = {
	[Exchange.Binance]: 'https://api.binance.com/api/v3/ticker/price',
	[Exchange.ByBit]: 'https://api.bybit.com/v5/market/tickers',
};

export const NOT_SUPPORTED_SYMBOLS = 'Not supported symbols';

export const NOT_SUPPORTED_CURRENCY = 'Not supported currency';

export const UNKNOWN_ERROR_IN_EXCHANGE_RESPONSE =
	'Unknown error in exchange response';
