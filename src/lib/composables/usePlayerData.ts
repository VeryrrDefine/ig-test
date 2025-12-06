import { player, type Player } from '../../core/player/player';
import { onUnmounted, shallowRef } from 'vue';

export const usePlayerData = <T>(selector: (player: Player) => T) => {
	const value = shallowRef(selector(player));

	const updateRefValue = () => {
		value.value = selector(player);
		intervalRequest = setTimeout(updateRefValue, 10);
	};

	let intervalRequest = setTimeout(updateRefValue, 10);

	onUnmounted(() => {
		clearTimeout(intervalRequest);
	});

	return value;
};
