import PowiainaNum from 'powiaina_num.js';

export type BanType<T, B> = T extends B ? never : T;
export type Numberish = number | PowiainaNum;

export type ChooseKey<T, C> = {
	[key in keyof T as T[key] extends C ? key : never]: T[key];
};

export interface HoldHandlers {
	onStart?: (event: Event) => void;
	onHold?: (event: Event) => void;
	onProgress?: (event: Event) => void;
	onRelease?: (event: Event) => void;
}

export interface HoldDirectiveValue {
	handler: HoldHandlers;
	delay?: number;
	interval?: number;
}

export interface HoldElement extends HTMLElement {
	_holdData?: {
		start: (event: Event) => void;
		stop: (event: Event) => void;
		pressTimer: ReturnType<typeof setTimeout> | null;
		progressTimer: ReturnType<typeof setInterval> | null;
	};
}

export type Operator = 'add' | 'mult' | 'pow';
export type EffectInstance = {
	effect: Numberish | (() => Numberish);
	operator: Operator;
	active: () => boolean;
};
export type EffectsType = { effect: Numberish }[];
