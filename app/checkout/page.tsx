// app/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CartItem {
  productId: string;
  quantity: number;
  color: string;
  size: string;
  product?: {
    name: string;
    price: number;
    designImage?: string;
    images?: string[][];
  };
}

interface DeliveryDetails {
  name: string;
  address: string;
  pincode: string;
  phone: string;
  alternatePhone: string;
  email: string;
  deliveryNote: string;
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    name: "",
    address: "",
    pincode: "",
    phone: "",
    alternatePhone: "",
    email: "",
    deliveryNote: "",
  });
  const { toast } = useToast();

  // Fetch full user profile from API
  const fetchUserProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const userData = await res.json();
        console.log("Fetched user profile for checkout:", userData); // Debug
        setDeliveryDetails((prev) => ({
          ...prev,
          name: userData.name || "",
          address: userData.address || "",
          pincode: userData.pincode || "",
          phone: userData.phone || "",
          email: userData.email || "",
        }));
      } else {
        console.error("Failed to fetch user profile:", await res.json());
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      fetchCart();
      fetchUserProfile(); // Fetch profile directly from DB
    }
  }, [status, session]);

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      const cart = await res.json();
      if (cart.items) {
        const itemsWithProducts = await Promise.all(
          cart.items.map(async (item: CartItem) => {
            const productRes = await fetch(`/api/products/${item.productId}`);
            const product = await productRes.json();
            return { ...item, product };
          }),
        );
        setCartItems(itemsWithProducts);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast({
        title: "Error",
        description: "Failed to load cart.",
        variant: "destructive",
      });
    }
  };

  const calculateTotal = () =>
    cartItems.reduce(
      (total, item) => total + (item.product?.price || 0) * item.quantity,
      0,
    );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setDeliveryDetails((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { name, address, pincode, phone, email } = deliveryDetails;
    if (!name || !address || !pincode || !phone || !email) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return false;
    }
    if (!/^\d{6}$/.test(pincode)) {
      toast({
        title: "Error",
        description: "Pincode must be 6 digits.",
        variant: "destructive",
      });
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast({
        title: "Error",
        description: "Phone must be 10 digits.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const initiatePayment = async () => {
    if (!session?.user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to proceed with payment.",
        variant: "destructive",
        action: (
          <ToastAction altText="Sign In" asChild>
            <Link href="/auth/signin">Sign In</Link>
          </ToastAction>
        ),
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Add items to your cart first.",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) return;

    try {
      // Save updated address, pincode, phone to user profile if changed
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const savedProfile = await res.json();
        if (
          deliveryDetails.address !== savedProfile.address ||
          deliveryDetails.pincode !== savedProfile.pincode ||
          deliveryDetails.phone !== savedProfile.phone
        ) {
          await fetch("/api/user", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: session.user.id,
              address: deliveryDetails.address,
              pincode: deliveryDetails.pincode,
              phone: deliveryDetails.phone,
            }),
          });
        }
      }

      const totalAmount = calculateTotal();
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          cartItems,
          deliveryDetails,
        }),
      });

      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order.error || "Order creation failed");
      if (!order.id) throw new Error("Order creation failed - no ID returned");

      if (!window.Razorpay)
        throw new Error("Razorpay SDK not loaded. Please try again.");

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: totalAmount * 100,
        currency: "INR",
        name: "Rogue Wolf",
        description: "Order Payment",
        order_id: order.id,
        handler: async (response) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userId: session.user.id,
              amount: totalAmount,
              cartItems,
              deliveryDetails,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast({
              title: "Payment Successful",
              description: "Your order has been placed!",
              action: (
                <ToastAction altText="View Orders" asChild>
                  <Link href="/orders">View Orders</Link>
                </ToastAction>
              ),
            });
            setCartItems([]);
          } else {
            toast({
              title: "Payment Failed",
              description: verifyData.message,
              variant: "destructive",
            });
          }
        },
        prefill: {
          email: deliveryDetails.email,
          contact: deliveryDetails.phone,
        },
        theme: { color: "#F56565" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", (response: any) =>
        toast({
          title: "Payment Failed",
          description: response.error.description,
          variant: "destructive",
        }),
      );
      paymentObject.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to initiate payment.",
        variant: "destructive",
      });
    }
  };

  if (status === "loading")
    return <div className="container py-20 text-center">Loading...</div>;

  if (!session) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <Button asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-20">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      {cartItems.length === 0 ? (
        <p>
          Your cart is empty.{" "}
          <Link href="/shop" className="text-accent">
            Shop Now
          </Link>
        </p>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cart Items */}
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={`${item.productId}-${item.color}-${item.size}`}
                  className="flex items-center gap-4 p-4 bg-secondary/10 rounded-lg"
                >
                  <Image
                    src={
                      item.product?.designImage ||
                      item.product?.images?.[0][0] ||
                      "/placeholder.png"
                    }
                    alt={item.product?.name || "Product"}
                    width={80}
                    height={80}
                    className="object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product?.name}</h3>
                    <p className="text-sm text-foreground/70">
                      Color: {item.color} | Size: {item.size} | Quantity:{" "}
                      {item.quantity}
                    </p>
                    <p className="text-sm font-bold">
                      ₹{(item.product?.price || 0) * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
              <div className="mt-6 p-4 bg-accent/10 rounded-lg flex justify-between items-center">
                <h3 className="text-lg font-semibold">Total</h3>
                <p className="text-xl font-bold text-accent-foreground">
                  ₹{calculateTotal().toFixed(2)}
                </p>
              </div>
            </div>

            {/* Delivery Form */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Delivery Details</h2>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={deliveryDetails.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={deliveryDetails.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={deliveryDetails.pincode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={deliveryDetails.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="alternatePhone">
                    Alternate Phone (Optional)
                  </Label>
                  <Input
                    id="alternatePhone"
                    name="alternatePhone"
                    value={deliveryDetails.alternatePhone}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={deliveryDetails.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryNote">Delivery Note (Optional)</Label>
                  <Textarea
                    id="deliveryNote"
                    name="deliveryNote"
                    value={deliveryDetails.deliveryNote}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <Button
            onClick={initiatePayment}
            className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Pay Now
          </Button>
        </div>
      )}
    </div>
  );
}
