// === Обов'язкове завдання: інтерфейс Author ===

interface Author {
  name: string;
  country: string;
}

// === Інтерфейс Book (author — вкладений об'єкт Author) ===

interface Book {
  readonly id: number;   // readonly (Завдання 3)
  title: string;
  author: Author;
  year: number;
  pages: number;
  genre?: string;        // опціональні поля (Завдання 2)
  rating?: number;
}

// === Завдання 1: змінна типу Book ===

const myBook: Book = {
  id: 1,
  title: '1984',
  author: { name: 'George Orwell', country: 'United Kingdom' },
  year: 1949,
  pages: 328,
  genre: 'dystopia',
  rating: 4.8,
};

console.log(`${myBook.title}" — ${myBook.author.name}`);

// === Завдання 2: опціональні поля ===

const bookFull: Book = {
  id: 2,
  title: 'Dune',
  author: { name: 'Frank Herbert', country: 'United States' },
  year: 1965,
  pages: 412,
  genre: 'science fiction',
  rating: 4.7,
};

const bookMinimal: Book = {
  id: 3,
  title: 'The Old Man and the Sea',
  author: { name: 'Ernest Hemingway', country: 'United States' },
  year: 1952,
  pages: 127,
};

function printBook(book: Book): void {
  console.log(`${book.title}" — ${book.author.name}`);
  if (book.genre) {
    console.log(`  Жанр: ${book.genre}`);
  }
  if (book.rating !== undefined) {
    console.log(`  Рейтинг: ${book.rating}`);
  }
}

printBook(bookFull);
printBook(bookMinimal);

// === Завдання 3: readonly ===

// myBook.id = 99;
// Помилка компілятора:
// Cannot assign to 'id' because it is a read-only property.

// === Завдання 4: масив об'єктів та функція ===

const library: Book[] = [
  { id: 4, title: 'The Hunger Games', author: { name: 'Suzanne Collins', country: 'United States' }, year: 2008, pages: 374 },
  { id: 5, title: 'Atomic Habits', author: { name: 'James Clear', country: 'United States' }, year: 2018, pages: 320, genre: 'self-help' },
  { id: 6, title: 'The Hobbit', author: { name: 'J.R.R. Tolkien', country: 'United Kingdom' }, year: 1937, pages: 310 },
  { id: 7, title: 'The Midnight Library', author: { name: 'Matt Haig', country: 'United Kingdom' }, year: 2020, pages: 288 },
];

function getRecentBooks(books: Book[], afterYear: number): string[] {
  return books.filter((book) => book.year > afterYear).map((book) => book.title);
}

console.log(getRecentBooks(library, 2000));
