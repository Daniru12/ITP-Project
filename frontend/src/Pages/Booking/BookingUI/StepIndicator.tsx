import React from 'react'
import { CheckIcon } from 'lucide-react'
interface StepIndicatorProps {
  steps: string[]
  currentStep: number
}
export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="hidden md:flex justify-between">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep
        return (
          <div key={index} className="flex flex-col items-center w-full">
            <div className="flex items-center">
              <div
                className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 ${isCompleted ? 'bg-pink-500 border-pink-500' : isActive ? 'border-pink-500 bg-white' : 'border-gray-300 bg-white'}`}
              >
                {isCompleted ? (
                  <CheckIcon className="h-4 w-4 text-white" />
                ) : (
                  <span
                    className={`text-sm font-medium ${isActive ? 'text-pink-500' : 'text-gray-500'}`}
                  >
                    {index + 1}
                  </span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-full h-1 ${index < currentStep ? 'bg-pink-500' : 'bg-gray-300'}`}
                ></div>
              )}
            </div>
            <span
              className={`mt-2 text-xs ${isActive ? 'text-pink-500 font-medium' : 'text-gray-500'}`}
            >
              {step}
            </span>
          </div>
        )
      })}
    </div>
  )
}
