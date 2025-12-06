import { defineComponent } from 'vue';
import { convertMessageToTSX } from './lib/i18n/conv';
import { usePlayerData } from './lib/composables/usePlayerData';
import { format } from './lib/format';
import TopContent from './ui/components/TopContent.vue';
import { findTab } from './ui/tab/tab';
import { player } from './core/player/player';
import { EffectManager } from './lib/effect';
import { EFFECT_TARGETS } from './lib/effect-target';
import { VueLatex } from 'vatex';
export default defineComponent({
	name: 'App',
	setup() {
		const playervolumes = usePlayerData((player) => player.volumes);
		return () => (
			<>
				<TopContent />
				<p class="center">
					{convertMessageToTSX('a', { xxxx: <>{format(playervolumes.value)}</> })}
				</p>
				<p class="center">
					你正在获取 {format(EffectManager.get(EFFECT_TARGETS.MM4_GAIN))}{' '}
					<VueLatex expression="mm^4" /> 每秒
				</p>
				<div class="main-line"></div>
				{(function () {
					const t = findTab(player.currentPage);

					if (!t) {
						return '';
					}
					if (t.component) return <t.component />;
					return '';
				})()}
			</>
		);
	},
});
