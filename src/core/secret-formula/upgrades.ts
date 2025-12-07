import PowiainaNum from 'powiaina_num.js';
import { createClassesFromDb } from '../../lib/createClassFromDb';
import { Currencies } from '../features/currencies';
import { RebuyableUpgrade } from '../features/rebuyableUpgrade';
import { player } from '../player/player';

export const UPGRADE = {
	upgs: createClassesFromDb(
		[
			{
				id: 'bxd',
				upgkey: 'B11',
				cost(count: PowiainaNum) {
					return count.pow(2).mul(10);
				},
				costInverse(res: PowiainaNum) {
					return res.div(10).root(2);
				},
				isVisible() {
					// return true;
					// console.log(player.level.level);
					return player.level.level.gte(1);
				},
			},
			{
				id: 'bxd2',
				upgkey: 'B12',
				cost(count: PowiainaNum) {
					return count.pow_base(1.1).mul(100);
				},
				costInverse(res: PowiainaNum) {
					return res.div(100).clampMin(1).log(1.1);
				},
				isVisible() {
					// return true;
					// console.log(player.level.level);
					return player.level.level.gte(3);
				},
			},
		] as const,
		{
			currency: Currencies.MM4,
		},
		RebuyableUpgrade,
	),
};
