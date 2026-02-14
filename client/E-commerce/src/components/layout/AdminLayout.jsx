import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import AdminNavbar from "./AdminNavbar";
import AdminFooter from "./AdminFooter";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-theme-secondary flex flex-col">
      <AdminNavbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>

      <AdminFooter />
    </div>
  );
};

export default AdminLayout;