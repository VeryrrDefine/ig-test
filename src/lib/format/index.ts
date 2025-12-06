import { player } from '../../core/player/player';
import type { PowiainaNumSource } from 'powiaina_num.js';
import PowiainaNum from 'powiaina_num.js';
import Notations from '@veryrrdefine/powiainanum-notations';
export type Notation =
	// | "mixed scientific"
	'scientific';
// | "engineering"
// | "standard"
// const FGHJFormat
const FGHJFormat = new Notations.FGHJNotation();
function xeyFormat(val: PowiainaNum, prec: number) {
	// return ''
	return FGHJFormat.format(val, prec);
}

export const formatWhole = (num2: PowiainaNumSource): string => {
	const num = new PowiainaNum(num2).floor();
	if (num.gte(1e3)) return format(num, 4);
	return format(num, 0);
};
export const format = (value: PowiainaNumSource, precision: number = 4) => {
	// const notation = player.options.notation;

	// switch (notation) {
	// 	case 'scientific':
	return xeyFormat(new PowiainaNum(value), precision);
	// }
	return value.toString();
};
