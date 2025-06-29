// // src/components/PDFFlipReader.jsx
// import { useEffect, useRef, useState } from "react";
// import { PageFlip } from "page-flip";
// import * as pdfjsLib from "pdfjs-dist";
// import "page-flip/dist/page-flip.css";

// // Worker file setup (required for pdfjs to work properly)
// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// const PDFFlipReader = ({ pdfUrl, onClose }) => {
//   const containerRef = useRef(null);
//   const [pageFlip, setPageFlip] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadPDF = async () => {
//       const loadingTask = pdfjsLib.getDocument(pdfUrl);
//       const pdf = await loadingTask.promise;
//       const totalPages = pdf.numPages;
//       const canvases = [];

//       for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
//         const page = await pdf.getPage(pageNum);
//         const viewport = page.getViewport({ scale: 1.5 });

//         const canvas = document.createElement("canvas");
//         canvas.width = viewport.width;
//         canvas.height = viewport.height;
//         const ctx = canvas.getContext("2d");

//         await page.render({ canvasContext: ctx, viewport }).promise;
//         canvases.push(canvas);
//       }

//       const flip = new PageFlip(containerRef.current, {
//         width: 600,
//         height: 800,
//         showCover: true,
//         useMouseEvents: true,
//         maxShadowOpacity: 0.5,
//         mobileScrollSupport: true,
//       });

//       const pageElements = canvases.map((canvas, index) => {
//         const pageDiv = document.createElement("div");
//         pageDiv.className = "page";
//         pageDiv.style.width = "100%";
//         pageDiv.style.height = "100%";
//         pageDiv.appendChild(canvas);
//         return pageDiv;
//       });

//       flip.loadFromHTML(pageElements);
//       setPageFlip(flip);
//       setLoading(false);
//     };

//     loadPDF();

//     return () => {
//       if (pageFlip) pageFlip.destroy();
//     };
//   }, [pdfUrl]);

//   return (
//     <div className="fixed inset-0 bg-black/90 z-50 flex justify-center items-center overflow-auto">
//       <button onClick={onClose} className="absolute top-4 right-4 text-white text-3xl">✕</button>
//       {loading ? (
//         <p className="text-white text-xl">Loading book...</p>
//       ) : (
//         <div ref={containerRef} className="w-[600px] h-[800px]" />
//       )}
//     </div>
//   );
// };

// export default PDFFlipReader;
