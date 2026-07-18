import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetail from "./pages/BookDetail";

import AdminDashboard from "./pages/AdminDashboard";
import AdminBooks from "./pages/AdminBooks";
import AddBook from "./pages/AddBook";
import AdminLogin from "./pages/AdminLogin";
import EditBook from "./pages/EditBook";
import AdminMessages from "./pages/AdminMessages";
import AdminSubmissions from "./pages/AdminSubmissions";
import AdminSettings from "./pages/AdminSettings";
import AdminUsers from "./pages/AdminUsers";
import AdminReports from "./pages/AdminReports";
import AdminReviews from "./pages/AdminReviews";
import Favorites from "./pages/Favorites";

import About from "./pages/About";
import Contact from "./pages/Contact";
import SubmitBook from "./pages/SubmitBook";
import NotFound from "./pages/NotFound";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Account from "./pages/Account";
import ProtectedUserRoute from "./components/ProtectedUserRoute";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

// ✅ جدا کردن layout عمومی از ادمین
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function ProtectedAdminLayout({ children }) {
  return (
    <ProtectedRoute>
      <AdminLayout>
        {children}
      </AdminLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1E3A34", color: "#fff",
            borderRadius: "12px", padding: "16px",
            direction: "rtl", fontFamily: "Vazirmatn, sans-serif",
          },
          success: { iconTheme: { primary: "#C9A96E", secondary: "#fff" } },
          error: { style: { background: "#dc2626" } },
        }}
      />

      <Routes>
        {/* ─── صفحات عمومی ─── */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/books" element={<PublicLayout><Books /></PublicLayout>} />
        <Route path="/books/:id" element={<PublicLayout><BookDetail /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/submit-book" element={<PublicLayout><SubmitBook /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/account" element={<PublicLayout><ProtectedUserRoute><Account /></ProtectedUserRoute></PublicLayout>} />
        <Route path="/favorites" element={<PublicLayout><ProtectedUserRoute><Favorites /></ProtectedUserRoute></PublicLayout>} />
        <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
        <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />

        {/* ─── صفحه ورود ادمین (بدون sidebar) ─── */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ─── پنل ادمین با AdminLayout ─── */}
        <Route path="/admin" element={<ProtectedAdminLayout><AdminDashboard /></ProtectedAdminLayout>} />
        <Route path="/admin/books" element={<ProtectedAdminLayout><AdminBooks /></ProtectedAdminLayout>} />
        <Route path="/admin/books/add" element={<ProtectedAdminLayout><AddBook /></ProtectedAdminLayout>} />
        <Route path="/admin/books/edit/:id" element={<ProtectedAdminLayout><EditBook /></ProtectedAdminLayout>} />
        <Route path="/admin/messages" element={<ProtectedAdminLayout><AdminMessages /></ProtectedAdminLayout>} />
        <Route path="/admin/reviews" element={<ProtectedAdminLayout><AdminReviews /></ProtectedAdminLayout>} />
        <Route path="/admin/submissions" element={<ProtectedAdminLayout><AdminSubmissions /></ProtectedAdminLayout>} />
        <Route path="/admin/settings" element={<ProtectedAdminLayout><AdminSettings /></ProtectedAdminLayout>} />
        <Route path="/admin/users" element={<ProtectedAdminLayout><AdminUsers /></ProtectedAdminLayout>} />
        <Route path="/admin/reports" element={<ProtectedAdminLayout><AdminReports /></ProtectedAdminLayout>} />

        {/* ─── ✅ صفحه 404 — باید آخرین route باشد ─── */}
        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
