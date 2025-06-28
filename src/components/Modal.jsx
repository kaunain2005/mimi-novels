import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function Modal({ show, onClose, title, message, success = true }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (show) {
      gsap.fromTo(
        modalRef.current,
        { y: "-50%", scale: 0, opacity: 0 },
        { y: "0%", scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className={`bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full text-center border-4 ${
          success ? "border-green-400" : "border-red-400"
        }`}
      >
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="mb-4 text-lg text-gray-600">{message}</p>
        <button
          onClick={onClose}
          className={`px-4 py-2 rounded ${
            success
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          } text-white`}
        >
          Close
        </button>
      </div>
    </div>
  );
}
