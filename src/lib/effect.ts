import type { EffectInstance, EffectsType, Numberish } from './types';
import PowiainaNum from 'powiaina_num.js';

class Effect {
	_effects: Record<string, Set<EffectInstance>>;
	constructor() {
		this._effects = {};
	}

	register(effect: EffectInstance & { target: string }) {
		const { target } = effect;
		if (this._effects[target] === undefined) {
			this._effects[target] = new Set();
		}
		this._effects[target].add(effect);
	}

	get(effectTarget: string) {
		if (!this._effects[effectTarget]) return new PowiainaNum(0);
		// We want to apply the effects in order of operators, first add, then mult, then pow

		const effects = this._effects[effectTarget];
		const [add, mult, pow] = [[], [], []] as [EffectsType, EffectsType, EffectsType];

		effects.forEach((e) => {
			if (!e.active()) return;
			const effect = typeof e.effect === 'function' ? e.effect() : e.effect;
			if (e.operator === 'add') add.push({ effect });
			if (e.operator === 'mult') mult.push({ effect });
			if (e.operator === 'pow') pow.push({ effect });
		});

		let effect = new PowiainaNum(0);
		if (add.length != 0) effect = effect.add(Effect.plus(...add));
		if (mult.length != 0) effect = effect.mul(Effect.times(...mult));
		if (pow.length != 0) effect = effect.pow(Effect.pow(...pow));
		return effect;
	}

	static times<TEffect extends { effect: Numberish }>(...effects: TEffect[]) {
		return effects.reduce((acc, effect) => acc.mul(effect.effect), new PowiainaNum(1));
	}

	static plus<TEffect extends { effect: Numberish }>(...effects: TEffect[]) {
		return effects.reduce((acc, effect) => acc.add(effect.effect), new PowiainaNum(0));
	}

	static pow<TEffect extends { effect: Numberish }>(...effects: TEffect[]) {
		return effects.reduce((acc, effect) => acc.mul(effect.effect), new PowiainaNum(1));
	}
}

export const EffectManager = new Effect();
