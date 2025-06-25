import AdminUpload from '../components/AdminUpload';

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Mimi-Novels Admin Panel</h1>
      <AdminUpload />
    </div>
  );
};

export default Admin;
