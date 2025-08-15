// src/components/News.jsx
export default function News() {
  return (
    <div className="flex justify-between items-center bg-gray-900 text-sm text-white px-4 py-2">
      <div>
        Exclusive Black Friday! Offer{" "}
        <span className="bg-yellow-500 text-black font-bold px-2 py-1 mx-2">
          10
        </span>{" "}
        Days
      </div>
      <div className="flex items-center gap-3">
        <span>Follow us on:</span>
        <i className="fab fa-facebook cursor-pointer"></i>
        <i className="fab fa-twitter cursor-pointer"></i>
        <i className="fab fa-pinterest cursor-pointer"></i>
        <i className="fab fa-linkedin cursor-pointer"></i>
      </div>
    </div>
  );
}
