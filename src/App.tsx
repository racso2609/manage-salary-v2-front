import { Navigate, Route, Routes } from "react-router";
import LoginPage from "./pages/login";
import { useAuthContext } from "./context/AuthContext";
import AuthLayout from "./components/Layouts/authLayout";

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
          <Route path="*" element={<Navigate replace to="/dashboard" />} />
        </>
      )}
    </Routes>
  );
}

export default App;
