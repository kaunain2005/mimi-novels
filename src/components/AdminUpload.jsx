import { useState } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { FiTrash2 } from 'react-icons/fi';
import * as pdfjsLib from 'pdfjs-dist';
// Icon
import { AiOutlineFilePdf } from 'react-icons/ai';

const AdminUpload = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [desc, setDesc] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [xhr, setXhr] = useState(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Delete Modal handler
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState(null);


  const [books, setBooks] = useState([]);
  const [showBooks, setShowBooks] = useState(false);

  const fetchBooks = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'books'));
      const booksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(booksData);
      setShowBooks(true);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const askDelete = (bookId) => {
    setDeleteBookId(bookId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteBookId) {
      await deleteDoc(doc(db, 'books', deleteBookId));
      setBooks(books.filter(book => book.id !== deleteBookId));
      setShowDeleteModal(false);
      setDeleteBookId(null);
    }
  };


  const uploadToCloudinary = (file, resourceType) => {
    return new Promise((resolve, reject) => {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET);
      data.append('folder', 'mimi-novels');

      const xhr = new XMLHttpRequest();
      setXhr(xhr);

      const url = resourceType === 'raw'
        ? import.meta.env.VITE_CLOUDINARY_URL
        : import.meta.env.VITE_CLOUDINARY_IMAGE_URL;

      xhr.open('POST', url);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error('Upload failed'));
        }
      };

      xhr.onerror = () => reject(new Error('Upload error'));
      xhr.send(data);
    });
  };

  const handleUpload = async (e) => {
  e.preventDefault();
  if (!pdfFile || !coverFile) return alert('Select both files');

  setUploading(true);
  setProgress(0);

  try {
    // ✅ Load PDF to count pages
    const reader = new FileReader();
    reader.readAsArrayBuffer(pdfFile);

    reader.onload = async () => {
      const typedarray = new Uint8Array(reader.result);

      const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
      const numPages = pdf.numPages;
      console.log("PDF Pages:", numPages);

      // ✅ Upload PDF and Cover
      const pdfRes = await uploadToCloudinary(pdfFile, 'raw');
      const imgRes = await uploadToCloudinary(coverFile, 'image');

      // ✅ Save metadata + page count to Firestore
      await addDoc(collection(db, 'books'), {
        title,
        author,
        description: desc,
        pages: numPages, // ✅ ADD PAGE COUNT!
        pdfUrl: pdfRes.secure_url,
        coverUrl: imgRes.secure_url,
        createdAt: serverTimestamp(),
      });

      setShowSuccessModal(true);
      resetForm();
    };
  } catch (err) {
    console.error(err);
    setShowCancelModal(true);
    setUploading(false);
  }
};


  const cancelUpload = () => {
    if (xhr) {
      xhr.abort();
      alert("Upload cancelled");
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setDesc('');
    setPdfFile(null);
    setCoverFile(null);
    setProgress(0);
    setUploading(false);
    setXhr(null);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl text-pink-500 font-bold mb-4">Upload New Book📑</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Title" className="w-full border p-2" />
        <input type="text" value={author} onChange={e => setAuthor(e.target.value)} required placeholder="Author" className="w-full border p-2" />
        <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Description" className="w-full border p-2" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
            <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm text-gray-600">Click to upload PDF</span>
            <input type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files[0])} className="hidden" required />
            {pdfFile && <p className="mt-1 text-xs text-green-600">{pdfFile.name}</p>}
          </label>

          <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
            <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm text-gray-600">Click to upload Cover Image</span>
            <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files[0])} className="hidden" required />
            {coverFile && <p className="mt-1 text-xs text-green-600">{coverFile.name}</p>}
          </label>
        </div>

        {uploading && (
          <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden relative">
            <div className="bg-green-600 h-full transition-all" style={{ width: `${progress}%` }} />
            <span className="absolute inset-0 text-sm text-center">{progress}%</span>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button type="submit" disabled={uploading} className="bg-blue-600 text-white px-4 py-2 rounded">
            {uploading ? "Uploading..." : "Upload Book"}
          </button>
          {uploading && (
            <button type="button" onClick={cancelUpload} className="bg-red-600 text-white px-4 py-2 rounded">
              Cancel
            </button>
          )}
          <button
            type="button"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            onClick={fetchBooks}
          >
            📚 View All Uploaded Books
          </button>
        </div>
      </form>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h3 className="text-xl font-semibold mb-2">✅ Book Uploaded!</h3>
            <p className="mb-4 text-gray-600">Your book has been successfully uploaded to Mimi-Novels.</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={() => setShowSuccessModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h3 className="text-xl font-semibold mb-2">❌ Upload Cancelled</h3>
            <p className="mb-4 text-gray-600">You cancelled the upload process. No files were saved.</p>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              onClick={() => setShowCancelModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showBooks && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">📚 Uploaded Books</h3>
          {books.length === 0 ? (
            <p className="text-gray-500">No books uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {books.map(book => (
                <div key={book.id} className="border p-4 rounded shadow-md bg-white relative">
                  <img src={book.coverUrl} alt={book.title} className="w-full h-60 object-cover rounded mb-3" />
                  <h4 className="font-semibold text-lg border-t-1">{book.title}</h4>
                  <p className="text-sm text-gray-600">By {book.author}</p>
                  <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm flex gap-1 mt-2 underline font-bold">
                    <AiOutlineFilePdf className="text-xl text-red-600" />
                    View PDF
                  </a>
                  <button
                    onClick={() => askDelete(book.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100 text-red-600 hover:text-red-800 transition"
                    title="Delete Book"
                  >
                    <FiTrash2 className="text-2xl" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUpload;
