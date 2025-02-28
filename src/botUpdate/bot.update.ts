import { InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Update()
export class BotUpdate {
	private users: number[] = [];
	constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}

	@Start()
	async onStart(ctx: Context) {
		if (!ctx?.chat) {
			throw new Error('Ctx.chat is null');
		}

		if (!this.users.includes(ctx.chat.id)) {
			this.users.push(ctx.chat.id);
		}

		await ctx.reply('Бот успешно запущен');
	}

	async sendLessDifferent(
		different: number,
		firstCurrency: string,
		secondCurrency: string,
	) {
		const message = `DOWN ${new Date().toLocaleString('ru-RU', {
			hour12: false,
			timeZone: 'Europe/Moscow',
		})} Пара: ${firstCurrency}/${secondCurrency} разница составляет ${different.toFixed(1)}%`;

		await this.sendMessage(message);
	}
	async sendBiggerDifferent(
		different: number,
		firstCurrency: string,
		secondCurrency: string,
	) {
		const message = `UP ${new Date().toLocaleString('ru-RU', {
			hour12: false,
			timeZone: 'Europe/Moscow',
		})} Пара: ${firstCurrency}/${secondCurrency} разница составляет ${different.toFixed(1)}%`;

		await this.sendMessage(message);
	}

	private async sendMessage(message: string) {
		for (const chatId of this.users) {
			this.bot.telegram.sendMessage(chatId, message);
		}
	}
}
