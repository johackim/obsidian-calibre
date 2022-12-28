import { ItemView } from 'obsidian'; // eslint-disable-line

import { ICON_NAME, VIEW_TYPE_TOC } from './constants';

export class TocView extends ItemView {
    constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType() {
        return VIEW_TYPE_TOC;
    }

    getDisplayText() {
        return 'Table of Contents';
    }

    getIcon() {
        return ICON_NAME;
    }

    async refresh() {
        const toc = this.plugin?.activeBook?.toc || false;
        const title = this.plugin?.activeBook?.title || false;

        const container = this.containerEl.children[1];
        container.empty();

        if (!toc) {
            container.createEl('div', { cls: 'pane-empty', text: 'No toc found.' });
            return;
        }

        container.createEl('p', { text: title, attr: { style: 'margin-top: 0px;' } });
        container.createEl('div', { cls: 'nav-folder mod-root' });
        container.createEl('div', { cls: 'nav-folder-children' });

        for (const location of toc) {
            const navFile = container.createEl('div', { cls: 'toc nav-file' });
            const navFileTitle = navFile.createEl('div', { cls: 'toc nav-file-title' });

            navFileTitle.createEl('div', {
                text: location.label,
                cls: 'toc nav-file-title-content',
            });

            navFile.addEventListener('click', async () => {
                this.plugin.activeBook.location = location.href;
            });
        }
    }

    async activeLeafChange() {
        setTimeout(() => {
            this.refresh();
        }, 1000);
    }

    async onOpen() {
        await this.refresh();
        this.registerEvent(this.app.workspace.on('active-leaf-change', this.activeLeafChange.bind(this)));
    }
}
