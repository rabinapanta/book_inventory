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
// document.addEventListener('DOMContentLoaded', () => {
//     const filterButton = document.getElementById('filterButton'); // Reference the filter button
//     const booksBody = document.getElementById('booksBody'); // Reference the tbody where books will be displayed

//     // Event listener for filtering books
//     if (filterButton) {
//         filterButton.addEventListener('click', async () => {
//             console.log('Filter button clicked');

//             // Get filter values
//             const title = document.getElementById('filterTitle').value.trim();
//             const author = document.getElementById('filterAuthor').value.trim();
//             const genre = document.getElementById('filterGenre').value.trim();
//             const publicationDate = document.getElementById('filterDate').value.trim();

//             const queryParams = new URLSearchParams();
//             if (title) queryParams.append('Title', title);
//             if (author) queryParams.append('Author', author);
//             if (genre) queryParams.append('Genre', genre);
//             if (publicationDate) queryParams.append('PublicationDate', publicationDate);

//             // Log the constructed URL
//             console.log(`Fetching from: /api/books?${queryParams.toString()}`);

//             try {
//                 // Fetch filtered books from the server
//                 const response = await fetch(`/api/books?${queryParams}`);
//                 if (!response.ok) throw new Error('Network response was not ok');

//                 const books = await response.json();
//                 booksBody.innerHTML = ''; // Clear previous results

//                 if (books.length === 0) {
//                     booksBody.innerHTML = '<tr><td colspan="5">No books found matching your criteria.</td></tr>';
//                     return;
//                 }

//                 // Display the filtered books in the table
//                 books.forEach(book => {
//                     const row = document.createElement('tr');
//                     row.innerHTML = `
//                         <td>${book.Title}</td>
//                         <td>${book.Author}</td>
//                         <td>${book.Genre}</td>
//                         <td>${new Date(book.PublicationDate).toLocaleDateString()}</td>
//                         <td>${book.ISBN}</td>`;
//                     booksBody.appendChild(row);
//                 });
//             } catch (error) {
//                 console.error('Error fetching filtered books:', error);
//                 alert('An error occurred while filtering books. Please try again.');
//             }
//         });
//     } else {
//         console.error('Filter button not found');
//     }

//     // Function to load all books on initial page load
//     async function loadBooks() {
//         try {
//             const response = await fetch('/api/books');
//             const books = await response.json();
//             booksBody.innerHTML = ''; // Clear previous content

//             // Display all books in the table
//             books.forEach(book => {
//                 const row = document.createElement('tr');
//                 row.innerHTML = `
//                     <td>${book.Title}</td>
//                     <td>${book.Author}</td>
//                     <td>${book.Genre}</td>
//                     <td>${new Date(book.PublicationDate).toLocaleDateString()}</td>
//                     <td>${book.ISBN}</td>`;
//                 booksBody.appendChild(row);
//             });
//         } catch (error) {
//             console.error('Error loading books:', error);
//         }
//     }

//     // Load books on page load
//     loadBooks();
// });

document.addEventListener('DOMContentLoaded', () => {
    const filterButton = document.getElementById('filterButton');

    // Function to load all books initially
    async function loadBooks(queryParams = '') {
        try {
            const response = await fetch(`/api/books${queryParams ? `?${queryParams}` : ''}`);

            const books = await response.json();

            const booksBody = document.getElementById('booksBody');
            booksBody.innerHTML = ''; // Clear previous results

            if (books.length === 0) {
                booksBody.innerHTML = '<tr><td colspan="5">No books found.</td></tr>';
                return;
            }

            // Display filtered books in the table
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
            // alert('An error occurred while loading books. Please try again.');
        }
    }

    // Load all books on page load
    loadBooks();

    // Event listener for filtering books
    if (filterButton) {
        filterButton.addEventListener('click', async () => {
            console.log('Filter button clicked');

            const title = document.getElementById('filterTitle').value.trim();
            const author = document.getElementById('filterAuthor').value.trim();
            const genre = document.getElementById('filterGenre').value.trim();
            const publicationDate = document.getElementById('filterDate').value.trim();

            const queryParams = new URLSearchParams();
            if (title) queryParams.append('Title', title);
            if (author) queryParams.append('Author', author);
            if (genre) queryParams.append('Genre', genre);
            if (publicationDate) queryParams.append('PublicationDate', publicationDate);

            console.log(`Fetching from: /api/books?${queryParams.toString()}`);

            // Load books with the provided filter
            loadBooks(queryParams.toString());
        });
    } else {
        console.error('Filter button not found');
    }
});




