// pdf-worker.js
import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import workerSrc from 'pdfjs-dist/build/pdf.worker?worker';

GlobalWorkerOptions.workerSrc = workerSrc;
