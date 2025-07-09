export class Book {
    isbn: string;
    title: string;
    totalCopies: number;
    constructor(isbn: string, title: string, totalCopies: number) {
        this.isbn = isbn;
        this.title = title;
        this.totalCopies = totalCopies;
    }
}
