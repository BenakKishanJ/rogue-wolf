import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t border-border">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <h4 className="text-2xl font-display font-black">ROGUE WOLF</h4>
            <p className="text-muted-foreground text-sm">
              Revolutionizing fashion with cutting-edge 3D preview and virtual
              try-on technology.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-display font-black">SHOP</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  ALL PRODUCTS
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/new-arrivals"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  NEW ARRIVALS
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/bestsellers"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  BESTSELLERS
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/sale"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  SALE
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-display font-black">COMPANY</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  ABOUT US
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  CONTACT
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  CAREERS
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  BLOG
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-display font-black">NEWSLETTER</h4>
            <p className="text-muted-foreground text-sm">
              Subscribe for exclusive drops and early access to new designs.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="YOUR EMAIL"
                className="bg-background/50"
              />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-display">
                SUBSCRIBE
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} PRISM. ALL RIGHTS RESERVED.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              PRIVACY POLICY
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              TERMS OF SERVICE
            </Link>
            <Link
              href="/shipping"
              className="text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              SHIPPING INFO
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
