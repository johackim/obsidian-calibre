import { Notice, Plugin, addIcon } from 'obsidian'; // eslint-disable-line
import Modal from './modal';
import SettingTab from './settings';
import { BookView } from './view';
import { TocView } from './toc';
import { DEFAULT_SETTINGS, VIEW_TYPE_BOOK, VIEW_TYPE_TOC, ICON_NAME, ICON_SVG } from './constants';

export default class CalibrePlugin extends Plugin {
    async onload() {
        await this.loadSettings();

        addIcon(ICON_NAME, ICON_SVG);

        this.registerView(VIEW_TYPE_BOOK, (leaf) => new BookView(leaf, this));
        this.registerView(VIEW_TYPE_TOC, (leaf) => new TocView(leaf, this));

        this.addCommand({
            id: 'book-modal',
            name: 'Open book',
            callback: () => {
                new Modal(this.app, this).open();
            },
        });

        this.addSettingTab(new SettingTab(this.app, this));

        this.app.workspace.onLayoutReady(() => {
            this.initLeaf();
        });
    }

    initLeaf() {
        if (!this.app.workspace.getLeavesOfType(VIEW_TYPE_TOC).length) {
            this.app.workspace.getRightLeaf(false).setViewState({
                type: VIEW_TYPE_TOC,
                active: true,
            });
        }
    }

    async onunload() {
        this.app.workspace.detachLeavesOfType(VIEW_TYPE_TOC);
    }

    async activateView(book) {
        const leaf = this.app.workspace.getLeaf(true);

        leaf.book = book;

        await leaf.setViewState({
            type: VIEW_TYPE_BOOK,
            active: true,
        });

        this.app.workspace.revealLeaf(leaf);
    }

    async loadSettings() {
        this.settings = { ...DEFAULT_SETTINGS, ...await this.loadData() };
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async notice(message) {
        const notice = new Notice(message);
        setTimeout(() => notice.hide(), 5000);
    }
}
