import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import gsap from "gsap";

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import Footer from "../components/Footer";

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
  const [pageWidth, setPageWidth] = useState(600);
  const containerRef = useRef(null);
  const pageContainerRef = useRef(null);
  const userId = auth.currentUser?.uid || "guest";

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
  // For sizing
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setPageWidth(containerRef.current.clientWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (book) saveProgress();
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

  const flipPage = (direction) => {
    // Animate out current page
    const tl = gsap.timeline();
    tl.to(pageContainerRef.current, {
      x: direction === 'next' ? -100 : 100,
      opacity: 0,
      duration: 0.3,
      ease: 'power1.in'
    }).add(() => {
      setCurrentPage((prev) => {
        if (direction === 'next' && prev < numPages) return prev + 1;
        if (direction === 'prev' && prev > 1) return prev - 1;
        return prev;
      });
    }).to(pageContainerRef.current, {
      x: 0,
      opacity: 1,
      duration: 0.3,
      ease: 'power1.out'
    });
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

  // Button click animation
  const animateClick = (id) => {
    gsap.fromTo(
      `#${id}`,
      { scale: 1 },
      { scale: 0.9, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.inOut" }
    );
  };

  return (
    <div ref={containerRef} className="max-w-4xl w-full mx-auto py-16 px-4 md:px-8">
      <h1 className="text-2xl font-bold mb-4">📖 {book.title}</h1>

      <div ref={pageContainerRef}>
        <Document
          file={book.pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className="shadow-lg border md:mx-25"
        >
          <Page
            pageNumber={currentPage}
            width={pageWidth}
            renderTextLayer
            renderAnnotationLayer
            className="border mb-4"
          />
        </Document>
      </div>

      <div className="text-center text-gray-600">
        Page {currentPage} of {numPages}
      </div>

      <div className="flex flex-wrap justify-between mb-4 gap-2">
        <div className="space-x-2 space-y-3">
          <button
            onClick={() => flipPage('prev')}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            ◀ Prev
          </button>
          <button
            onClick={() => flipPage('next')}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Next ▶
          </button>
        </div>

        <div className="space-x-2 space-y-2">
          <button
            id="bookmarkButton"
            onClick={() => {
              animateClick("bookmarkButton");
              handleBookmark();
            }}
            className="bg-yellow-400 px-4 py-2 rounded"
          >
            📌 Bookmark
          </button>
          <button
            id="highlightButton"
            onClick={() => {
              animateClick("highlightButton");
              handleHighlight();
            }}
            className="bg-green-400 px-4 py-2 rounded"
          >
            ✏️ Highlight
          </button>
        </div>
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
                  className="text-pink-600 underline cursor-pointer font-bold"
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
