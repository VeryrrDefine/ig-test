import PowiainaNum from 'powiaina_num.js';

const VERSION = 0;
export function getInitialPlayer() {
	return {
		saveCreateTime: Date.now(),
		lastTick: Date.now(),
		version: VERSION,
		currentPage: 0,
		volumes: new PowiainaNum(0),
		upgrades: {
			B11: new PowiainaNum(0),
		},
	};
}
export const player = getInitialPlayer();

export type Player = ReturnType<typeof getInitialPlayer>;
