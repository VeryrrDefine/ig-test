const messages = {
	zh: {
		a: '你有 {xxxx} \\(mm^4\\)',
		b: (obj: { [key: string]: unknown }) => <>a {obj.hyw}</>,
	},
	en: {
		a: 'You have {xxxx} \\(mm^4\\)',
		b: (obj: { [key: string]: unknown }) => <>a {obj.hyw}</>,
	},
} as const;

let currentLocale = 'zh';
export function getMessage(message: string, locale: string = currentLocale) {
	if (locale in messages) {
		const messages2 = messages[locale as keyof typeof messages];
		if (message in messages2) {
			return messages2[message as keyof typeof messages2];
		}
		return message;
	}
	return getMessage(message, 'zh');
}
