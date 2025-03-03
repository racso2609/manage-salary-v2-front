import { Navigate, Route, Routes } from "react-router";
import LoginPage from "./pages/login";
import { useAuthContext } from "./context/AuthContext";
import AuthLayout from "./components/Layouts/authLayout";
import MainLayout from "./components/Layouts/main";
import DashboardPage from "./pages/dashboard";
import InOutPage from "./pages/in-out";
import TagsPage from "./pages/tags";

function App() {
  const { isLogged } = useAuthContext();
  return (
    <Routes>
      {!isLogged && (
        <>
          <Route path="login" element={<AuthLayout />}>
            <Route index element={<LoginPage />} />
          </Route>
          <Route path="*" element={<Navigate replace to="/login" />} />
        </>
      )}

      {isLogged && (
        <>
          <Route element={<MainLayout />}>
            <Route index path="/dashboard" element={<DashboardPage />} />
            <Route path="/in-out" element={<InOutPage />} />
            <Route path="/tags" element={<TagsPage />} />
            <Route path="*" element={<Navigate replace to="/dashboard" />} />
          </Route>
        </>
      )}

      <Route
        path="*"
        element={<Navigate to={isLogged ? "/dashboard" : "login"} />}
      />
    </Routes>
  );
}

export default App;
