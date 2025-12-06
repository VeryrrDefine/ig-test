import { createApp } from 'vue';
import App from './App';
import { vHold } from './lib/vHold';

import { loadSaves, saveGame } from './core/save';
import { player, type Player } from './core/player/player';
import PowiainaNum from 'powiaina_num.js';
import { gameLoop } from './core/game-loop';

import './assets/style/main.scss';
import { initMM4Mechanics } from './core/features/mm4';

import './core/secret-formula/upgrades';
import ModalService from './lib/modal/modal';
const app = createApp(App);
app.directive('hold', vHold);
app.mount('#app');

declare global {
	interface Window {
		player?: Player;
		PowiainaNum?: typeof PowiainaNum;
		ModalService?: typeof ModalService;
	}
}
initMM4Mechanics();
setInterval(gameLoop, 50);

loadSaves();
setInterval(saveGame, 1000);

window.PowiainaNum = PowiainaNum;
window.ModalService = ModalService;
window.player = player;
