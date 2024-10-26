// Event listener for adding a book
document.getElementById('addBookButton').addEventListener('click', async () => {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const genre = document.getElementById('genre').value;
    const publicationDate = document.getElementById('publicationDate').value;
    const isbn = document.getElementById('isbn').value;

    const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Title: title, Author: author, Genre: genre, PublicationDate: publicationDate, ISBN: isbn }),
    });

    if (response.ok) {
        alert('Book added successfully!'); // Show success alert
        loadBooks(); // Refresh the book list (if necessary)
    } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`); // Show error alert if ISBN already exists
    }
});

// Function to load books (optional if you want to show the list immediately)
async function loadBooks() {
    const response = await fetch('/api/books');
    const books = await response.json();
    const booksListDiv = document.getElementById('booksList');

    // Clear previous book list
    booksListDiv.innerHTML = '';

    // Display books
    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.textContent = `${book.Title} by ${book.Author} (${book.Genre}, ${book.PublicationDate}, ISBN: ${book.ISBN})`;
        booksListDiv.appendChild(bookDiv);
    });
}

// Load books on page load
loadBooks();


// Event listener for filtering books
document.getElementById('filterForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const title = document.getElementById('filterTitle').value; // Assuming you have a separate input for filter
    const author = document.getElementById('filterAuthor').value; // Separate input for author
    const genre = document.getElementById('filterGenre').value; // Separate input for genre
    const publicationDate = document.getElementById('filterPublicationDate').value; // Separate input for publication date

    const queryParams = new URLSearchParams({
        title,
        author,
        genre,
        publicationDate
    });

    const response = await fetch(`/api/books?${queryParams}`);
    const books = await response.json();

    // Clear previous book list
    const booksListDiv = document.getElementById('booksList');
    booksListDiv.innerHTML = '';

    if (books.length === 0) {
        alert('Sorry, we do not have that book.'); // Alert if no books found
        return;
    }

    // Display the filtered books
    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.textContent = `${book.Title} by ${book.Author} (${book.Genre}, ${book.PublicationDate}, ISBN: ${book.ISBN})`;
        booksListDiv.appendChild(bookDiv);
    });
});


