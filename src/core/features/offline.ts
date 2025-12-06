import type PowiainaNum from 'powiaina_num.js';
import { player } from '../player/player';

export function actualSpeed() {
	let speed = 2 ** player.offlinePower;
	if (player.isOffline) return 0;
	if (player.timeOverpower && player.offlinedTime >= 0.05 * speed) return speed;

	return 1;
}
/**
 * This function will return a multiplier,
 * , multiply it to diff.
 *
 * @param diff millseconds
 */
export function updateOffline(diff: number) {
	if (player.isOffline) {
		player.offlinedTime += diff;
		return 0;
	}
	let speed = 2 ** player.offlinePower;
	if (player.timeOverpower && player.offlinedTime >= diff * speed) {
		player.offlinedTime -= diff * speed - diff;

		return speed;
	}
	return 1;
}
