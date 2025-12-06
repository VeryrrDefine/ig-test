<script setup lang="ts">
import { SubTab, Tab, tabs } from '../tab/tab';
import { player } from '../../core/player/player';
import { useUpdate } from '../../lib/composables/useUpdate';
function a(tab: Tab) {
	tab.preClick();
	tab.click();
}
function b(st: SubTab) {
	st.preClick();
	st.click();
}
const c = useUpdate(() => Math.random());
</script>
<template>
	<div class="div-center center">
		<div v-for="tab in tabs.all" :key="tab.id" style="display: inline">
			<div
				class="button"
				v-if="tab.visible"
				:class="tab.class"
				:style="tab.style"
				@click="() => a(tab)"
			>
				{{ tab.text }}
			</div>
			<span :key="c" style="display: none"></span>
			<template v-for="st in tab.subtabs.all">
				<div
					v-if="tab.subpages.includes(player.currentPage) && st.visible"
					:class="st.class"
					:style="st.style"
					:key="st.id"
					class="button-small"
					@click="() => b(st)"
				>
					{{ st.text }}
				</div>
			</template>
		</div>
	</div>
</template>
