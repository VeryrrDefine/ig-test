import PowiainaNum from 'powiaina_num.js';
import { EVENT_TYPES } from './enum/event-types';

class EventHub {
	_handlers: Record<string, Set<(...args: unknown[]) => void>>;
	constructor() {
		this._handlers = {};
	}

	on(event: string, fn: (...args: unknown[]) => void) {
		if (this._handlers[event] === undefined) {
			this._handlers[event] = new Set();
		}
		this._handlers[event].add(fn);
	}
	dispatch(event: string, ...args: unknown[]) {
		const handlers = this._handlers[event];
		if (handlers === undefined) return;
		for (const handler of handlers) {
			handler(...args);
		}
	}

	static dispatch(event: string) {
		EventHub.dispatch(event);
	}
}

export const Events = new EventHub();

export function dispatchDiff(value: (diff: PowiainaNum) => unknown) {
	Events.on(EVENT_TYPES.GAME_TICK, function (...args: unknown[]) {
		if (typeof args[0] === 'object' && args[0] instanceof PowiainaNum) {
			return value(args[0]);
		}
	});

	return value;
}
