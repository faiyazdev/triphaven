import Login from "./components/auth/Login";
import { Navbar } from "./components/pages/Navbar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SignupForm from "./components/auth/Register";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="sm:p-6 p-4">
        <Routes>
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>home</div>} />
          </Route>
          {/* <Route path="/listings" element={<Listings />} /> */}
          {/* <Route path="/about" element={<About />} /> */}
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<SignupForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
