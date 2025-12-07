import type { SaveDecoder, SaveEncoder } from '.';

export class TagCoder {
	index: number = 0;
	encode_inobject: any = null;
	encode_outarray: number[] = [];

	decode_inarray: number[] = [];
	decode_outobject: any = null;

	saveencoder: SaveEncoder<any> | null = null;
	savedecoder: SaveDecoder | null = null;
	constructor() {}
	static encodeJudgeObject<T extends object>(_x: T) {
		return false;
	}
	encode() {}
	decode() {}
	readBytes(bytes: number): [number, number[]] {
		let readlength =
			this.index + bytes >= this.decode_inarray.length
				? this.decode_inarray.length - this.index
				: bytes;
		let array = this.decode_inarray.slice(this.index, this.index + bytes);
		this.index = Math.min(this.decode_inarray.length, this.index + bytes);

		return [readlength, array];
	}
}
