// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      const snapshot = await getDocs(collection(db, 'books'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(data);
    };

    fetchBooks();
  }, []);

  const openReader = (book) => {
  navigate(`/reader/${book.id}`, { state: { book } });
};

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">📖 Mimi-Novels Library</h1>

      {books.length === 0 ? (
        <p className="text-center text-gray-600">No books available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="border rounded shadow hover:shadow-md transition cursor-pointer bg-white"
              onClick={() => openReader(book)}
            >
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full h-64 object-cover rounded-t"
              />
              <div className="p-3">
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p className="text-sm text-gray-600">By {book.author}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
