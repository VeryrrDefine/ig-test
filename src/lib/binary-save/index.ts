import { DecimalTagCoder } from './BE-tag-coder';
import type { TagCoder } from './tag-coder';

function float64ToBin(x: number): [number, number, number, number, number, number, number, number] {
	const a = new DataView(new ArrayBuffer(8));
	a.setFloat64(0, x);

	return [
		a.getUint8(0),
		a.getUint8(1),
		a.getUint8(2),
		a.getUint8(3),
		a.getUint8(4),
		a.getUint8(5),
		a.getUint8(6),
		a.getUint8(7),
	];
}
function binToFloat64(x: number[]) {
	const a = new DataView(new ArrayBuffer(8));
	for (let i = 0; i < 8; i++) {
		const n = x[i];
		if (typeof n == 'undefined' || !Number.isInteger(n)) {
			throw new Error(`Cannot read array's ${i + 1}th term`);
		} else {
			a.setUint8(i, n);
		}
	}
	return a.getFloat64(0);
}
function int32Split(x: number): [number, number] {
	if (!Number.isInteger(x)) throw new Error('Not a integer');
	if (x < 0 || x >= 0x10000) throw new Error('out of range');
	return [Math.floor(x / 256), x % 256];
}
function stringToBin(x: string) {
	const encoder = new TextEncoder();
	const binaryData = encoder.encode(x);
	return Array.from(binaryData);
}

function binToString(x: Uint8Array) {
	const encoder = new TextDecoder();
	const stringData = encoder.decode(x);
	return stringData;
}
function encodeString(x: string): [number, number, ...number[]] {
	let array = stringToBin(x);
	let res: [number, number, ...number[]] = [...int32Split(array.length), ...array];
	return res;
}
export class SaveEncoder<T> {
	object: T;
	result: number[];
	encoded: boolean = false;
	static encoders = new Map<number, typeof TagCoder>();
	constructor(object: T) {
		this.object = object;
		this.result = [];
	}
	reinitialize(object: T) {
		this.object = object;
		this.result = [];
		this.encoded = false;
	}

