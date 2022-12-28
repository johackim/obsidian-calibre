import { PluginSettingTab, Setting } from 'obsidian'; // eslint-disable-line
import { getBooks } from './utils';

export default class SettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Calibre settings' });

        new Setting(containerEl)
            .setName('Calibre endpoint')
            .setDesc('Enter your calibre endpoint')
            .addText((text) => text
                .setPlaceholder('http://localhost:8080')
                .setValue(this.plugin.settings.calibre.endpoint)
                .onChange(async (value) => {
                    this.plugin.settings.calibre.endpoint = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Refresh books')
            .setDesc('Refresh books list')
            .addButton((button) => {
                button.setButtonText('Refresh').onClick(async () => {
                    this.plugin.notice('Refreshing books list...');
                    const books = await getBooks(this.plugin.settings.calibre.endpoint);
                    this.plugin.settings.books = books;
                    await this.plugin.saveSettings();
                    this.plugin.notice('Books list refreshed');
                });
            });
    }
}
