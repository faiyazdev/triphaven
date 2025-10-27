import React from "react";
import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../ui/button";
import { removeCredentials } from "@/redux/api/features/auth/authSlice";
import { persistor, type RootState } from "@/redux/store";
import { useLogoutMutation } from "@/redux/api/services/authApi";
import MobileNav from "./MobileNav";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const user = useSelector((state: RootState) => state.auth.user);
  const handleLogout = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      const res = await logout().unwrap();
      if (res.success) {
        console.log("Response:", res.message);
        dispatch(removeCredentials());
        navigate("/signin");
        persistor.purge(); // clear persisted auth state
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  return (
    <nav className="flex text-custom font-['Geist'] items-center justify-between px-6 py-3 border-b bg-background sticky top-0 z-50">
      {/* LEFT SIDE */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-xl font-semibold">
          TripHaven
        </Link>
        <div className="ml-14 hidden md:flex font-semibold capitalize space-x-4">
          {token ? (
            <>
              <Link
                to="/"
                className="text-sm  hover:text-primary transition-colors"
              >
                Listings
              </Link>
              <Link
                to="/create-listing"
                className="text-sm  hover:text-primary transition-colors"
              >
                create-Listing
              </Link>
              {user?.email === "faiyaz@gmail.com" && (
                <Link
                  to="/users"
                  className="text-sm  hover:text-primary transition-colors"
                >
                  Users
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="text-sm  hover:text-primary transition-colors"
              >
                Register
              </Link>
              <Link
                to="/signin"
                className="text-sm  hover:text-primary transition-colors"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center space-x-4">
        {/* Search bar */}
        <div className="hidden md:block w-56">
          <Input placeholder="Search listings..." className="text-sm" />
        </div>

        {/* Dark mode toggle */}
        <ModeToggle />

        {/* Profile dropdown */}
        {token && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer hover:opacity-80 transition">
                <AvatarImage src="/avatars/default.png" alt="Profile" />
                <AvatarFallback>F</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <a href="/profile">Profile</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/my-listings">My Listings</a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button onClick={handleLogout}>Log out</Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {/* MOBILE MENU TOGGLE (Only visible on small screens) */}
        <MobileNav
          token={token}
          handleLogout={handleLogout}
          email={user?.email}
        />
      </div>
    </nav>
  );
};
