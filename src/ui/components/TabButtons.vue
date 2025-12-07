<script setup lang="ts">
import { SubTab, Tab, tabs } from '../tab/tab';
import { player } from '../../core/player/player';
import { useUpdate } from '../../lib/composables/useUpdate';
function clicktab(tab: Tab) {
	tab.preClick();
	tab.click();
}
function clicksubtab(st: SubTab) {
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
				@click="() => clicktab(tab)"
			>
				{{ tab.text }}
			</div>
			<span :key="c" style="display: none"></span>
			<template v-for="subtab in tab.subtabs.all">
				<div
					v-if="tab.subpages.includes(player.currentPage) && subtab.visible"
					:class="subtab.class"
					:style="subtab.style"
					:key="subtab.id"
					class="button-small"
					@click="() => clicksubtab(subtab)"
				>
					{{ subtab.text }}
				</div>
			</template>
		</div>
	</div>
</template>
