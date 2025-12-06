import PowiainaNum from 'powiaina_num.js';
import { player, type Player } from '../player/player';
import { Currencies, getCurrency } from './currencies';

export type UpgradeConfig<T> = {
	id: string;
	upgkey: keyof Player['upgrades'];
	description?: string;
	cost: PowiainaNum;
	currency: Currencies;
	isVisible?(): boolean;
} & (
	| {
			effect?(): never;
			effectDesc?(): never;
	  }
	| {
			effect(x: PowiainaNum): T;
			effectDesc(x: T): string;
	  }
);

export class UpgradeBase {
	id: string;
	constructor(id: string) {
		this.id = id;
	}

	get cost() {
		return PowiainaNum.NaN.clone();
	}

	get description() {
		return 'Description';
	}
	get currency() {
		return Currencies.MM4;
	}
	get upgkey(): keyof Player['upgrades'] {
		throw new Error('Unset');
	}
	canPurchase() {
		return false;
	}
	purchase() {}
	get purchased() {
		return new PowiainaNum(0);
	}
	get hasUpgrade() {
		return false;
	}
	get isVisible() {
		return true;
	}
}

export class Upgrade<T> extends UpgradeBase {
	config: UpgradeConfig<T>;
	id: string;
	constructor(config: UpgradeConfig<T>) {
		super(config.id);
		this.config = config;
		this.id = config.id;
	}

	get cost() {
		return this.config.cost;
	}

	get description() {
		return this.config.description ?? 'unset';
	}
	get currency() {
		return this.config.currency;
	}
	get upgkey() {
		return this.config.upgkey;
	}
	canPurchase() {
		return this.cost.lt(getCurrency(this.currency));
	}
	purchase() {
		if (this.canPurchase()) {
			player.upgrades[this.upgkey] = new PowiainaNum(1);
		}
	}
	get purchased() {
		return player.upgrades[this.upgkey];
	}
	get hasUpgrade() {
		return this.purchased.gte(1);
	}
	get isVisible() {
		return this.config.isVisible?.() ?? true;
	}
}
