import PowiainaNum from 'powiaina_num.js';
import { Upgrade, UpgradeBase, type UpgradeConfig } from './upgrade';
import { player } from '../player/player';
import { getCurrency, setCurrency } from './currencies';

export type RebuyableUpgradeConfig<T> = Omit<UpgradeConfig<T>, 'cost'> & {
	cost: (count: PowiainaNum) => PowiainaNum;
	costInverse: (res: PowiainaNum) => PowiainaNum;
};

export class RebuyableUpgrade<T> extends UpgradeBase {
	config: RebuyableUpgradeConfig<T>;
	constructor(config: RebuyableUpgradeConfig<T>) {
		super(config.id);
		this.config = config;
	}
	get cost() {
		return this.config.cost(this.purchaseAmount);
	}
	get costInverse() {
		return this.config.costInverse(getCurrency(this.currency));
	}
	get purchaseAmount() {
		return player.upgrades[this.config.upgkey];
	}
	set purchaseAmount(x: PowiainaNum) {
		player.upgrades[this.config.upgkey] = x;
	}
	canPurchase() {
		return this.cost.lt(getCurrency(this.currency));
	}
	get purchased() {
		return player.upgrades[this.upgkey];
	}
	get upgkey() {
		return this.config.upgkey;
	}
	purchase(): void {
		if (this.canPurchase()) {
			const aftercost = this.cost;
			player.upgrades[this.upgkey] = this.costInverse.ceil();
			setCurrency(this.currency, getCurrency(this.currency).sub(aftercost).clampMin(0));
		}
	}
	get isVisible() {
		return this.config.isVisible?.() ?? true;
	}
}
