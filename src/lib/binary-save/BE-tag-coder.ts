import Decimal from 'break_eternity.js';
import { TagCoder } from './tag-coder';
function binaryStringToNumber(x: string) {
	return parseInt(x, 2);
}
/**
 * Decimal Tag Coder
 *
 * magnitude:
 *  106+48 = 152 exponent modes;
 *  7 bits   52 bits
 *  E        M
 * represents  2^(E-53)*M if E<106
 * represents  - 2^(E-103)*M if E>=106
 *
 * layer:
 *
 * 972 exponent modes;
 * 9 bits   53 bits
 * reprecents 2^(E+52)*M
 *
 *
 * sign:
 * 4 modes;
 * 2 bits, +1, +0, -1
 *   repe  00  01  10
 *
 * total 8+52+9+53+2 = 124 bits ~ 16
 *
 * represents:
 * tag: 10
 * 10 00 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * normal decimal
 *
 *
 * 10 01: +infinity
 * 10 02: -infinity
 * 10 03: NaN
 * 10 04: 0
 * 10 05: 1
 * 10 06: -1
 */
export class DecimalTagCoder extends TagCoder {
	static encodeJudgeObject<T extends object>(x: T) {
		return x instanceof Decimal;
	}
	encode() {
		if (!(this.encode_inobject instanceof Decimal))
			throw new Error('Encode inobject is not Decimal');
		let d = this.encode_inobject;
		if (d.eq(+Infinity)) this.encode_outarray.push(0x01);
		else if (d.eq(-Infinity)) this.encode_outarray.push(0x02);
		else if (d.isNan()) this.encode_outarray.push(0x03);
		else if (d.eq(0)) this.encode_outarray.push(0x04);
		else if (d.eq(1)) this.encode_outarray.push(0x05);
		else if (d.eq(-1)) this.encode_outarray.push(0x06);
		else {
			this.encode_outarray.push(0x00);
			let mag = d.mag;
			let e = mag < 0 ? Math.floor(Math.log2(-mag)) + 103 : Math.floor(Math.log2(mag)) + 53;
			let m = Math.abs(mag);

			let l = d.layer;
			let l_e = Math.floor(Math.log2(Math.max(l, 9e15))) - 52;
			let l_m = l < 0x20000000000000 ? l : l / 2 ** l_e;
			let bin =
				(d.sign == 1 ? '00' : d.sign == 0 ? '01' : '10') +
				e.toString(2).padStart(8, '0') +
				((m / 2 ** Math.floor(Math.log2(m))) * 2 ** 52).toString(2).slice(1) +
				l_e.toString(2).padStart(9, '0') +
				l_m.toString(2).padStart(53, '0') +
				'111';
			console.log(
				d.sign == 1 ? '00' : d.sign == 0 ? '01' : '10',
				e.toString(2).padStart(8, '0'),
				((m / 2 ** Math.floor(Math.log2(m))) * 2 ** 52).toString(2).slice(1),
				l_e.toString(2).padStart(9, '0'),
				l_m.toString(2).padStart(53, '0'),
				'111',
			);
			for (let i = 0; i < 128; i += 8) {
				let num = binaryStringToNumber(bin.slice(i, i + 8));
				this.encode_outarray.push(num);
			}
		}
	}
	decode2() {
		let type = this.readBytes(1);
		if (type[0] == 0) throw new Error(`EOS, expected 1 act 0`);

		if (type[1][0] == 0x01) return new Decimal(1 / 0);
		if (type[1][0] == 0x02) return new Decimal(-1 / 0);
		if (type[1][0] == 0x03) return new Decimal(NaN);
		if (type[1][0] == 0x04) return new Decimal(0);
		if (type[1][0] == 0x05) return new Decimal(1);
		if (type[1][0] == 0x06) return new Decimal(-1);

		let cont1 = this.readBytes(16);
		if (cont1[0] < 16) throw new Error(`EOS, expected 16 act ${cont1[0]}`);
		let bin2 = cont1[1].map((x) => x.toString(2).padStart(8, '0')).join('');
		console.log(bin2);
		let sign = (function () {
			let a = bin2.slice(0, 2);
			if (a == '00') return 1;
			if (a == '01') return 0;
			if (a == '10') return -1;
			return NaN;
		})();
		let mag = (function () {
			let e = binaryStringToNumber(bin2.slice(2, 10));
			let m = binaryStringToNumber('1' + bin2.slice(10, 62));
			/**
			 *
			 * magnitude:
			 *  106+48 = 152 exponent modes;
			 *  7 bits   52 bits
			 *  E        M
			 * represents  2^(E-53)*M if E<106
			 * represents  - 2^(E-103)*M if E>=106
			 *
			 */
			if (e < 106) {
				console.log(e);
				return m / 2 ** (105 - e);
			} else {
				return -m / 2 ** (155 - e);
			}
			// let e = mag < 0 ? Math.floor(Math.log2(-mag)) + 103 : Math.floor(Math.log2(mag)) + 53;
			// let m = Math.abs(mag);
		})();
		let layer = (function () {
			let e = binaryStringToNumber(bin2.slice(62, 71));
			let m = binaryStringToNumber(bin2.slice(71, 125));
			return 2 ** e * m;
		})();
		let res = new Decimal(1);
		res.sign = sign;
		res.mag = mag;
		res.layer = layer;
		return res;
	}
	decode() {
		this.decode_outobject = this.decode2();
	}
}
