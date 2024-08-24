import Link from 'next/link'
import { Search, PlusCircle, MessageCircle, Star, Users, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 text-blue-800">Welcome to AI Rate My Professor</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Empowering students with AI-enhanced insights for better academic decisions.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Link href="/search" className="bg-white shadow-lg rounded-lg p-8 hover:shadow-xl transition-shadow transform hover:-translate-y-1">
          <Search className="h-16 w-16 text-blue-600 mb-6" />
          <h2 className="text-2xl font-semibold mb-3 text-blue-800">Search Professors</h2>
          <p className="text-gray-600 mb-4">Find and rate professors from various universities. Get detailed insights and reviews.</p>
          <span className="text-blue-600 font-semibold">Explore Now &rarr;</span>
        </Link>
        <Link href="/submit" className="bg-white shadow-lg rounded-lg p-8 hover:shadow-xl transition-shadow transform hover:-translate-y-1">
          <PlusCircle className="h-16 w-16 text-blue-600 mb-6" />
          <h2 className="text-2xl font-semibold mb-3 text-blue-800">Submit a Professor</h2>
          <p className="text-gray-600 mb-4">Add a new professor to our database. Help grow our community-driven platform.</p>
          <span className="text-blue-600 font-semibold">Contribute &rarr;</span>
        </Link>
        <Link href="/chat" className="bg-white shadow-lg rounded-lg p-8 hover:shadow-xl transition-shadow transform hover:-translate-y-1">
          <MessageCircle className="h-16 w-16 text-blue-600 mb-6" />
          <h2 className="text-2xl font-semibold mb-3 text-blue-800">Chat with AI</h2>
          <p className="text-gray-600 mb-4">Get personalized professor recommendations using our advanced AI assistant.</p>
          <span className="text-blue-600 font-semibold">Start Chatting &rarr;</span>
        </Link>
      </div>

      <section className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-8 text-blue-800">Why Choose AI Rate My Professor?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <Star className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
            <p className="text-gray-600">Get intelligent recommendations based on your preferences and learning style.</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community-Driven</h3>
            <p className="text-gray-600">Benefit from real experiences shared by students like you.</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg">
            <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Constantly Improving</h3>
            <p className="text-gray-600">Our AI learns and adapts to provide you with the most up-to-date information.</p>
          </div>
        </div>
      </section>

     
    </div>
  )
}
