import React from 'react'
import { useParams } from 'react-router-dom'

function ClientDocuments() {
  const { id } = useParams()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Client Documents</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Documents for loan application #{id}</p>
        {/* Document list will be implemented here */}
      </div>
    </div>
  )
}

export default ClientDocuments