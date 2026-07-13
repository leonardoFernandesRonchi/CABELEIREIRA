import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, Register, ServicesPage, Agenda } from "./pages";
import { Main } from "./layouts";
import { ProtectedRoute, LoggedRoute } from "./routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<Main />}>
            <Route path="/" element={<ServicesPage />} />
            <Route path="/agenda" element={<Agenda />} />
          </Route>
        </Route>
        <Route element={<LoggedRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
