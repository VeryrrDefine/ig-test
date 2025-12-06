import PowiainaNum from 'powiaina_num.js';
import type { Player } from '../player/player';

export type UpgradeConfig<T> = {
	id: string;
	upgkey: keyof Player['upgrades'];
	description?: string;
	cost: PowiainaNum;
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

export class Upgrade<T> {
	config: UpgradeConfig<T>;
	id: string;
	constructor(config: UpgradeConfig<T>) {
		this.config = config;
		this.id = config.id;
	}

	get cost() {
		return this.config.cost;
	}

	get description() {
		return this.config.description;
	}
}
