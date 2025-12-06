import type { DefineComponent } from 'vue';
import { player } from '../../core/player/player';
import { createClassesFromDb } from '../../lib/createClassFromDb';
import Save from '../components/tabs/Save.vue';
import About from '../components/tabs/About.vue';
import Main from '../components/tabs/Main';

interface ITabConfigBase {
	id: string;
	style?: string;
	class?: string;
	visible?: boolean;
	text?: string;
	preClick?(): void;
	click?(): void;
	focus?(): boolean;
}

interface ITabConfig extends ITabConfigBase {
	subtabs: { all: SubTab[]; [Symbol.iterator](): Generator<SubTab, any, any> };
}
class TabBase {
	get style(): string {
		return this.config.style ?? '';
	}
	get class(): string {
		return (this.config.class ?? '') + (this.focus() ? ' focus' : '');
	}

	config: ITabConfigBase;

	get visible(): boolean {
		return this.config.visible ?? true;
	}
	get text(): string {
		return this.config.text ?? '拜谢';
	}
	preClick() {
		this.config.preClick?.();
	}
	click() {
		this.config.click?.();
	}
	focus(): boolean {
		return this.config.focus?.() ?? false;
	}
	id: string;
	constructor(config: ITabConfigBase) {
		this.config = config;
		this.id = config.id;
	}
}
export class Tab extends TabBase {
	config: ITabConfig;
	get class() {
		return 'menu1' + (this.focus() ? ' focus' : '');
	}
	focus(): boolean {
		return this.subpages.includes(player.currentPage);
	}
	get subtabs() {
		return this.config.subtabs;
	}
	get subpages() {
		return this.config.subtabs.all.map((x) => x.config.tabid);
	}
	click(): void {
		if (this.config.subtabs.all[0]) {
			player.currentPage = this.config.subtabs.all[0].config.tabid;
		}
	}
	constructor(config: ITabConfig) {
		super(config);
		this.config = config;
	}
}

type ISubtabConfig = ITabConfigBase & {
	tabid: number;
	component?: DefineComponent<{}, {}, any>;
};
export class SubTab extends TabBase {
	config: ISubtabConfig;
	constructor(config: ISubtabConfig) {
		super(config);
		this.config = config;
	}
	click() {
		clicktabfunc(this.config.tabid)();
	}
	focus() {
		return focused(this.config.tabid)();
	}
	get class() {
		return 'menu2' + (this.focus() ? ' focus' : '');
	}
	get tabid() {
		return this.config.tabid;
	}
	get component() {
		return this.config.component;
	}
}

function clicktabfunc(a: number) {
	return function () {
		player.currentPage = a;
	};
}
function focused(a: number) {
	return function () {
		return tabin(a);
	};
}
export function tabin(a: number) {
	return player.currentPage == a;
}
export const tabs = createClassesFromDb(
	[
		{
			id: 'baixie',
			text: '主要',
			subtabs: createClassesFromDb(
				[
					{
						id: 'baixie1',
						text: '主要',
						tabid: 1,
						component: Main,
					},
					{
						id: 'baixie2',
						text: '成就',
						tabid: 2,
					},
				] as const satisfies ISubtabConfig[],
				{},
				SubTab,
			),
		},
		{
			id: 'zaxiang',
			text: '杂项',
			subtabs: createClassesFromDb(
				[
					{
						id: 'saves',
						text: '存档',
						tabid: 3,
						component: Save,
					},
					{
						id: 'about',
						text: '关于',
						tabid: 4,
						component: About,
					},
				] as const satisfies ISubtabConfig[],
				{},
				SubTab,
			),
		},
	] as const satisfies ITabConfig[],
	{},
	Tab,
);

/**
 * Get the tab which tabid is x. return null if cannot find
 */
export function findTab(x: number) {
	for (const tab of tabs) {
		for (const subtab of tab.subtabs) {
			if (subtab.tabid == x) {
				return subtab;
			}
		}
	}
	return null;
}
