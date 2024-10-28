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
            alert('An unexpected error occurred. Please try again later.');
            console.error('Error:', error);
        }
    });
});