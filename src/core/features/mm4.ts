import PowiainaNum from 'powiaina_num.js';
import { EffectManager } from '../../lib/effect';
import { EFFECT_TARGETS } from '../../lib/effect-target';
import { dispatchDiff } from '../../lib/event';
import { player } from '../player/player';

export function getMM4gain() {
	return EffectManager.get(EFFECT_TARGETS.MM4_GAIN);
}

export const generation = function (diff: PowiainaNum) {
	player.volumes = player.volumes.add(getMM4gain().mul(diff));
};

export function initMM4Mechanics() {
	dispatchDiff(generation);
}

EffectManager.register({
	target: EFFECT_TARGETS.MM4_GAIN,
	effect: new PowiainaNum(1),
	operator: 'add',
	active() {
		return true;
	},
});

EffectManager.register({
	target: EFFECT_TARGETS.MM4_GAIN,
	get effect() {
		let b = player.upgrades.B11;
		b = b.mul(player.upgrades.B12.add(1));
		return b;
	},
	operator: 'add',
	active() {
		return player.upgrades.B11.gte(1);
	},
});
