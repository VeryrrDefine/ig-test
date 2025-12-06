import { onUnmounted, shallowRef } from 'vue';

export const useUpdate = <T>(selector: () => T) => {
	const value = shallowRef(selector());

	const updateRefValue = () => {
		// debugger;
		value.value = selector();
		intervalRequest = setTimeout(updateRefValue, 10);
	};

	let intervalRequest = setTimeout(updateRefValue, 10);

	onUnmounted(() => {
		clearTimeout(intervalRequest);
	});

	return value;
};
