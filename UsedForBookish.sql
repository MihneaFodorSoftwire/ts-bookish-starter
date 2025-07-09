CREATE TABLE book (
    id INT IDENTITY(1,1) PRIMARY KEY,
    isbn VARCHAR(20) NOT NULL,
    title VARCHAR(100) NOT NULL,
    total_copies INT NOT NULL DEFAULT 1
);

CREATE TABLE author (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE book_author (
    book_id INT FOREIGN KEY REFERENCES book(id),
    author_id INT FOREIGN KEY REFERENCES author(id),
    PRIMARY KEY (book_id, author_id)
);

CREATE TABLE [user_name] (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE borrowed_books (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_name_id INT FOREIGN KEY REFERENCES [user_name](id),
    book_id INT FOREIGN KEY REFERENCES book(id),
    borrow_date DATE NOT NULL,
    due_date DATE NOT NULL
);
