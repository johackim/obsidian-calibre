import { getBooks, textSearch } from '../src/utils';

test('getBooks', async () => {
    const books = await getBooks('http://localhost:8080', 'Calibre');
    expect(books.length).toBeGreaterThan(5);
    expect(books[0]).toHaveProperty('url');
});

test('textSearch', async () => {
    const books = await textSearch();
    expect(books.length).toBeGreaterThan(5);
});
