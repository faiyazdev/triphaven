import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X } from "lucide-react";

interface MobileMenuProps {
  token: string | null;
  handleLogout: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  email: string | undefined;
}

const MobileNav: React.FC<MobileMenuProps> = ({
  token,
  handleLogout,
  email,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // --- Menu Content (The links that show/hide) ---
  const navLinks = token ? (
    <>
      <Link
        to="/"
        onClick={toggleMenu}
        className="block py-2 text-base font-medium hover:text-primary border-b border-border"
      >
        Listings
      </Link>
      {email === "faiyaz@gmail.com" && (
        <Link
          to="/users"
          className="text-sm  hover:text-primary transition-colors"
        >
          Users
        </Link>
      )}
      <Link
        to="/create-listing"
        onClick={toggleMenu}
        className="block py-2 text-base font-medium hover:text-primary border-b border-border"
      >
        Create Listing
      </Link>

      {/* --- REPLACED DropdownMenuItem with standard DIVs/Links --- */}
      <div className="py-2 mt-2">
        <h3 className="font-semibold text-sm mb-1">My Account</h3>
        <Link
          to="/profile"
          onClick={toggleMenu}
          className="block pl-3 py-1 text-sm text-muted-foreground hover:text-primary"
        >
          Profile
        </Link>
        <Link
          to="/my-listings"
          onClick={toggleMenu}
          className="block pl-3 py-1 text-sm text-muted-foreground hover:text-primary"
        >
          My Listings
        </Link>
        <Button
          onClick={(e) => {
            handleLogout(e);
            toggleMenu();
          }} // Call logout and close menu
          variant="ghost"
          className="w-full justify-start text-destructive hover:bg-destructive/10 mt-2"
        >
          Log out
        </Button>
      </div>
    </>
  ) : (
    <>
      <Link
        to="/signup"
        onClick={toggleMenu}
        className="block py-2 text-base font-medium hover:text-primary border-b border-border"
      >
        Register
      </Link>
      <Link
        to="/signin"
        onClick={toggleMenu}
        className="block py-2 text-base font-medium hover:text-primary"
      >
        Login
      </Link>
    </>
  );

  return (
    <div className="md:hidden">
      {/* Toggle Button (Hamburger/X icon) */}
      <button
        onClick={toggleMenu}
        className="p-2 text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Menu Content Container */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="absolute  max-md:h-screen top-[65px] left-0 w-full bg-background p-4 z-40" // z-40 ensures it's below the main navbar (z-50) but above everything else
        >
          {/* Search bar for mobile */}
          <div className="mb-4">
            <Input
              placeholder="Search listings..."
              className="text-sm w-full"
            />
          </div>

          <nav className="flex flex-col space-y-1">{navLinks}</nav>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
