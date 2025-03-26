import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="animate-fade-in pt-20 bg-background">
      <div className="container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground">About Us</span>
        </div>

        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Our Story
            </h1>
            <p className="text-muted-foreground mb-6">
              ROGUE WOLF was founded in 2020 with a simple mission: to
              revolutionize the way people shop for t-shirts online. We
              recognized the limitations of traditional e-commerce and set out
              to create an immersive shopping experience that bridges the gap
              between digital and physical retail.
            </p>
            <p className="text-muted-foreground">
              Our team of fashion designers, 3D artists, and technology experts
              work together to bring you premium quality t-shirts with
              innovative features like 3D preview and virtual try-on technology.
            </p>
          </div>
          <div className="relative aspect-square rounded-xl overflow-hidden">
            <Image
              src="/placeholder.svg?height=600&width=600"
              alt="About ROGUE WOLF"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <div className="bg-card p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Our Mission
            </h2>
            <p className="text-muted-foreground">
              To provide customers with an unparalleled online shopping
              experience through innovative technology and premium quality
              products. We aim to reduce returns and increase customer
              satisfaction by allowing shoppers to see exactly how our products
              will look before they buy.
            </p>
          </div>
          <div className="bg-card p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Our Vision
            </h2>
            <p className="text-muted-foreground">
              To become the leading online destination for fashion that
              seamlessly integrates cutting-edge technology with exceptional
              product quality. We envision a future where all online shopping
              includes immersive 3D and virtual try-on experiences.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals behind ROGUE WOLF who are dedicated to
              revolutionizing your online shopping experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Raghav A",
                role: "Founder & CEO",
                image: "/placeholder.svg?height=400&width=400",
              },
              {
                name: "Aniverthy Amruthesh",
                role: "Director",
                image: "/placeholder.svg?height=400&width=400",
              },
              {
                name: "Benak Kishan J",
                role: "Designer & Developer",
                image: "/placeholder.svg?height=400&width=400",
              },
              {
                name: "Emma Williams",
                role: "Customer Experience Manager",
                image: "/placeholder.svg?height=400&width=400",
              },
            ].map((member) => (
              <div
                key={member.name}
                className="bg-card rounded-xl overflow-hidden"
              >
                <div className="aspect-square relative">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at ROGUE WOLF.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-xl">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Quality
              </h3>
              <p className="text-muted-foreground">
                We never compromise on the quality of our products or the
                technology that powers our platform.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Innovation
              </h3>
              <p className="text-muted-foreground">
                We constantly push the boundaries of what's possible in
                e-commerce to create better shopping experiences.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Customer Focus
              </h3>
              <p className="text-muted-foreground">
                Everything we do is designed to enhance the customer experience
                and exceed expectations.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/10 rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Join the ROGUE WOLF Revolution
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Experience the future of online t-shirt shopping with our innovative
            3D preview and virtual try-on technology.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Link href="/shop">Shop Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
