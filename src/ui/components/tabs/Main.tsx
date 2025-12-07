import { defineComponent } from 'vue';
import { useUpdate } from '../../../lib/composables/useUpdate';
import { LEVELS } from '../../../core/features/resettiers/level';
import { player } from '../../../core/player/player';
import { usePlayerData } from '../../../lib/composables/usePlayerData';
import { format, formatWhole } from '../../../lib/format';
import { VueLatex } from 'vatex';
import SingleRebuyable from '../SingleRebuyable.vue';
import { UPGRADE } from '../../../core/secret-formula/upgrades';
export default defineComponent({
	name: 'Main',
	setup() {
		// const counter = ref(0);
		// const content = ref('');

		const useLevel = usePlayerData((player) => player.level.level);
		const useLevelCost = useUpdate(() => LEVELS.levelCost(player.level.level));
		return () => (
			<>
				<div class="center">
					<div>
						<div>
							<b>Level {formatWhole(useLevel.value)}</b>
						</div>
						<div class="button" onClick={() => LEVELS.upgradeLevel()}>
							Upgrade Level, but lose <VueLatex expression="mm^4" />.<br />
							Cost: {format(useLevelCost.value)}
							<VueLatex expression="mm^4" />
						</div>
					</div>
					<SingleRebuyable buyable={UPGRADE.upgs.bxd} />
					<SingleRebuyable buyable={UPGRADE.upgs.bxd2} />
					{/* <br />
					<br />
					<br />
					<br />
					{convertMessageToTSX('b', { hyw: 'bx' })}
					<p class="center"></p>
					<h1>Multi Dimensional Volume Incremental</h1>
					hyw
					<div>My Game</div>
					<div
						v-hold={{
							handler: {
								onProgress() {
									counter.value = counter.value + 1;
								},
							},
						}}
						onClick={function () {
							counter.value = counter.value + 1;
						}}
					>
						Hold me
					</div>
					<div>Counter: {counter.value}</div>
					<div>
						<input v-model={content.value} />
					</div>
					<C text={content.value} /> */}
				</div>
			</>
		);
	},
});
