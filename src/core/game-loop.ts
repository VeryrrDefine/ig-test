import PowiainaNum from 'powiaina_num.js';
import { player } from './player/player';
import { Events } from '../lib/event';
import { EVENT_TYPES } from '../lib/enum/event-types';

export function gameLoop() {
	const diff = new PowiainaNum((Date.now() - player.lastTick) / 1000);
	Events.dispatch(EVENT_TYPES.GAME_TICK, diff);
	player.lastTick = Date.now();
}
