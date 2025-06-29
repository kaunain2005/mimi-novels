import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// ✅ Correct worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const Reader = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarks, setBookmarks] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = auth.currentUser?.uid || "guest"; // fallback for safety

  // ✅ Fetch book + progress from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookSnap = await getDoc(doc(db, "books", bookId));
        if (bookSnap.exists()) {
          setBook({ id: bookSnap.id, ...bookSnap.data() });
        }

        const progressSnap = await getDoc(doc(db, "books", bookId, "progress", userId));
        if (progressSnap.exists()) {
          const data = progressSnap.data();
          setCurrentPage(data.lastPage || 1);
          setBookmarks(data.bookmarks || []);
          setHighlights(data.highlights || []);
        }
      } catch (err) {
        console.error("Error loading:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookId]);

  // ✅ Save last page on change
  useEffect(() => {
    if (book) {
      saveProgress();
    }
  }, [currentPage, bookmarks, highlights]);

  const saveProgress = async () => {
    try {
      await setDoc(doc(db, "books", bookId, "progress", userId), {
        lastPage: currentPage,
        bookmarks,
        highlights
      });
    } catch (err) {
      console.error("Error saving progress:", err);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleBookmark = () => {
    if (!bookmarks.includes(currentPage)) {
      setBookmarks([...bookmarks, currentPage]);
    }
  };

  const removeBookmark = (page) => {
    setBookmarks(bookmarks.filter((p) => p !== page));
  };

  const handleHighlight = () => {
    const selection = window.getSelection().toString().trim();
    if (selection) {
      setHighlights([...highlights, { page: currentPage, text: selection }]);
    }
  };

  const removeHighlight = (idx) => {
    const updated = highlights.filter((_, i) => i !== idx);
    setHighlights(updated);
  };

  if (loading) {
    return <div className="text-center p-6">💞 Loading...</div>;
  }

  if (!book?.pdfUrl) {
    return <div className="text-center p-6">🚫 No PDF Found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 md:px-8">
      <h1 className="text-2xl font-bold mb-4">📖 {book.title}</h1>

      <div className="flex justify-between mb-4">
        <div className="space-x-2">
          <button
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            ◀ Prev
          </button>
          <button
            onClick={() => currentPage < numPages && setCurrentPage(currentPage + 1)}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Next ▶
          </button>
        </div>

        <div className="space-x-2">
          <button
            onClick={handleBookmark}
            className="bg-yellow-400 px-4 py-2 rounded"
          >
            📌 Bookmark
          </button>
          <button
            onClick={handleHighlight}
            className="bg-green-400 px-4 py-2 rounded"
          >
            ✏️ Highlight
          </button>
        </div>
      </div>

      <Document
        file={book.pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        className="shadow-lg border"
      >
        <Page
          pageNumber={currentPage}
          renderTextLayer
          renderAnnotationLayer
          className="border mb-4"
        />
      </Document>

      <div className="text-center text-gray-600">
        Page {currentPage} of {numPages}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">🔖 Bookmarks</h3>
        {bookmarks.length === 0 ? (
          <p className="text-gray-500">No bookmarks yet.</p>
        ) : (
          <ul className="list-disc ml-6">
            {bookmarks.map((page, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(page)}
                  className="text-blue-600 underline"
                >
                  Page {page}
                </button>
                <button
                  onClick={() => removeBookmark(page)}
                  className="text-red-500"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}

        <h3 className="text-xl font-bold mt-6 mb-2">🖍️ Highlights</h3>
        {highlights.length === 0 ? (
          <p className="text-gray-500">No highlights yet.</p>
        ) : (
          <ul className="list-disc ml-6">
            {highlights.map((h, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(h.page)}
                  className="text-blue-600 underline"
                >
                  Page {h.page}
                </button>{" "}
                <span className="italic">"{h.text}"</span>
                <button
                  onClick={() => removeHighlight(idx)}
                  className="text-red-500"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Reader;
