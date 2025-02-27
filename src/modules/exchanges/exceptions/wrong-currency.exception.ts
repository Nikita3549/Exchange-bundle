export class WrongCurrencyException extends Error {
	constructor(message?: string) {
		super(message);
	}
}
