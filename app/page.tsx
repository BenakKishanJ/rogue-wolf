// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  CuboidIcon as Cube,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/shop/product-card";
import { IProduct } from "@/lib/models/products";
import { motion } from "framer-motion";
import { PageLoader } from "@/components/ui/page-loader";

async function fetchProducts(): Promise<IProduct[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

// Define animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  if (loading) {
    return <PageLoader isLoading={true} minDuration={2000} />;
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/10 dark:from-background dark:via-background dark:to-primary/10 z-0"></div>

        <div className="container relative z-10 px-4 md:px-6 py-20 md:py-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={itemVariants} className="animate-slide-left">
              <h1 className="hero-text mb-6">
                ROGUE <span className="hero-gradient-text">WOLF</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-md">
                Experience t-shirts like never before with revolutionary 3D
                preview and virtual try-on technology.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 font-display text-lg"
                >
                  <Link href="/shop">SHOP COLLECTION</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 py-6 font-display text-lg"
                >
                  <Link href="#experience">EXPLORE FEATURES</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative animate-slide-right"
            >
              <div className="relative aspect-square rounded-full bg-gradient-to-br from-primary/20 to-accent/20 p-8 animate-float">
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <Image
                    src="/TShirt.png?height=600&width=600"
                    alt="T-shirt showcase"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -top-4 -right-4 bg-primary text-white rounded-full px-6 py-2 font-display animate-pulse">
                  NEW DROP
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Products */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-20 bg-background"
      >
        <div className="container px-4 md:px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                FEATURED COLLECTION
              </h2>
              <p className="text-foreground/70 font-mono">
                Discover our most popular designs
              </p>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button
                asChild
                variant="link"
                className="text-accent mt-4 md:mt-0 font-mono"
              >
                <Link href="/shop" className="flex items-center">
                  VIEW ALL <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
          >
            {products.map((product) => (
              <motion.div key={product._id.toString()} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* 3D Experience Banner */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-20 bg-background"
      >
        <div className="container px-4 md:px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid md:grid-cols-2 gap-10 items-center"
          >
            <motion.div variants={itemVariants} className="order-2 md:order-1">
              <div className="inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm text-primary mb-4 font-mono">
                INNOVATIVE TECHNOLOGY
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                EXPERIENCE T-SHIRTS IN 3D
              </h2>
              <p className="text-muted-foreground mb-6 font-mono">
                Our innovative 3D viewer lets you see every detail of our
                t-shirts before you buy. Rotate, zoom, and examine the fabric
                and fit from every angle.
              </p>
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white font-mono"
              >
                <Link href="/3d-view/1" className="flex items-center">
                  <Cube className="mr-2 h-5 w-5" />
                  TRY 3D VIEWER
                </Link>
              </Button>
            </motion.div>
            <motion.div variants={itemVariants} className="order-1 md:order-2">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 p-8 flex items-center justify-center">
                <div className="text-6xl font-bold text-foreground">3D</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Virtual Try-On */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-20 bg-background"
      >
        <div className="container px-4 md:px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid md:grid-cols-2 gap-10 items-center"
          >
            <motion.div variants={itemVariants}>
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 p-8 flex items-center justify-center">
                <div className="text-6xl font-bold text-foreground">TRY ON</div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm text-primary mb-4 font-mono">
                VIRTUAL EXPERIENCE
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                VIRTUAL TRY-ON TECHNOLOGY
              </h2>
              <p className="text-muted-foreground mb-6 font-mono">
                See how our t-shirts look on you before making a purchase. Our
                virtual try-on technology uses your camera to show you a
                realistic preview.
              </p>
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white font-mono"
              >
                <Link href="/try-on/1" className="flex items-center">
                  <Sparkles className="mr-2 h-5 w-5" />
                  TRY IT ON
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-20 md:py-32"
      >
        <div className="container px-4 md:px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-6xl font-display font-black mb-6"
            >
              WHY CHOOSE Rogue Wolf
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              We combine premium quality with innovative technology for the
              ultimate shopping experience
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <motion.div
              variants={itemVariants}
              className="bg-card p-8 rounded-2xl shadow-sm"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-black mb-4">
                PREMIUM QUALITY
              </h3>
              <p className="text-muted-foreground">
                Our t-shirts are crafted from high-quality materials for
                exceptional comfort and durability.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-card p-8 rounded-2xl shadow-sm"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Cube className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-black mb-4">
                3D PREVIEW
              </h3>
              <p className="text-muted-foreground">
                Examine every detail with our interactive 3D viewer before
                making a purchase.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-card p-8 rounded-2xl shadow-sm"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-black mb-4">
                VIRTUAL TRY-ON
              </h3>
              <p className="text-muted-foreground">
                See how our t-shirts look on you with our innovative virtual
                try-on technology.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-card p-8 rounded-2xl shadow-sm"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-black mb-4">
                FAST SHIPPING
              </h3>
              <p className="text-muted-foreground">
                We offer fast and reliable shipping to get your new t-shirts to
                you quickly.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-card p-8 rounded-2xl shadow-sm"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-display font-black mb-4">
                EASY RETURNS
              </h3>
              <p className="text-muted-foreground">
                Not satisfied? We offer hassle-free returns within 30 days of
                purchase.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-card p-8 rounded-2xl shadow-sm"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-display font-black mb-4">
                AFFORDABLE PRICING
              </h3>
              <p className="text-muted-foreground">
                Premium quality at competitive prices, with no compromise on
                materials or craftsmanship.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Newsletter */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-20 md:py-32 bg-primary text-white"
      >
        <div className="container px-4 md:px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-6xl font-display font-black mb-6"
            >
              JOIN THE REVOLUTION
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-white/80 mb-8"
            >
              Subscribe to get exclusive drops, special offers, and early access
              to new designs.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="YOUR EMAIL"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Button className="bg-white text-primary hover:bg-white/90 font-display">
                SUBSCRIBE
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-20 md:py-32 bg-card"
      >
        <div className="container px-4 md:px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center"
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-6xl font-display font-black mb-6"
            >
              READY TO EXPERIENCE THE FUTURE?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Explore our collection of premium t-shirts with innovative 3D
              preview and virtual try-on technology.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-white font-display text-lg"
              >
                <Link href="/shop">
                  SHOP NOW <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
