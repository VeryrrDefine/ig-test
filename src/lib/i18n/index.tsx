const messages = {
	zh: {
		mm4amount: '你有 {amount} \\(mm^4\\)',
		mm4gain: '你每秒正在获取 {amount} \\(mm^4\\)',
		b: (obj: { [key: string]: unknown }) => <>a {obj.hyw}</>,
	},
	en: {
		mm4amount: 'You have {xxxx} \\(mm^4\\)',
		mm4gain: "You're gaining {xxxx} \\(mm^4\\) per second",
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
