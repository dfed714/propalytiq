'use client';

const TestimonialSection = () => {
  const testimonials = [
    {
      quote:
        'Propalytiq helped me identify a property with 12% better ROI than my initial assessment. The area insights were particularly valuable.',
      author: 'Alex Johnson',
      role: 'Property Investor',
    },
    {
      quote:
        'The BRR strategy recommendations saved me hours of research. I was able to make a confident offer within days rather than weeks.',
      author: 'Sarah Williams',
      role: 'Real Estate Developer',
    },
    {
      quote:
        'As a first-time investor, the jargon-free analysis helped me understand the potential risks and rewards clearly.',
      author: 'Michael Chen',
      role: 'New Property Investor',
    },
  ];

  return (
    <section className="py-16 px-6 sm:px-8 lg:px-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join property investors who trust our AI-powered insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <svg className="h-8 w-8 text-propalytiq-teal" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div>
                <p className="text-gray-800 flex-grow mb-6">{testimonial.quote}</p>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
