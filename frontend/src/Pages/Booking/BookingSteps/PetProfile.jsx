import React, { useState } from 'react'
import { UploadIcon, CameraIcon } from 'lucide-react'
export function PetProfile({ formData, setFormData }) {
  const [previewUrl, setPreviewUrl] = useState(null)
  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
        setFormData({
          ...formData,
          pet: {
            ...formData.pet,
            photo: file,
          },
        })
      }
      reader.readAsDataURL(file)
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      pet: {
        ...formData.pet,
        [name]: value,
      },
    })
  }
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          Tell us about your pet
        </h2>
        <p className="text-gray-600 text-sm">
          Let's start with some basic information about your furry friend
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div
                className={`w-48 h-48 rounded-full flex items-center justify-center border-2 border-dashed ${previewUrl ? 'border-pink-300' : 'border-gray-300'} bg-gray-50`}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Pet preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="text-center p-4">
                    <CameraIcon className="w-10 h-10 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500 mt-2">
                      Upload pet photo
                    </p>
                  </div>
                )}
              </div>
              <input
                type="file"
                id="pet-photo"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              <button
                type="button"
                onClick={() => document.getElementById('pet-photo').click()}
                className="absolute bottom-0 right-0 bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full shadow-sm"
              >
                <UploadIcon className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Upload a clear photo of your pet
            </p>
          </div>
        </div>
        <div className="md:w-2/3 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pet's Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.pet.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="e.g. Buddy"
            />
          </div>
          <div>
            <label
              htmlFor="breed"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Breed
            </label>
            <input
              type="text"
              id="breed"
              name="breed"
              value={formData.pet.breed}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="e.g. Golden Retriever"
            />
          </div>
          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Age
            </label>
            <input
              type="text"
              id="age"
              name="age"
              value={formData.pet.age}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="e.g. 3 years"
            />
          </div>
        </div>
      </div>
      <div className="pt-4">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Your pet's information helps us provide the best care possible
                during their stay with us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
