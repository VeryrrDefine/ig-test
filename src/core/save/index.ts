import PowiainaNum, { type PowiainaNumSource } from 'powiaina_num.js';
import { getInitialPlayer, player, type Player } from '../player/player';
import { saveSerializer } from './serializer';
import { SAVE_ID } from '../../game-config';

type DeepPartial<T> = T extends (infer U)[]
	? DeepPartial<U>[] | undefined
	: T extends object
		? { [P in keyof T]?: DeepPartial<T[P]> }
		: T;

/**
 * 此函数是用来：
 * 合并两个对象
 * 合并两个数组
 * 通用的合并，target是source的部分类型
 */
function deepMerge<T extends object>(source: T, target: object, expectedKey?: string[]): T;
function deepMerge<T extends unknown[]>(source: T, target: unknown[], expectedKey?: string[]): T;
function deepMerge<T>(source: T, target: DeepPartial<T>, expectedKey?: string[]): T {
	if (Array.isArray(source)) {
		const targetArray = Array.isArray(target) ? target : [];
		const maxLength = Math.max(source.length, targetArray.length);
		const result: unknown[] = [];

		for (let i = 0; i < maxLength; i++) {
			const sourceItem = i < source.length ? source[i] : undefined;
			const targetItem = i < targetArray.length ? targetArray[i] : undefined;

			if (targetItem === null || sourceItem === null) continue;

			if (typeof sourceItem == 'bigint') {
				result[i] = BigInt(targetItem as string | number | bigint | boolean);
			} else if (
				targetItem !== undefined &&
				targetItem !== null &&
				sourceItem !== null &&
				typeof sourceItem === 'object' &&
				!(sourceItem instanceof PowiainaNum)
			) {
				result[i] = deepMerge(
					sourceItem,
					targetItem as DeepPartial<typeof sourceItem>,
					expectedKey,
				);
			} else if (sourceItem instanceof PowiainaNum) {
				result[i] = new PowiainaNum(targetItem as PowiainaNumSource);
			} else if (sourceItem === undefined && targetItem !== undefined) {
				result[i] = targetItem;
			} else {
				result[i] = targetItem !== undefined ? targetItem : sourceItem;
			}
		}

		return result as T;
	}

	if (typeof source === 'object' && source !== null) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result: any = { ...source };

		if (target === null || target === undefined) return source;

		for (const key of new Set([...Object.keys(source), ...Object.keys(target)])) {
			if ((expectedKey ?? []).includes(key)) continue;
			const sourceValue = source[key as keyof typeof source];
			const targetValue = target[key as keyof typeof target];

			if (targetValue === undefined || targetValue === null) {
				continue;
			}

			if (sourceValue === undefined || sourceValue === null) {
				result[key] = targetValue;
			}

			if (typeof sourceValue == 'bigint') {
				result[key] = BigInt(targetValue as string | number | bigint | boolean);
			} else if (
				sourceValue !== null &&
				typeof sourceValue === 'object' &&
				!(sourceValue instanceof PowiainaNum)
			) {
				result[key] = deepMerge(sourceValue, targetValue, expectedKey) as T[Extract<
					keyof T,
					string
				>];
			} else if (sourceValue instanceof PowiainaNum) {
				result[key] = new PowiainaNum(targetValue as PowiainaNumSource) as T[Extract<
					keyof T,
					string
				>];
			} else if (targetValue !== null && typeof targetValue === 'object') {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				result[key] = deepMerge(targetValue, sourceValue as any, expectedKey);
			} else {
				result[key] = targetValue;
			}
		}

		return result as T;
	}

	return target !== undefined && target !== null ? (target as T) : source;
}

export function loadFromString(
	saveContent: string,
	// , non_options = false
) {
	const deserialized = saveSerializer.deserialize(saveContent);
	Object.assign(
		player,
		deepMerge(
			player,
			deserialized,
			// non_options ? (['options'] satisfies (keyof Player)[]) : [],
		),
	);
}

export function loadSaves() {
	// const current_save2 = localStorage.getItem('RBN-rewritten-current_save_slot');
	// if (current_save2) {
	//         current_save = Number(current_save2);
	// }
	const saveContent = localStorage.getItem(SAVE_ID);
	try {
		if (saveContent) {
			loadFromString(saveContent);
		}
	} catch (error) {
		console.error('Cannot load save');
		// ModalService.show({
		//         title: '无法加载存档',
		//         content: '存档加载中出现问题',
		// });
	}
}

export function saveGame() {
	localStorage.setItem(SAVE_ID, saveSerializer.serialize(player));
}
const savefunc = saveGame;
export function hardReset(excludeKey: (keyof Player)[] = []) {
	const tempplayer = getInitialPlayer();
	Object.assign(
		player,
		deepMerge(
			player,
			tempplayer,
			excludeKey,
			// non_options ? (['options'] satisfies (keyof Player)[]) : [],
		),
	);
	// (Object.keys(tempplayer) as (keyof Player)[]).forEach((key) => {
	// 		if (!excludeKey.includes(key)) {
	// 			// @ts-expect-error
	// 			player[key] = tempplayer[key];
	// 		}
	// 	});
	saveGame();
	// location.reload();
}

export function import_file(): void {
	const a = document.createElement('input');
	a.setAttribute('type', 'file');
	a.setAttribute('accept', 'text/plain');
	a.click();
	a.onchange = () => {
		const fr = new FileReader();
		if (a.files == null) return void alert('未选择文件');
		fr.onload = () => {
			const save = fr.result;
			if (typeof save == 'string') {
				try {
					hardReset();
					loadFromString(save);
					savefunc();
					location.reload();
				} catch {
					console.error('Cannot import save');
				}
			}
		};
		if (!a.files[0]) return void alert('未选择文件');
		fr.readAsText(a.files[0]);
	};
}

export function export_file(): void {
	const str = saveSerializer.serialize(player);
	const file = new Blob([str], {
		type: 'text/plain',
	});
	window.URL = window.URL || window.webkitURL;
	const a = document.createElement('a');
	a.href = window.URL.createObjectURL(file);
	a.download = 'Road of Big Number Rewritten Save - ' + getCurrentBeijingTime() + '.txt';
	a.click();
}

function getCurrentBeijingTime(): string {
	const t = new Date(),
		e = t.getUTCFullYear(),
		r = String(t.getUTCMonth() + 1).padStart(2, '0'),
		a = String(t.getUTCDate()).padStart(2, '0'),
		n = t.getUTCHours(),
		g = t.getUTCMinutes(),
		i = t.getUTCSeconds(),
		S = t.getUTCMilliseconds();
	let o = (n + 8) % 24;
	return (
		o < 0 && (t.setUTCDate(t.getUTCDate() + 1), (o += 24)),
		`${e}-${r}-${a} ${o.toString().padStart(2, '0')}:${g.toString().padStart(2, '0')}:${i
			.toString()
			.padStart(2, '0')}.${S.toString().padStart(3, '0')}`
	);
}
