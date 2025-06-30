import AdminUpload from '../components/AdminUpload';
import Footer from '../components/Footer';

const Admin = () => {
  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-white to-pink-50 p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-pink-500">
          Mimi-Novels Admin Panel 🌸
        </h1>

          <AdminUpload />

      </div>
    </main>
  );
};

export default Admin;
