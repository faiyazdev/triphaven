import Login from "./components/auth/Login";
import { Navbar } from "./components/pages/Navbars/Navbar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SignupForm from "./components/auth/Register";
import { Routes, Route } from "react-router-dom";
import CreateListing from "./components/pages/Listings/CreateListing";
import Listings from "./components/pages/Listings/Listings";
import ListingDetails from "./components/pages/Listings/ListingDetails";
import UpdateListing from "./components/pages/Listings/UpdateListing";
import UserList from "./components/pages/Users/UserList";
import UserProfile from "./components/pages/Users/UserProfile";
import UserListings from "./components/pages/Users/UserListings";
function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="sm:p-6 p-4">
        <Routes>
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Listings />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/my-listings" element={<UserListings />} />
            <Route path="/listings/:id" element={<ListingDetails />} />
            <Route path="/listings/update/:id" element={<UpdateListing />} />
            <Route path="/create-listing" element={<CreateListing />} />
          </Route>
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<SignupForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