	encodeObject() {
		if (typeof this.object == 'number') {
			this.result.push(0x01, ...float64ToBin(this.object));
		}
		if (typeof this.object == 'string') {
			this.result.push(0x00, ...encodeString(this.object));
		}
		if (typeof this.object == 'bigint') {
			this.result.push(0x08, ...encodeString(this.object.toString()));
		}
		if (this.object === undefined) {
			this.result.push(0x60);
		}
		if (this.object === true) {
			this.result.push(0x0a);
		}
		if (this.object === false) {
			this.result.push(0x0b);
		}
		if (typeof this.object == 'object') {
			if (this.object === null) {
				this.result.push(0x40);
			} else {
				// Check encoders
				for (const term of SaveEncoder.encoders.entries()) {
					if (term[1].encodeJudgeObject(this.object)) {
						let tagcoder = new term[1]();
						tagcoder.encode_inobject = this.object;
						tagcoder.saveencoder = new SaveEncoder(null as any);
						tagcoder.encode();
						this.result.push(term[0], ...tagcoder.encode_outarray);
						this.encoded = true;
						return;
					}
				}
				if (Array.isArray(this.object)) {
					this.result.push(0x03);
					for (const obj of this.object) {
						const saveEncoder2 = new SaveEncoder(obj);
						saveEncoder2.encodeObject();
						const result = saveEncoder2.result;
						this.result.push(0xff, ...result);
					}
					this.result.push(0xfe);
					this.encoded = true;
					return;
				}
				this.result.push(0x04);
				const t = this.object;
				let keys = Object.keys(t).filter(
					(x) => typeof x === 'string' || x == Symbol.iterator,
				) as unknown as (keyof T)[];
				for (const key of keys) {
					if (typeof key == 'symbol') continue;
					if (typeof key == 'number') continue;

					const stringdata = encodeString(key);
					let o = t[key];
					const saveEncoder2 = new SaveEncoder(o);
					saveEncoder2.encodeObject();
					const result = saveEncoder2.result;
					this.result.push(0xff, ...stringdata, ...result);
				}
				this.result.push(0xfe);
			}
		}
		this.encoded = true;
	}
}
export class SaveDecoder {
	array: number[];
	index: number = 0;
	result: any;
	decoded: boolean = false;
	static decoders = new Map<number, typeof TagCoder>();
	constructor(array: number[]) {
		this.array = array;
	}
	reinitialize(array: number[]) {
		this.array = array;
		this.index = 0;
		this.result = undefined;
		this.decoded = false;
	}
	readBytes(bytes: number): [number, number[]] {
		let readlength =
			this.index + bytes >= this.array.length ? this.array.length - this.index : bytes;
		let array = this.array.slice(this.index, this.index + bytes);
		this.index = Math.min(this.array.length, this.index + bytes);

		return [readlength, array];
	}
	readSingleString() {
		const length = this.readBytes(2);
		if (typeof length[1][0] === 'undefined' || typeof length[1][1] === 'undefined')
			throw new Error(`EOS, cannot read length`);
		const length2 = length[1][0] * 256 + length[1][1];
		const string = this.readBytes(length2);
		if (string[0] < length2)
			throw new Error(`EOS, expecetd read size ${length2}, actual ${string[0]}`);
		const stringres = binToString(new Uint8Array(string[1]));
		return stringres;
	}
	decodeObject() {
		let type = this.readBytes(1);
		if (type[0] == 0) throw new Error('EOS, cannot read tag type');
		if (type[1][0] == 0x00) {
			this.result = this.readSingleString();
		}
		if (type[1][0] == 0x01) {
			const number2 = this.readBytes(8);
			if (number2[0] < 8) throw new Error(`EOS, expected read size 8, actual ${number2[0]}`);

			this.result = binToFloat64(number2[1]);
		}
		if (type[1][0] == 0x08) {
			this.result = BigInt(this.readSingleString());
		}
		if (type[1][0] == 0x03) {
			let maxKeys = 1000;
			let res = [];
			let i = 0;
			while (maxKeys >= 0) {
				const isendtag = this.readBytes(1);
				if (isendtag[0] == 0) throw new Error(`EOS, expected read size 1, actual 0`);
				if (isendtag[1][0] == 0xfe) break;
				else {
					let obj = new SaveDecoder(this.array);
					obj.index = this.index;
					obj.decodeObject();
					let value = obj.result;
					this.index = obj.index;
					res[i] = value;
				}
				maxKeys--;
				i++;
			}
			this.result = res;
		}
		if (type[1][0] == 0x04) {
			let maxKeys = 1000;
			let res: {
				[key: string]: any;
			} = {};
			while (maxKeys >= 0) {
				const isendtag = this.readBytes(1);
				if (isendtag[0] == 0) throw new Error(`EOS, expected read size 1, actual 0`);
				if (isendtag[1][0] == 0xfe) break;
				else {
					let key = this.readSingleString();
					let obj = new SaveDecoder(this.array);
					obj.index = this.index;
					obj.decodeObject();
					let value = obj.result;
					this.index = obj.index;
					res[key] = value;
				}
				maxKeys--;
			}
			this.result = res;
		}
		if (type[1][0] == 0xa) {
			this.result = true;
		}
		if (type[1][0] == 0xb) {
			this.result = false;
		}
		if (type[1][0] == 0x40) {
			this.result = null;
		}
		if (type[1][0] == 0x60) {
			this.result = undefined;
		}
		// Check decoders
		for (const term of SaveEncoder.encoders.entries()) {
			if (term[0] == type[1][0]) {
				let tagcoder = new term[1]();
				tagcoder.decode_inarray = this.array;
				tagcoder.index = this.index;
				tagcoder.savedecoder = new SaveDecoder(this.array);
				tagcoder.savedecoder.index = this.index;
				tagcoder.decode();
				this.index = tagcoder.index;
				this.result = tagcoder.decode_outobject;
			}
		}
		this.decoded = true;
	}
}

export function encodeObject(a: any): Uint8Array {
	const encoder = new SaveEncoder(a);
	encoder.encodeObject();
	return new Uint8Array(encoder.result);
}
export function decodeObject(a: Uint8Array): unknown {
	const decoder = new SaveDecoder(Array.from(a));
	decoder.decodeObject();
	return decoder.result;
}

SaveEncoder.encoders.set(0x10, DecimalTagCoder);
SaveDecoder.decoders.set(0x10, DecimalTagCoder);
