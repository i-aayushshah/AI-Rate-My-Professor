import { useState } from 'react'
import { PlusCircle } from 'lucide-react'

export default function Submit() {
  const [link, setLink] = useState('')
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/professors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link }),
      })
      if (response.ok) {
        setMessage({ type: 'success', text: 'Professor link submitted successfully!' })
        setLink('')
      } else {
        throw new Error('Failed to submit professor link')
      }
    } catch (error) {
      console.error('Error submitting professor link:', error)
      setMessage({ type: 'error', text: 'Failed to submit professor link. Please try again.' })
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Submit a Professor</h1>
      {message && (
        <div className={`p-4 mb-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <p className="font-bold">{message.type === 'success' ? 'Success' : 'Error'}</p>
          <p>{message.text}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
            Rate My Professor Link
          </label>
          <input
            type="url"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://www.ratemyprofessors.com/professor/..."
            required
          />
        </div>
        <button type="submit" className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <PlusCircle className="h-5 w-5 mr-2" />
          Submit Professor
        </button>
      </form>
    </div>
  )
}
