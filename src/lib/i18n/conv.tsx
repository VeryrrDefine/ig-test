import { getMessage } from '.';
import convertTextToComponent from '../../ui/text-to-component-convert.tsx';

export function convertMessageToTSX(
	messageid: string,
	content: {
		[key: string]: unknown;
	},
) {
	const message = getMessage(messageid);
	let res = '';
	let bracelayers = 0;
	let inbrace = '';
	const lists = [] as Array<unknown>;
	let keyIndex = 0;

	if (typeof message == 'function') {
		return message(content);
	}
	for (let i = 0; i < message.length; i++) {
		if (bracelayers >= 1 && message[i] != '}') {
			inbrace += message[i];
		}
		if (message[i] == '{') {
			bracelayers++;
		}
		if (bracelayers == 0) {
			res += message[i];
		}
		if (message[i] == '}') {
			bracelayers--;
			res += '\\?' + keyIndex;
			lists[keyIndex] = content[inbrace] as unknown;
			keyIndex++;
			inbrace = '';
		}
	}

	return convertTextToComponent(res, lists);
}
