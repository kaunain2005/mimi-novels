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
      const data = snapshot.docs.map((doc) => ({
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 py-16 px-4 md:px-8">
      {/* BG */}
      {/* <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/originals/f1/9b/67/f19b670872156c86e6c3fcad70ae14b4.gif')",
        }}
      ></div> */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-pink-600">
        📚 Mimi-Novels Library
      </h1>

      {books.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No books available right now. 📚✨</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {books.map((book) => (
            <div
              key={book.id}
              onClick={() => openReader(book)}
              className="bg-white/90 backdrop-blur-sm border-2 border-pink-300 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition cursor-pointer overflow-hidden"
            >
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full h-64 object-cover rounded-t-xl"
              />
              <div className="p-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-500">By {book.author}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
