export const getTitleForDate = (date: Date) => {
	const iso8601Date = getIso8601DateString(date);
	const weekday = `${new Intl.DateTimeFormat('en-US', { weekday: 'long'}).format(date)}`;
	const title = `${iso8601Date} - ${weekday}`;
	return title;
}

export const getIso8601DateString = (date: Date) => {
	const dateStr = (date.getDate() + '').padStart(2, '0');
	const monthStr = (date.getMonth() + 1 + '').padStart(2, '0');
	return `${date.getFullYear()}-${monthStr}-${dateStr}`;
}