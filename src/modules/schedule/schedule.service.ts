import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ScheduledTask, schedule } from 'node-cron';
import * as process from 'node:process';
import { PairsService } from '../pairs/pairs.service';
import { ExchangesService } from '../exchanges/exchanges.service';
import { BotUpdate } from '../../botUpdate/bot.update';

@Injectable()
export class ScheduleService implements OnApplicationBootstrap {
	private task: ScheduledTask;
	private count: number = 0;
	private readonly MAX_ITERATIONS: number = +process.env.MAX_ITERATIONS!;
	private readonly PAUSE_HOURS: number =
		+process.env.PAUSE_HOURS! * 60 * 60 * 1000;
	private readonly INTERVAL_MINUTES: number = +process.env.INTERVAL_MINUTES!;

	constructor(
		private readonly pairsService: PairsService,
		private readonly exchangeService: ExchangesService,
		private readonly bot: BotUpdate,
	) {}

	private async startSchedule() {
		this.task = schedule(`*/${this.INTERVAL_MINUTES} * * * *`, async () => {
			console.log(this.count);
			if (this.count < this.MAX_ITERATIONS) {
				const pairs = await this.pairsService.getPairs();

				for (let i = 0; i < pairs.length; i++) {
					const { firstCurrency, secondCurrency, exchange } =
						pairs[i];

					const firstCurrencyPrice =
						await this.exchangeService.getCurrencyPrice(
							exchange,
							firstCurrency,
						);
					const secondCurrencyPrice =
						await this.exchangeService.getCurrencyPrice(
							exchange,
							secondCurrency,
						);

					if (secondCurrencyPrice > firstCurrencyPrice) {
						continue;
					}

					const differentPercentages =
						(firstCurrencyPrice / secondCurrencyPrice) * 100 - 100;

					if (differentPercentages >= 3) {
						this.bot.sendBiggerDifferent(
							differentPercentages,
							firstCurrency,
							secondCurrency,
						);
					} else if (differentPercentages <= 1.5) {
						this.bot.sendLessDifferent(
							differentPercentages,
							firstCurrency,
							secondCurrency,
						);
					}
				}
				this.count++;
			} else {
				this.task.stop();
				this.count = 0;

				setTimeout(() => {
					this.task.start();
				}, this.PAUSE_HOURS);
			}
		});
	}

	async onApplicationBootstrap() {
		await this.startSchedule();
	}
}
