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
        el.createEl('div', { text: book.title });
        el.createEl('small', { text: book.author });
    }

    onChooseSuggestion(book) {
        this.plugin.activeBook = book;
        this.plugin.notice(`Opening ${book.title}`);
        this.plugin.activateView();
    }
}
