import React from "react";
import { Navbar } from "./components/Navbar";
import { ServiceSelector } from "./components/ServiceSelector";

export function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="relative">
        <div
          className="h-[500px] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://mirrorful-production.s3.us-west-1.amazonaws.com/patterns/files/6a2e3072-4c23-4e2e-98de-014aa3753105/hero.jpg')",
          }}
        >
          <div className="bg-black bg-opacity-40 h-full w-full flex items-center">
            <div className="container mx-auto px-6">
              <h1 className="text-4xl md:text-5xl text-white font-medium mb-4">
                Compare <span className="text-orange-500">Doggy Daycare</span>{" "}
                services
                <br />
                near you in <span className="text-orange-500">
                  Sri Lanka
                </span>{" "}
                for the best Doggy Daycare prices
              </h1>
              <p className="text-white text-xl mb-8">
                Get the 5 best nearby Dog Sitters with just one request.
              </p>
              <button className="bg-orange-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-orange-600">
                Get 5 Best Quotes
              </button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6">
          <ServiceSelector />
        </div>
      </main>
    </div>
  );
}
