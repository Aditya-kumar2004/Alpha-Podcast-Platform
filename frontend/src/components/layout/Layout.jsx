import Navbar from "./Navbar";
import Footer from "./Footer";


const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 pb-24">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;