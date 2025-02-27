export interface ByBitResponse {
	retCode: number;
	retMsg: string;
	result: {
		category: string;
		list: [
			{
				symbol: string;
				lastPrice: string;
			},
		];
	};
}
