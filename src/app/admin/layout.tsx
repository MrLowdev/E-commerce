import AdminNavbar from "@/components/admin/AdminNavbar";
import { Metadata } from "next";

const metadata: Metadata = {
  title: "E-shop Admin",
  description: "This is admin",
};

interface LayoutAdminProps {
  children: React.ReactNode;
}

const LayoutAdmin: React.FC<LayoutAdminProps> = ({ children }) => {
  return (
    <div>
      <div>
        <AdminNavbar />
      </div>
      {children}
    </div>
  );
};

export default LayoutAdmin;
