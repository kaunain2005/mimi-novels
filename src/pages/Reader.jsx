// src/pages/Reader.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// ✅ PDF.js worker setup for Vite

// ✅ Use this path (it exists in pdfjs-dist 4.x+)
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;


const Reader = () => {
  const { state } = useLocation();
  const book = state?.book;

  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  if (!book) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        🚫 Book not found. Please return to the home page.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6 px-4">
      <h1 className="text-2xl font-bold mb-4 text-center">{book.title}</h1>

      <div className="w-full max-w-4xl flex justify-center">
        <Document file={book.pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
          {numPages && (
            <HTMLFlipBook
              width={400}
              height={600}
              size="stretch"
              minWidth={315}
              maxWidth={1000}
              minHeight={400}
              maxHeight={1536}
              showCover={true}
              mobileScrollSupport={true}
              className="shadow-md rounded overflow-hidden bg-white"
            >
              {Array.from(new Array(numPages), (el, index) => (
                <div key={`page_${index + 1}`} className="page bg-white">
                  <Page
                    pageNumber={index + 1}
                    width={400}
                    renderAnnotationLayer={false}
                    renderTextLayer={true}
                  />
                </div>
              ))}
            </HTMLFlipBook>
          )}
        </Document>
      </div>
    </div>
  );
};

export default Reader;
