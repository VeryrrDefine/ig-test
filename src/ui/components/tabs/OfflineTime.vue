<script setup lang="ts">
import { player } from '../../../core/player/player';
import { useUpdate } from '../../../lib/composables/useUpdate';
import { formatTime } from '../../../lib/format/format-time';
import Slider from '../Slider.vue';
function x(val: any): string {
	return (2 ** val).toFixed(3);
}
const useOfflinedTime = useUpdate(() => player.offlinedTime);
const useOfflineStatus = useUpdate(() => (player.isOffline ? 'ON' : 'OFF'));
const useOverPowerStatus = useUpdate(() => (player.timeOverpower ? 'ON' : 'OFF'));
</script>

<template>
	<div class="center">
		<div class="center div-center" style="width: 24rem">
			<p>你有{{ formatTime.fromSeconds(useOfflinedTime) }}的离线时间</p>
			<div class="button" @click="player.isOffline = !player.isOffline">
				切换离线时间状态 ({{ useOfflineStatus }})
			</div>
			<div class="button" @click="player.timeOverpower = !player.timeOverpower">
				切换时间加速状态 ({{ useOverPowerStatus }})
			</div>
			<Slider
				:min="0"
				:max="7"
				dot-width="2.2rem"
				dot-height="1.6rem"
				width="24rem"
				:interval="0.001"
				:xformatter="x"
				:value="player.offlinePower"
				@input="player.offlinePower = $event"
			/>
		</div>
	</div>
</template>
