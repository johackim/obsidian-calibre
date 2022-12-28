import React from 'react';
import { ItemView } from 'obsidian'; // eslint-disable-line
import { createRoot } from 'react-dom/client';
import { VIEW_TYPE_BOOK } from './constants';
import EpubReader from './reader';

export class BookView extends ItemView {
    constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType() {
        return VIEW_TYPE_BOOK;
    }

    getDisplayText() {
        return this.plugin.activeBook?.title || 'Book';
    }

    async refresh() {
        const { activeBook } = this.plugin;

        if (!activeBook) return;

        if (activeBook.format === 'PDF') {
            const container = this.containerEl.children[1];
            try {
                const iframe = container.createEl('iframe');
                iframe.src = activeBook.url;
                iframe.width = '100%';
                iframe.height = '100%';
            } catch (e) {
                const error = container.createDiv({ text: e.toString() });
                error.style.color = 'var(--text-title-h1)';
            }
        }

        if (activeBook.format === 'EPUB') {
            this.root.render(
                <EpubReader
                    url={activeBook.url}
                    location={activeBook.location}
                    tocChanged={(toc) => {
                        this.plugin.activeBook.toc = toc;
                    }}
                />,
            );
        }
    }

    async onOpen() {
        this.root = createRoot(this.containerEl.children[1]);
        await this.refresh();

        this.registerDomEvent(document, 'click', (evt) => {
            if (evt.target.classList.contains('toc')) {
                this.refresh();
            }
        });
    }
}
