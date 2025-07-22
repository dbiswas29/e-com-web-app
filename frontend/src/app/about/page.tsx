import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our e-commerce platform and our commitment to quality products and excellent customer service.',
  openGraph: {
    title: 'About Us | E-Commerce',
    description: 'Learn more about our e-commerce platform and our commitment to quality products and excellent customer service.',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-width-container container-padding py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Our Store
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're passionate about bringing you the best products at great prices, 
            with exceptional customer service and a seamless shopping experience.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Founded in 2024, our e-commerce platform was born from a simple idea: 
                shopping online should be easy, enjoyable, and trustworthy. We started 
                as a small team of passionate developers and entrepreneurs who believed 
                that technology could transform the way people shop.
              </p>
              <p>
                Today, we've grown into a comprehensive platform that serves thousands 
                of customers worldwide, offering everything from electronics and fashion 
                to home goods and fitness equipment. Our commitment to quality and 
                customer satisfaction remains at the heart of everything we do.
              </p>
              <p>
                We believe in the power of innovation, sustainability, and community. 
                Every product we feature is carefully selected to meet our high standards 
                for quality, value, and customer satisfaction.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-600 rounded-full flex-shrink-0 mt-1"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Quality First</h4>
                  <p className="text-gray-600">We curate only the best products from trusted suppliers and brands.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-600 rounded-full flex-shrink-0 mt-1"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Customer Focus</h4>
                  <p className="text-gray-600">Your satisfaction is our top priority, from browsing to delivery.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-600 rounded-full flex-shrink-0 mt-1"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Innovation</h4>
                  <p className="text-gray-600">We continuously improve our platform using the latest technology.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Passion</h3>
              <p className="text-gray-600">
                We're passionate about what we do and it shows in every interaction with our customers.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Trust</h3>
              <p className="text-gray-600">
                We build trust through transparency, reliability, and consistently exceeding expectations.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in everything we do, from product selection to customer service.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 relative rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face"
                  alt="Sarah Johnson"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sarah Johnson</h3>
              <p className="text-primary-600 font-medium mb-3">Founder & CEO</p>
              <p className="text-gray-600">
                Passionate about creating exceptional shopping experiences and building lasting customer relationships.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 relative rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
                  alt="Michael Chen"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Michael Chen</h3>
              <p className="text-primary-600 font-medium mb-3">Head of Technology</p>
              <p className="text-gray-600">
                Leading our tech team to build innovative solutions that make shopping seamless and enjoyable.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 relative rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face"
                  alt="Emily Rodriguez"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Emily Rodriguez</h3>
              <p className="text-primary-600 font-medium mb-3">Customer Success Manager</p>
              <p className="text-gray-600">
                Ensuring every customer has an amazing experience from the moment they visit our store.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-primary-600 rounded-2xl text-white p-12 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-primary-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-primary-100">Products Sold</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-primary-100">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9★</div>
              <div className="text-primary-100">Customer Rating</div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-gray-100 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Have questions about our products or services? We'd love to hear from you. 
            Our team is here to help and ensure you have the best shopping experience possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="btn-primary">
              Contact Us
            </a>
            <a href="/products" className="btn-secondary">
              Shop Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
