import { defineComponent } from 'vue';
import { convertMessageToTSX } from './conv';

export default defineComponent({
	name: 'I18nText',
	props: {
		message: {
			type: String,
			required: true,
		},
	},
	setup(props, { slots }) {
		return () => convertMessageToTSX(props.message, slots);
	},
});
