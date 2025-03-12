import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  return (
    <footer className="bg-black text-lavender-blush border-t border-gray/30">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <h4 className="text-xl font-mono font-bold">ROGUE WOLF</h4>
            <p className="text-lavender-blush/70 text-sm font-mono">
              Premium t-shirts with innovative 3D preview and virtual try-on technology.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:bg-flame/20">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-flame/20">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-flame/20">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-mono font-bold">SHOP</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-lavender-blush/70 hover:text-lavender-blush text-sm font-mono">
                  ALL PRODUCTS
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/new-arrivals"
                  className="text-lavender-blush/70 hover:text-lavender-blush text-sm font-mono"
                >
                  NEW ARRIVALS
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/bestsellers"
                  className="text-lavender-blush/70 hover:text-lavender-blush text-sm font-mono"
                >
                  BESTSELLERS
                </Link>
              </li>
              <li>
                <Link href="/shop/sale" className="text-lavender-blush/70 hover:text-lavender-blush text-sm font-mono">
                  SALE
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-mono font-bold">COMPANY</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-lavender-blush/70 hover:text-lavender-blush text-sm font-mono">
                  ABOUT US
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-lavender-blush/70 hover:text-lavender-blush text-sm font-mono">
                  CONTACT
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-lavender-blush/70 hover:text-lavender-blush text-sm font-mono">
                  CAREERS
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-lavender-blush/70 hover:text-lavender-blush text-sm font-mono">
                  BLOG
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-mono font-bold">NEWSLETTER</h4>
            <p className="text-lavender-blush/70 text-sm font-mono">
              Subscribe to get special offers and early access to new designs.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input type="email" placeholder="YOUR EMAIL" className="bg-gray/20 text-lavender-blush font-mono" />
              <Button className="bg-flame hover:bg-flame/90 text-lavender-blush font-mono">SUBSCRIBE</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray/30 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-lavender-blush/70 text-xs font-mono">
            © {new Date().getFullYear()} ROGUE WOLF. ALL RIGHTS RESERVED.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-lavender-blush/70 hover:text-lavender-blush text-xs font-mono">
              PRIVACY POLICY
            </Link>
            <Link href="/terms" className="text-lavender-blush/70 hover:text-lavender-blush text-xs font-mono">
              TERMS OF SERVICE
            </Link>
            <Link href="/shipping" className="text-lavender-blush/70 hover:text-lavender-blush text-xs font-mono">
              SHIPPING INFO
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

