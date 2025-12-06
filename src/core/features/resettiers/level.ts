import PowiainaNum from 'powiaina_num.js';
import { player } from '../../player/player';

export const LEVELS = {
	levelCost(level: PowiainaNum) {
		return new PowiainaNum(10).mul(level.pow_base(5));
	},
	upgradeLevel() {
		if (LEVELS.levelCost(player.level.level).lte(player.volumes)) {
			player.volumes = new PowiainaNum(0);
			player.level.level = player.level.level.add(1);
			player.upgrades.B11 = new PowiainaNum(0);
			player.upgrades.B12 = new PowiainaNum(0);
		}
	},
	playerData() {
		return {
			level: new PowiainaNum(0),
		};
	},
};
