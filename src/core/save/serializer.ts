import { deflate, inflate } from 'pako';

type SerializeStep = {
	serialize: (x: any) => any;
	deserialize: (x: any) => any;
};

export const saveSerializer = {
	encoder: new TextEncoder(),
	decoder: new TextDecoder(),

	startString: 'Mdvi6SaveFileFormat',
	endString: 'EndOfMdvi6SaveFile',

	steps1: [
		{
			serialize: (x: object | unknown[] | string): string => JSON.stringify(x),
			deserialize: (x: string): any => JSON.parse(x),
		},
		{
			serialize: (x: string): Uint8Array => saveSerializer.encoder.encode(x),
			deserialize: (x: Uint8Array): string => saveSerializer.decoder.decode(x),
		},
		{
			serialize: (x: Uint8Array): Uint8Array => deflate(x),
			deserialize: (x: Uint8Array): Uint8Array => inflate(x),
		},
		{
			serialize: function (x: Uint8Array): string {
				return Array.from(x)
					.map((byte: number) => String.fromCharCode(byte))
					.join('');
			},
			deserialize: function (x: string): Uint8Array {
				return Uint8Array.from(Array.from(x).map((char: string) => char.charCodeAt(0)));
			},
		},
		{
			serialize: (x: string): string => btoa(x),
			deserialize: (x: string): string => atob(x),
		},
		{
			serialize: (x: string): string =>
				x.replace(/=+$/g, '').replace(/0/g, '0a').replace(/\+/g, '0b').replace(/\//g, '0c'),
			deserialize: (x: string): string =>
				x.replace(/0b/g, '+').replace(/0c/g, '/').replace(/0a/g, '0'),
		},
		{
			serialize: (x: string): string =>
				saveSerializer.startString + x + saveSerializer.endString,
			deserialize: (x: string): string =>
				x.slice(saveSerializer.startString.length, -saveSerializer.endString.length),
		},
	] as SerializeStep[],

	serialize(s: any): string {
		return this.steps1.reduce((x: any, f: SerializeStep) => f.serialize(x), s) as string;
	},

	// 反序列化时自动检测版本
	deserialize(s: any): any {
		if (typeof s === 'string') {
			return this.steps1.reduceRight((x: any, f: SerializeStep) => f.deserialize(x), s);
		}
		throw new Error('无法识别的存档格式');
	},
} as const;
