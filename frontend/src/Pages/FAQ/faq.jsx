import React from 'react'
const FAQ = () => {
  const faqItems = [
    {
      question: 'What type of pet supplies do you offer?',
      answer:
        'We offer a wide variety of pet supplies for dogs, cats, and other small animals, including food, toys, bedding, grooming products, and more.',
    },
    {
      question: 'What brands do you carry?',
      answer:
        'We carry a range of Premium Quality and trusted pet supply brands, including Happy Dog, Josera, Trxie and many more.',
    },
    {
      question: 'Do you offer free shipping?',
      answer:
        'We offer free shipping on orders over 5,000. Please check our website for more information on shipping policies.',
    },
    {
      question: "Can I return an item if I'm not satisfied with it?",
      answer:
        'Yes, you can return an item for any reason within a certain time period after purchase. Please see our returns policy for more information.',
    },
    {
      question: 'Do you offer any special deals or discounts?',
      answer: (
        <>
          We offer a variety of deals and discounts throughout the year. Sign up
          for our{' '}
          <a href="/loyalty" className="text-red-600 hover:underline">
            Loyalty program
          </a>{' '}
          to stay up-to-date on our latest promotions.
        </>
      ),
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept a variety of payment methods, including credit and debit cards, Cash On delivery and bank transfers.',
    },
    {
      question: 'Do you have a physical store that I can visit?',
      answer: (
        <>
          Yes, we have a physical store that you can visit to see and purchase
          our products in person.{' '}
          <a href="/locations" className="text-red-600 hover:underline">
            Please check our website for store locations and hours.
          </a>
        </>
      ),
    },
  ]
  return (
    <div className="space-y-8">
      <div className="relative -mx-4 h-64 mb-12 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://www.pexels.com/photo/two-person-with-rings-on-ring-fingers-792775/')",
          }}
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
          <h1 className="text-6xl font-bold text-white tracking-wider">FAQ</h1>
          <p className="text-white/90 text-lg">
            Find answers to commonly asked questions
          </p>
        </div>
      </div>
      <h2 className="text-xl text-gray-700">Frequently Asked Questions</h2>
      <div className="space-y-8">
        {faqItems.map((item, index) => (
          <div key={index} className="space-y-2">
            <p className="font-medium text-gray-800 text-lg">
              Q: {item.question}
            </p>
            <p className="text-gray-700 pl-4">
              <span className="font-medium">A: </span>
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
export default FAQ