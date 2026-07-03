import { useNavigate } from "react-router-dom";
import { clearAdminSession } from "../components/ProtectedRoute";

// Hook کمکی برای logout در هر صفحه ادمین
function useAdminAuth() {
  const navigate = useNavigate();

  const logout = () => {
    clearAdminSession();
    navigate("/admin/login", { replace: true });
  };

  return { logout };
}

export default useAdminAuth;
