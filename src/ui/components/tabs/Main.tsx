import { defineComponent, ref } from 'vue';
import { convertMessageToTSX } from '../../../lib/i18n/conv';
import { component as C } from '../../text-to-component-convert';
export default defineComponent({
	name: 'Main',
	setup() {
		const counter = ref(0);
		const content = ref('');
		return () => (
			<>
				<div class="center">
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
					<C text={content.value} />
				</div>
			</>
		);
	},
});
