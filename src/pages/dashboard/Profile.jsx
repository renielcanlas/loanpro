import React from 'react'
import { useAuth } from '../../contexts/AuthContext'

function Profile() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 text-gray-900">{user?.email}</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <div className="mt-1 capitalize text-gray-900">{user?.role?.replace('_', ' ')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile