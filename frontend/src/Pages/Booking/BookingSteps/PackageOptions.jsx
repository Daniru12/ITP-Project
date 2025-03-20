import React from 'react'
import { CheckIcon, XIcon } from 'lucide-react'
export function PackageOptions({ formData, setFormData }) {
  const packages = [
    {
      id: 'basic',
      name: 'Basic Care',
      price: '$45',
      description: 'Essential care for your pet',
      features: [
        'Standard grooming',
        'Basic health check',
        'Regular bathing products',
        'Standard appointment slot',
      ],
      notIncluded: [
        'Premium products',
        'Extended playtime',
        'Take-home treats',
        'Priority booking',
      ],
    },
    {
      id: 'premium',
      name: 'Premium Care',
      price: '$75',
      description: 'Enhanced care with extra attention',
      features: [
        'Premium grooming',
        'Comprehensive health check',
        'Premium bathing products',
        'Extended appointment slot',
        'Complimentary nail trimming',
        'Teeth brushing',
      ],
      notIncluded: ['Take-home treats', 'Priority booking'],
    },
    {
      id: 'deluxe',
      name: 'Deluxe Care',
      price: '$95',
      description: 'The ultimate pet pampering experience',
      features: [
        'Deluxe grooming',
        'Full health assessment',
        'Organic bathing products',
        'Extended appointment slot',
        'Complimentary nail trimming',
        'Teeth brushing',
        'Take-home treats pack',
        'Priority booking',
        'Aromatherapy treatment',
      ],
      notIncluded: [],
    },
  ]
  const handlePackageSelect = (packageId) => {
    setFormData({
      ...formData,
      package: packageId,
    })
  }
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          Choose a Care Package
        </h2>
        <p className="text-gray-600 text-sm">
          Select the package that best suits your pet's needs
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => handlePackageSelect(pkg.id)}
            className={`border rounded-xl overflow-hidden cursor-pointer transition ${formData.package === pkg.id ? 'border-pink-500 shadow-md transform scale-[1.02]' : 'border-gray-200 hover:border-pink-300'}`}
          >
            <div
              className={`p-4 ${pkg.id === 'basic' ? 'bg-blue-50' : pkg.id === 'premium' ? 'bg-purple-50' : 'bg-pink-50'}`}
            >
              <h3 className="font-semibold text-lg text-gray-900">
                {pkg.name}
              </h3>
              <p className="text-2xl font-bold mt-1 text-gray-900">
                {pkg.price}
              </p>
              <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
            </div>
            <div className="p-4 bg-white">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Includes:
              </p>
              <ul className="space-y-2">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              {pkg.notIncluded.length > 0 && (
                <>
                  <p className="text-sm font-medium text-gray-700 mb-2 mt-4">
                    Not included:
                  </p>
                  <ul className="space-y-2">
                    {pkg.notIncluded.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <XIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="pt-4">
        <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-purple-700">
                All packages include a complimentary treat for your pet to enjoy
                during their visit!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
