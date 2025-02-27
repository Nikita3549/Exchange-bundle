import { Exchange } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CreatePairDto {
	@IsString()
	firstCurrency: string;

	@IsString()
	secondCurrency: string;

	@IsEnum(Exchange)
	exchange: Exchange;
}
