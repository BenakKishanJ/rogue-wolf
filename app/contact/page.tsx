"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubjectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send this data to your backend
    console.log("Form submitted:", formData)
    alert("Thank you for your message! We'll get back to you soon.")
    setFormData({
      name: "",
      email: "",
      subject: "general",
      message: "",
    })
  }

  return (
    <div className="animate-fade-in pt-20">
      <div className="container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-primary-foreground/60 mb-8">
          <Link href="/" className="hover:text-primary-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-primary-foreground">Contact</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Information */}
          <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Get In Touch</h1>
            <p className="text-primary-foreground/70 mb-8">
              We'd love to hear from you! Whether you have a question about our products, need help with an order, or
              want to collaborate, our team is ready to assist you.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Our Location</h3>
                  <p className="text-primary-foreground/70">123 Fashion Street, Design District, New York, NY 10001</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Email Us</h3>
                  <p className="text-primary-foreground/70">
                    <a href="mailto:info@rougewolftshirts.com" className="hover:text-accent">
                      info@rougewolftshirts.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Call Us</h3>
                  <p className="text-primary-foreground/70">
                    <a href="tel:+1234567890" className="hover:text-accent">
                      +1 (234) 567-890
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-secondary p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-3">Business Hours</h3>
              <ul className="space-y-2 text-primary-foreground/70">
                <li className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday:</span>
                  <span>10:00 AM - 4:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday:</span>
                  <span>Closed</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-secondary p-6 md:p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="bg-primary border-neutral-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Your Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  className="bg-primary border-neutral-800"
                />
              </div>

              <div className="space-y-2">
                <Label>Subject</Label>
                <RadioGroup value={formData.subject} onValueChange={handleSubjectChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="general" id="general" />
                    <Label htmlFor="general">General Inquiry</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="support" id="support" />
                    <Label htmlFor="support">Customer Support</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="business" id="business" />
                    <Label htmlFor="business">Business Opportunity</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Your Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  required
                  className="min-h-[150px] bg-primary border-neutral-800"
                />
              </div>

              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Send Message
              </Button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Find Us</h2>
          <div className="aspect-video w-full bg-secondary rounded-xl flex items-center justify-center">
            <p className="text-primary-foreground/70">
              Map would be embedded here. In a real application, this would be a Google Maps or similar integration.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto">
              Find quick answers to common questions about our products and services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                question: "How does the 3D preview feature work?",
                answer:
                  "Our 3D preview technology allows you to see a detailed, interactive 3D model of each t-shirt. You can rotate, zoom, and examine the fabric and fit from every angle before making a purchase.",
              },
              {
                question: "Is the virtual try-on feature secure?",
                answer:
                  "Yes, our virtual try-on feature processes all data locally on your device. Your camera feed is never stored or sent to our servers, ensuring complete privacy and security.",
              },
              {
                question: "What is your return policy?",
                answer:
                  "We offer a 30-day return policy for all unworn items in original condition with tags attached. Simply contact our customer service team to initiate a return.",
              },
              {
                question: "How long does shipping take?",
                answer:
                  "Standard shipping typically takes 3-5 business days within the continental US. International shipping times vary by location, usually between 7-14 business days.",
              },
            ].map((faq, index) => (
              <div key={index} className="bg-secondary p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
                <p className="text-primary-foreground/70">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-primary-foreground/70 mb-4">
              Didn't find what you're looking for? Contact our support team.
            </p>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <a href="mailto:support@rougewolftshirts.com">Email Support</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

