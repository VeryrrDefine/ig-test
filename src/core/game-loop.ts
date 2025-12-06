import PowiainaNum from 'powiaina_num.js';
import { player } from './player/player';
import { Events } from '../lib/event';
import { EVENT_TYPES } from '../lib/enum/event-types';
import { updateOffline } from './features/offline';

export function gameLoop() {
	const diff = new PowiainaNum((Date.now() - player.lastTick) / 1000);
	let multiplier = updateOffline(diff.toNumber());
	Events.dispatch(EVENT_TYPES.GAME_TICK, diff.mul(multiplier));
	player.lastTick = Date.now();
}
