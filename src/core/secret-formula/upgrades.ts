import PowiainaNum from 'powiaina_num.js';
import { createClassesFromDb } from '../../lib/createClassFromDb';
import { Upgrade } from '../features/upgrade';

export const UPGRADE = {
	upgs: createClassesFromDb(
		[
			{
				id: 'bxd',
				upgkey: 'B11',
				cost: new PowiainaNum(3),
			},
		] as const,
		{},
		Upgrade,
	),
};
