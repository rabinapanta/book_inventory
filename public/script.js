document.addEventListener('DOMContentLoaded', () => {

    // Event listener for adding a book
    document.getElementById('addBookForm').addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission
        const title = document.getElementById('Title').value;
        const author = document.getElementById('Author').value;
        const genre = document.getElementById('Genre').value;
        const publicationDate = document.getElementById('PublicationDate').value;
        const isbn = document.getElementById('ISBN').value;

        try {
            const response = await fetch('/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Title: title,
                    Author: author,
                    Genre: genre,
                    PublicationDate: publicationDate,
                    ISBN: isbn
                }),
            });

            console.log('Response Status:', response.status);

            if (response.ok) {
                // Book added successfully
                alert('Book added successfully!');

                // Clear the form fields after successful addition
                document.getElementById('addBookForm').reset();

                // Check if we are on the correct page before loading books
                if (document.getElementById('booksList')) {
                    loadBooks(); // Refresh the book list if the element exists
                }

            } else if (response.status === 409) {
                // Duplicate ISBN error
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            // alert('An unexpected error occurred. Please try again later.');
            console.error('Error:', error);
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const filterButton = document.getElementById('filterButton');

    // Function to load books, with optional query parameters for filtering
    async function loadBooks(queryParams = '') {
        try {
            const response = await fetch(`/api/books?${queryParams}`);
            const books = await response.json();

            const booksBody = document.getElementById('booksBody');
            booksBody.innerHTML = ''; // Clear previous results

            if (books.length === 0) {
                booksBody.innerHTML = '<tr><td colspan="5">No books found.</td></tr>';
                return;
            }

            // Display books (filtered or all) in the table
            books.forEach(book => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${book.Title}</td>
                    <td>${book.Author}</td>
                    <td>${book.Genre}</td>
                    <td>${new Date(book.PublicationDate).toLocaleDateString()}</td>
                    <td>${book.ISBN}</td>
                `;
                booksBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error loading books:', error);
        }
    }

    // Load all books on page load, but only once
    let initialLoadDone = false;

    if (!initialLoadDone) {
        loadBooks(); // Load all books only once when the page is loaded
        initialLoadDone = true;
    }

    // Event listener for filtering books
    if (filterButton) {
        filterButton.addEventListener('click', async () => {
            event.preventDefault();  // Prevent the default form submission (reloading)
            console.log('Filter button clicked');

            const title = document.getElementById('filterTitle').value.trim();
            const author = document.getElementById('filterAuthor').value.trim();
            const genre = document.getElementById('filterGenre').value.trim();
            const publicationDate = document.getElementById('filterDate').value.trim();

            console.log(`Title: ${title}, Author: ${author}, Genre: ${genre}, PublicationDate: ${publicationDate}`);

            const queryParams = new URLSearchParams();
            if (title) queryParams.append('Title', title);
            if (author) queryParams.append('Author', author);
            if (genre) queryParams.append('Genre', genre);
            if (publicationDate) queryParams.append('PublicationDate', publicationDate);

            console.log(`Fetching from: /api/books?${queryParams.toString()}`);

            // Load filtered books, the initial load of all books won't happen again
            loadBooks(queryParams.toString());
        });
    } else {
        console.error('Filter button not found');
    }
});

document.addEventListener('DOMContentLoaded', () => {

    // Function to export books as CSV or JSON
    async function exportBooks(format) {
        try {
            // Fetch all books
            const response = await fetch('/api/books');
            const books = await response.json();

            // Check if books are present
            if (books.length === 0) {
                alert('No books to export.');
                return;
            }

            if (format === 'csv') {
                // Convert books to CSV and trigger download
                exportAsCSV(books);
            } else if (format === 'json') {
                // Export as JSON and trigger download
                exportAsJSON(books);
            }
        } catch (error) {
            console.error('Error exporting books:', error);
        }
    }

    // Function to export books as CSV
    function exportAsCSV(books) {
        const headers = ['Title', 'Author', 'Genre', 'Publication Date', 'ISBN'];
        const rows = books.map(book => [
            book.Title,
            book.Author,
            book.Genre,
            new Date(book.PublicationDate).toLocaleDateString(),
            book.ISBN
        ]);

        // Combine headers and rows
        let csvContent = headers.join(',') + '\n';
        rows.forEach(row => {
            csvContent += row.join(',') + '\n';
        });

        // Create a Blob and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'books.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Function to export books as JSON
    function exportAsJSON(books) {
        const jsonContent = JSON.stringify(books, null, 2);

        // Create a Blob and trigger download
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'books.json');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Make exportBooks globally accessible
    window.exportBooks = exportBooks;
});




