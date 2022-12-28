import React, { useRef, useEffect, useState } from 'react';
import Epub from 'epubjs/lib/index';

const COLORS = {
    text: '#D1D5DB',
    background: '#111827',
    link: '#00AAAD',
};

const EpubReader = ({ url, location, tocChanged }) => {
    const ref = useRef();
    const [currentBook, setCurrentBook] = useState();

    useEffect(() => {
        if (currentBook) currentBook.destroy();

        const book = new Epub(url);
        setCurrentBook(book);
    }, [location]);

    useEffect(() => {
        if (!currentBook) return () => {};

        const rendition = currentBook.renderTo(ref.current, {
            width: '100%',
            height: '100%',
        });

        const handleKeys = (e) => {
            if ((e.keyCode || e.which) === 37) rendition.prev();
            if ((e.keyCode || e.which) === 39) rendition.next();
        };

        rendition.themes.register('custom', {
            body: { color: `${COLORS.text}!important`, background: COLORS.background },
            p: { color: `${COLORS.text}!important` },
            h1: { color: `${COLORS.text}!important` },
            h2: { color: `${COLORS.text}!important` },
            span: { color: 'inherit!important' },
            'a:link': { color: COLORS.link },
        });

        rendition.themes.select('custom');

        if (location) {
            rendition.display(location).catch(() => {
                rendition.display(location.replace(/^..\//, '')).catch(() => {
                    rendition.display(`text/${location}`);
                });
            });
        } else {
            rendition.display();
        }

        rendition.on('keyup', handleKeys);

        currentBook.loaded.navigation.then(({ toc }) => {
            tocChanged(toc);
        });

        window.addEventListener('keyup', handleKeys);

        return () => window.removeEventListener('keyup', handleKeys);
    }, [currentBook]);

    return (
        <div ref={ref} style={{ position: 'relative', height: '100%' }} />
    );
};

EpubReader.defaultProps = {
    tocChanged: () => {},
};

export default EpubReader;
