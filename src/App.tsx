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
import I18nText from './lib/i18n/I18nText';
import { actualSpeed } from './core/features/offline';
import { useUpdate } from './lib/composables/useUpdate';
export default defineComponent({
	name: 'App',
	setup() {
		const playervolumes = usePlayerData((player) => player.volumes);
		const usePage = usePlayerData((player) => player.currentPage);
		const gain = useUpdate(() =>
			format(EffectManager.get(EFFECT_TARGETS.MM4_GAIN).mul(actualSpeed())),
		);
		return () => (
			<>
				<TopContent />
				<p class="center">
					<I18nText message="mm4amount">
						{{
							amount: () => <>{format(playervolumes.value)}</>,
						}}
					</I18nText>
				</p>
				<p class="center">
					<I18nText message="mm4gain">
						{{
							amount: () => <>{gain.value}</>,
						}}
					</I18nText>
				</p>
				<div class="main-line"></div>
				{(function () {
					const t = findTab(usePage.value);

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
