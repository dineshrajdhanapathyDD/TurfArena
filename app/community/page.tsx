'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown, Mail, Phone, MapPin } from 'lucide-react'

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ===== HEADER SECTION ===== */}
      {/* NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* LOGO */}
            <Link href="/home" className="text-xl font-bold">
              TurfArena
            </Link>
            
            {/* NAVIGATION MENU */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/home" className="text-sm font-medium hover:text-gray-300 transition">
                Home
              </Link>
              <Link href="/turfs" className="text-sm font-medium hover:text-gray-300 transition">
                Book
              </Link>
              <Link href="/tournaments" className="text-sm font-medium hover:text-gray-300 transition">
                Tournaments
              </Link>
              <Link href="/community" className="text-sm font-medium hover:text-gray-300 transition text-orange-400">
                Contact
              </Link>
            </nav>
            
            {/* USER PROFILE */}
            <div className="flex items-center gap-4">
              <Image
                src="/images/player-1.png"
                alt="Profile"
                width={32}
                height={32}
                className="size-8 rounded-full object-cover"
              />
              <button className="flex items-center gap-1 text-sm font-medium hover:text-gray-300 transition">
                Tani <ChevronDown className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===== CONTACT HEADER SECTION ===== */}
      {/* PAGE HEADER */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">📞 Contact Us</h1>
          <p className="text-lg text-blue-100">Get in touch with the TurfArena team</p>
        </div>
      </section>

      {/* ===== CONTACT CONTENT SECTION ===== */}
      {/* CONTACT INFORMATION */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* CONTACT METHOD 1: PHONE */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-4 rounded-full">
                  <Phone className="size-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
              <p className="text-gray-600 mb-2">+91 98765 43210</p>
              <p className="text-gray-600">Monday - Friday: 9AM - 6PM</p>
            </motion.div>

            {/* CONTACT METHOD 2: EMAIL */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <Mail className="size-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="text-gray-600 mb-2">contact@turfarena.com</p>
              <p className="text-gray-600">We'll respond within 24 hours</p>
            </motion.div>

            {/* CONTACT METHOD 3: LOCATION */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-orange-100 p-4 rounded-full">
                  <MapPin className="size-8 text-orange-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Visit Us</h3>
              <p className="text-gray-600 mb-2">Bengaluru, India</p>
              <p className="text-gray-600">Multiple locations across the city</p>
            </motion.div>
          </div>

          {/* ===== CONTACT FORM SECTION ===== */}
          {/* CONTACT FORM */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto bg-gray-50 rounded-lg p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Send us a Message</h2>
            
            <form className="space-y-4">
              {/* NAME FIELD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* EMAIL FIELD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* SUBJECT FIELD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* MESSAGE FIELD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  placeholder="Your message..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER SECTION ===== */}
      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">&copy; 2024 TurfArena. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
