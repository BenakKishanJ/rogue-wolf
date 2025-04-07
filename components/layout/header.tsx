// components/layout/header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, Search, ShoppingBag, User, BookCheck, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Image from "next/image";
import { Input } from "@/components/ui/input";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "SHOP", href: "/shop" },
    { name: "ABOUT", href: "/about" },
    { name: "CONTACT", href: "/contact" },
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled ? "bg-background shadow-md py-3" : "bg-transparent py-5",
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Search overlay for mobile */}
        {isSearchOpen && (
          <div className="fixed inset-0 bg-background z-50 flex items-center p-4 md:hidden">
            <form onSubmit={handleSearch} className="flex w-full gap-2">
              <Input
                autoFocus
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="outline">
                <Search className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </form>
          </div>
        )}

        <Link
          href="/"
          className="flex items-center text-2xl font-mono font-bold tracking-tight text-black"
        >
          <Image
            src="/logo.png"
            alt="Rogue Wolf Logo"
            width={40}
            height={40}
            className=" mr-2"
          />
          <div className="text-2xl sm:text-3xl font-display font-black tracking-tight text-foreground">
            <span className="block md:hidden">RW</span>
            <span className="hidden md:block">ROGUE WOLF</span>
          </div>
        </Link>

        {/* Desktop Search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-4"
        >
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" variant="outline">
            <Search className="h-5 w-5" />
          </Button>
        </form>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-foreground/80 hover:text-foreground relative group text-base font-mono font-bold"
            >
              {link.name}
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-flame transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {status === "loading" ? (
            <Button variant="ghost" size="icon" disabled>
              <User className="h-5 w-5" />
              <span className="sr-only">Loading</span>
            </Button>
          ) : session ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hidden md:flex"
              >
                <Link href="/account">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Link>
              </Button>
              {status === "authenticated" && (
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="hidden md:flex"
                >
                  <Link href="/orders">
                    <BookCheck className="h-5 w-5" />
                    <span className="sr-only">Orders</span>
                  </Link>
                </Button>
              )}

              {status === "authenticated" && (
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="hidden md:flex"
                >
                  <Link href="/cart">
                    <ShoppingBag className="h-5 w-5" />
                    <span className="sr-only">Cart</span>
                  </Link>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hidden md:flex"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="hidden md:flex"
            >
              Sign In
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" title="Menu" visuallyHiddenTitle={true}>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <Link
                    href="/"
                    className="text-2xl font-mono font-bold tracking-tight"
                    onClick={closeMobileMenu}
                  >
                    ROGUE WOLF
                  </Link>
                </div>

                <nav className="flex flex-col space-y-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-foreground text-lg font-mono font-bold hover:text-foreground/80"
                      onClick={closeMobileMenu}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto pt-8 flex flex-col space-y-4">
                  {session ? (
                    <>
                      <Button
                        variant="outline"
                        className="w-full justify-start font-mono text-lg"
                        asChild
                        onClick={closeMobileMenu}
                      >
                        <Link href="/account">
                          <User className="h-5 w-5 mr-2" />
                          ACCOUNT
                        </Link>
                      </Button>

                      {status === "authenticated" && (
                        <Button
                          variant="outline"
                          className="w-full justify-start font-mono text-lg"
                          asChild
                          onClick={closeMobileMenu}
                        >
                          <Link href="/cart">
                            <ShoppingBag className="h-5 w-5 mr-2" />
                            CART
                          </Link>
                        </Button>
                      )}
                      {status === "authenticated" && (
                        <Button
                          variant="outline"
                          className="w-full justify-start font-mono text-lg"
                          asChild
                          onClick={closeMobileMenu}
                        >
                          <Link href="/orders">
                            <BookCheck className="h-5 w-5 mr-2" />
                            ORDERS
                          </Link>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="w-full justify-start font-mono text-lg"
                        onClick={() => {
                          signOut({ callbackUrl: "/" });
                          closeMobileMenu();
                        }}
                      >
                        SIGN OUT
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full justify-start font-mono text-lg"
                      onClick={() => {
                        signIn("google", { callbackUrl: "/" });
                        closeMobileMenu();
                      }}
                    >
                      SIGN IN
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
