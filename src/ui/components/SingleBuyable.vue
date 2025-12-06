<script lang="ts" setup>
import { useUpdate } from '../../lib/composables/useUpdate';
import { format } from '../../lib/format';
import type { Upgrade } from '../../core/features/upgrade';
import { formatWhole } from '../../lib/format';

const props = defineProps<{ upgrade: Upgrade<{}>; inline?: boolean }>();

const canPurchase = useUpdate(() => props.upgrade.canPurchase());
const hasUpgrade = useUpdate(() => props.upgrade.hasUpgrade);
const visible = useUpdate(() => props.upgrade.isVisible);
const key = useUpdate(() => Math.random());
// const more = useUpdate(() => props.buyable.more)
// const req = useUpdate(() => props.buyable.requirements)
function useClass() {
	let useclass = 'upgrade_buttonbig';
	// if (false) useclass = 'upgrade_buttonsmall';
	if (hasUpgrade.value) useclass += '_complete';
	else if (!canPurchase.value) useclass += '_unable';

	// if (false) {
	// 	useclass += " upgrade_dilated"
	// }
	// useclass += ' ' + props.buyable.class
	return useclass;
}
</script>

<template>
	<div class="upgrade" @click="upgrade.purchase" v-if="visible" :class="inline ? 'inline' : ''">
		<div :class="useClass()" astyle="buyable.style">
			<div style="font-weight: bold">
				<!-- {{ buyable.name }} -->
				<!-- +{{ formatWhole(more) }} -->
			</div>
			<!-- <div v-if="!buyable.reachedRequirements && !buyable.permanent">
				暂未解锁<br />
				<Requirements :req="req" />
			</div> -->
			<!-- <div 
            av-else
            >
				<div v-html="buyable.description"></div>
				<div v-if="!buyable">
					效果：<span
						v-html="buyable.effectDescription(buyable.effect ?? buyable.defValue)"
					></span>
				</div>
			</div> -->
			<div v-html="upgrade.description"></div>
			<div av-if="!buyable.permanent">
				价格：{{
					format(upgrade.cost)
					//+ buyable.config.currency
				}}
			</div>
			<!-- <div v-else style="color: green; font-weight: bold">保持持有</div> -->
		</div>
	</div>
</template>

<style scoped>
.canBuy {
	background-color: #408940;
}
</style>
