import React from 'react';

const CTASection = () => {
  return (
    <section className="bg-blue-700 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-3/5">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to give your pet the care they deserve?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Join thousands of pet parents who trust Pawgo for all their pet
              care needs. Sign up today and get $20 off your first service!
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <a
                href="#"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50"
              >
                Sign Up Now
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md shadow-sm text-white hover:bg-blue-800"
              >
                Become a Provider
              </a>
            </div>
          </div>
          <div className="mt-10 lg:mt-0 lg:w-2/5 flex justify-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-300 rounded-full opacity-30"></div>
              <img
                src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                alt="Happy dog and owner"
                className="relative z-10 rounded-lg shadow-xl object-cover h-64 w-64"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-300 rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
