import PowiainaNum from 'powiaina_num.js';
import { VERSION } from '../../game-config';
import { LEVELS } from '../features/resettiers/level';

export function getInitialPlayer() {
	return {
		saveCreateTime: Date.now(),
		lastTick: Date.now(),
		version: VERSION,
		currentPage: 1,
		volumes: new PowiainaNum(0),
		upgrades: {
			B11: new PowiainaNum(0),
			B12: new PowiainaNum(0),
		},
		offlinedTime: 0,
		offlinePower: 0,
		timeOverpower: false,
		isOffline: false,
		level: LEVELS.playerData(),
	};
}
export const player = getInitialPlayer();

export type Player = ReturnType<typeof getInitialPlayer>;
