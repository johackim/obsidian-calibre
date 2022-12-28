import fetch from 'isomorphic-fetch';

export const getBooks = async (endpoint = 'http://localhost:8080', libraryName = 'Calibre', limit = 100000) => {
    const data = await fetch(`${endpoint}/interface-data/more-books?library_id=${libraryName}&num=${limit}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ offset: 0, query: '', sort: 'timestamp', sort_order: 'desc', vl: '' }),
    }).then((res) => res.json());

    const books = Object.entries(data.metadata).map(([id, book]) => ({
        id,
        title: book.title,
        formats: book['#formats'].split(', '),
        author: book.authors[0],
    }));

    const allBooks = books.reduce((acc, book) => {
        const { formats, ...rest } = book;

        const bookFormats = formats.map((format) => ({
            ...rest,
            format,
            title: `${rest.title}.${format.toLowerCase()}`,
            url: `${endpoint}/get/${format}/${book.id}/Calibre${format === 'EPUB' ? '.epub' : ''}?content_disposition=inline`,
        }));

        return [...acc, ...bookFormats];
    }, []);

    return allBooks.filter(({ format }) => ['EPUB', 'PDF'].includes(format));
};

export const textSearch = async (text, endpoint = 'http://localhost:8080', libraryName = 'Calibre') => {
    const { results } = await fetch(`${endpoint}/fts/search?library_id=${libraryName}&query="${text}"`)
        .then((res) => res.json());

    return results;
};
