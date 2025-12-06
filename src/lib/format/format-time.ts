import PowiainaNum, { type PowiainaNumSource } from 'powiaina_num.js';
import { formatWhole } from '.';

export class formatTime {
	_ms: PowiainaNum;
	constructor(miliseconds: PowiainaNumSource) {
		this._ms = new PowiainaNum(miliseconds);
	}
	static fromYears(years: PowiainaNumSource) {
		return new formatTime(new PowiainaNum(years).mul(31536e6));
	}
	static fromDays(days: PowiainaNumSource) {
		return new formatTime(new PowiainaNum(days).mul(864e5));
	}
	static fromHours(hours: PowiainaNumSource) {
		return new formatTime(new PowiainaNum(hours).mul(36e5));
	}
	static fromMinutes(minutes: PowiainaNumSource) {
		return new formatTime(new PowiainaNum(minutes).mul(6e4));
	}
	static fromSeconds(seconds: PowiainaNumSource) {
		return new formatTime(new PowiainaNum(seconds).mul(1e3));
	}
	static fromMilliseconds(milliseconds: PowiainaNumSource) {
		return new formatTime(milliseconds);
	}
	copyFrom(other: formatTime) {
		this._ms = other._ms;
	}
	get totalYears() {
		return this._ms.div(31536e6);
	}
	get totalDays() {
		return this._ms.div(864e5);
	}
	get totalHours() {
		return this._ms.div(36e5);
	}
	get totalMinutes() {
		return this._ms.div(6e4);
	}
	get totalSeconds() {
		return this._ms.div(1e3);
	}
	get totalMilliseconds() {
		return this._ms;
	}
	get years() {
		return this.totalYears.floor();
	}
	get days() {
		return this.totalDays.sub(this.totalDays.div(365).floor().mul(365)).floor();
	}
	get hours() {
		return this.totalHours.sub(this.totalHours.div(24).floor().mul(24)).floor();
	}
	get minutes() {
		return this.totalMinutes.sub(this.totalMinutes.div(60).floor().mul(60)).floor();
	}
	get seconds() {
		return this.totalSeconds.sub(this.totalSeconds.div(60).floor().mul(60)).floor();
	}
	get milliseconds() {
		return this.totalMilliseconds.sub(this.totalMilliseconds.div(1e3).floor().mul(1e3)).floor();
	}
	toString() {
		if (this.totalMilliseconds.lt(1)) return '0 ms';
		let string = '';
		if (this.years.neq(0)) string = string + (formatWhole(this.years) + ' years ');
		if (this.days.neq(0) && this.years.lt(4e14))
			string = string + (formatWhole(this.days) + ' days ');
		if (this.hours.neq(0) && this.years.lt(4e12))
			string = string + (formatWhole(this.hours) + ' hours ');
		if (this.minutes.neq(0) && this.years.lt(5e10))
			string = string + (formatWhole(this.minutes) + ' minutes ');
		if (this.seconds.neq(0) && this.years.lt(1e9))
			string = string + (formatWhole(this.seconds) + ' seconds ');
		if (this.milliseconds.neq(0) && this.years.lt(4e7))
			string = string + (formatWhole(this.milliseconds) + ' ms ');
		return string;
	}
	toJSON() {
		return this.toString();
	}
}
