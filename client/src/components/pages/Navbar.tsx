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
import type { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import api from "@/store/features/axios-instance";
import { removeCredentials } from "@/store/features/auth/authSlice";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.authData);
  const handleLogout = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      const res = await api.post("auth/signout");
      if (res.data.success) {
        console.log("Response:", res.data);
        dispatch(removeCredentials());
        navigate("/signin");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b bg-background sticky top-0 z-50">
      {/* LEFT SIDE */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-xl font-semibold">
          TripHaven
        </Link>
        <div className="hidden md:flex space-x-4">
          {user ? (
            <Link
              to="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Listings
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Register
              </Link>
              <Link
                to="/signin"
                className="text-sm font-medium hover:text-primary transition-colors"
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
        {user && (
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
      </div>
    </nav>
  );
};
