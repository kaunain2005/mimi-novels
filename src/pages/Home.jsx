import { useEffect, useState, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const Home = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const cardsRef = useRef([]);

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

  useEffect(() => {
    if (cardsRef.current.length > 0) {
      gsap.set(cardsRef.current,
        {
          opacity: 0,
          y: 30,
        }
      );
      gsap.to(cardsRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power1.out',
          // stagger: 0.1,
          // delay: 0.2,
        }
      );
    }
  }, [books]);

  const openReader = (book) => {
    navigate(`/reader/${book.id}`, { state: { book } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-pink-600">
        🌸 Mimi-Novels Library
      </h1>

      {books.length === 0 ? (
        <p className="text-center text-gray-500">No books available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book, i) => (
            <div
              key={book.id}
              ref={el => (cardsRef.current[i] = el)}
              className="border-2 border-pink-300 rounded-xl overflow-hidden shadow hover:shadow-lg hover:-translate-y-1 transition cursor-pointer bg-white"
              onClick={() => openReader(book)}
            >
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-pink-700">{book.title}</h3>
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
