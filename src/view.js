import React from 'react';
import { ItemView } from 'obsidian'; // eslint-disable-line
import { createRoot } from 'react-dom/client';
import { VIEW_TYPE_BOOK } from './constants';
import EpubReader from './reader';

export class BookView extends ItemView {
    constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
        this.book = leaf.book || this.plugin.settings.books.find((book) => book.leaf === leaf.id);
    }

    getViewType() {
        return VIEW_TYPE_BOOK;
    }

    getDisplayText() {
        return this.book?.title || 'Book';
    }

    async refresh(refresh = false) {
        if (!this.book) return;

        this.book.leaf = this.leaf.id;
        this.plugin.saveSettings();

        const { title, format, location, url } = this.book;

        if (format === 'PDF') {
            this.root.render(
                <iframe
                    title={title}
                    src={url}
                    width="100%"
                    height="100%"
                />,
            );
        }

        if (format === 'EPUB') {
            this.root.render(
                <EpubReader
                    url={url}
                    refresh={refresh}
                    location={location}
                    locChanged={(currentLocation) => {
                        this.book.location = currentLocation?.start;
                        this.plugin.saveSettings();
                    }}
                />,
            );
        }
    }

    async activeLeafChange() {
        this.refresh(Date.now());
    }

    async onOpen() {
        this.root = createRoot(this.containerEl.children[1]);
        await this.refresh();

        this.registerDomEvent(document, 'click', (evt) => {
            if (evt.target.classList.contains('toc')) {
                this.refresh();
            }
        });

        this.registerEvent(this.app.workspace.on('active-leaf-change', this.activeLeafChange.bind(this)));
    }
}
