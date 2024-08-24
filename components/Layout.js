import Head from 'next/head'
import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>AI Rate My Professor</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="bg-gray-100 border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-600">
            © 2024 AI Rate My Professor. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  )
}
