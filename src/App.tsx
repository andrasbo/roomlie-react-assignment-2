import { Toaster } from "react-hot-toast";
import "./App.css";
import { Layout } from "./components/Layout";
import { LoginView } from "./components/LoginView";
import { LogoutView } from "./components/LogoutView";
import { NotFound } from "./components/NotFound";
import { TableView } from "./components/TableView";
import { AuthProvider } from "./providers/AuthProvider";
import { TableProvider } from "./providers/TableProvider";
import { BrowserRouter, Routes, Route } from "react-router";
import { RegisterView } from "./components/RegisterView";
import { BookingView } from "./components/BookingView";
import { BookingProvider } from "./providers/BookingProvider";

function App() {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <BrowserRouter>
        <AuthProvider>
          <TableProvider>
            <BookingProvider>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<TableView />} />
                  <Route path="/login" element={<LoginView />} />
                  <Route path="/register" element={<RegisterView />} />
                  <Route path="/logout" element={<LogoutView />} />
                  <Route path="/bookings/my" element={<BookingView />} />
                  <Route path="/bookings" element={<BookingView />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BookingProvider>
          </TableProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
