import { SuggestModal } from 'obsidian'; // eslint-disable-line

export default class Modal extends SuggestModal {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
    }

    async getSuggestions(query) {
        const { books } = this.plugin.settings;
        return books.filter((book) => book.title.toLowerCase().includes(query.toLowerCase()) || book.author.toLowerCase().includes(query.toLowerCase()));
    }

    renderSuggestion(book, el) {
        el.addClass('mod-complex');
        const content = el.createDiv({ cls: 'suggestion-content' });
        content.createEl('div', { text: book.title, cls: 'suggestion-title' });
        content.createEl('small', { text: book.author });
        const aux = el.createDiv({ cls: 'suggestion-aux' });
        aux.createEl('kbd', { text: book.format });
    }

    onChooseSuggestion(book) {
        this.plugin.notice(`Opening ${book.title}`);
        this.plugin.activateView(book);
    }
}
