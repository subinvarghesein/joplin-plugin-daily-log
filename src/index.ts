import joplin from 'api';
import { getIso8601DateString, getTitleForDate } from "./utils";

joplin.plugins.register({
	onStart: async function() {
		await registerPluginConfiguration();
		await registerPluginCommands();
		await initPluginPersistentData();
	},
});

const registerPluginConfiguration = async () => {
	await joplin.settings.registerSection('dailyLogSettingSection', {
		label: 'Daily Log',
		iconName: 'fa fa-calendar-check-o'
	});
};

const initPluginPersistentData = async () => {
	await joplin.settings.registerSetting('dailyLogData_parentFolderId', {
		type: 2,
		label: `Daily Log Folder Id`,
		public: false,
		value: null
	});
};

const registerPluginCommands = async () => {
	await joplin.commands.register({
		name: 'dailyLogAddForToday',
		label: `Daily Log: Create Today's log`,
		iconName: 'fa fa-calendar-check-o',
		execute: async () => {
			await addNoteForToday();
		}
	})
}

const addNoteForToday = async () => {
	const today = new Date();
	const todaysNote = await getNoteForDate(today);

	if(todaysNote) {
		// TODO: Load Today's note. Also waiting for https://discourse.joplinapp.org/t/navigating-to-different-note-for-use-in-plugins-command/11964
		alert('Note was already created for Today');
		return;
	}

	const note = await addDailyLog(today);
}

const addDailyLog = async (date = new Date) => {
	const title = getTitleForDate(date);
	const body = 
`# Todo
- [ ] Sample Todo

# Log
 - Sample Log`;
	const parentFolderId = await getParentFolderId();

	const newNote = {
		body,
		title,
		parent_id: parentFolderId
	}
	await joplin.data.post(['notes'], null, newNote);
};

export const getNoteForDate = async (date: Date) => {
	const searchResults = await joplin.data.get(['search'], {
		query: getIso8601DateString(date),
		fields: ['id', 'parent_id']
	});
	if(searchResults.items.length > 0) {
		const parentFolderId = await getParentFolderId();
		return searchResults.items.find(note => note.parent_id === parentFolderId);
	}
	return null;
}

const getParentFolderId = async () => {
	let parentFolderId = await joplin.settings.value('dailyLogData_parentFolderId');
	if(!parentFolderId) {
		const folder = await joplin.data.post(['folders'], null, { title: "Daily Log" });
		await joplin.settings.setValue('dailyLogData_parentFolderId', folder.id);
		parentFolderId = folder.id;
	}
	return parentFolderId;
};