import type { PowiainaNumSource } from 'powiaina_num.js';
import { player } from '../player/player';
import PowiainaNum from 'powiaina_num.js';

export enum Currencies {
	MM4 = 'MM4',
}

export function getCurrency(x: Currencies) {
	switch (x) {
		case Currencies.MM4:
			return player.volumes;

		default:
			const isnever: never = x;
			return PowiainaNum.NaN;
	}
}

export function setCurrency(x: Currencies, y: PowiainaNumSource) {
	switch (x) {
		case Currencies.MM4:
			return (player.volumes = new PowiainaNum(y));

		default:
			const isnever: never = x;
			return PowiainaNum.NaN;
	}
}
