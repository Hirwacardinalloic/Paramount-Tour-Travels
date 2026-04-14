import { useState } from 'react';

const faqItems = [
  {
    question: 'What makes Paramount Adventure and Travels the best travel agency in Rwanda?',
    answer:
      'We offer expertly crafted safari itineraries, local expertise, personalized service, and trusted logistics to make every trip seamless, safe, and unforgettable.',
  },
  {
    question: 'What types of tours and safaris do you offer?',
    answer:
      'We offer wildlife safaris, gorilla trekking, primate experiences, cultural tours, city discovery trips, and customized travel packages across Rwanda and East Africa.',
  },
  {
    question: 'How can I book a tour or accommodation?',
    answer:
      'To book, visit our Tours page or explore the destination details. From there you can select the tour you want and complete the booking request directly on the relevant page.',
  },
  {
    question: 'Is Paramount Adventure and Travels a licensed tour company in Rwanda?',
    answer:
      'Yes. We are a registered and trusted travel operator in Rwanda with local licenses and a strong reputation for quality service and safe travel experiences.',
  },
  {
    question: 'Do you offer group and private safari tours?',
    answer:
      'Yes. We offer both private and small group safari tours, and we can customize your itinerary to suit your travel style, budget, and group size.',
  },
];

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="faq" className="relative w-full py-24 lg:py-32 bg-[#f8fafc] overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="mx-auto rounded-[3rem] bg-white p-8 md:p-12 shadow-sm">
          <div className="max-w-3xl mx-auto text-center mb-16">
          <span
            className="text-[#2f8eb2] text-sm font-semibold uppercase tracking-[0.35em] mb-4 inline-block"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Frequently Asked Questions
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-black mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Answers to the most popular travel questions
          </h2>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Find quick answers about our tours, safari packages, booking process, and how we help you explore Rwanda with confidence.
          </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
          {faqItems.map((item, index) => (
            <button
              key={item.question}
              type="button"
              onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
              className="w-full rounded-[2rem] border border-gray-200 bg-slate-50 p-6 text-left transition-all duration-300 hover:border-[#2f8eb2]"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-lg md:text-xl font-semibold text-black">
                  {item.question}
                </span>
                <span className="text-2xl text-[#2f8eb2]">
                  {activeIndex === index ? '−' : '+'}
                </span>
              </div>
              {activeIndex === index && (
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {item.answer}
                </p>
              )}
            </button>
          ))}
        </div>

        <div
          id="booking"
          className="mt-16 rounded-[2rem] border border-[#2f8eb2]/20 bg-white px-8 py-10 shadow-sm"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-black mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Booking is now handled on our Tours and Accommodation pages
            </h3>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8">
              The homepage booking form has been moved so you can book directly from the page that matches the service you want. Choose a tour or accommodation option below to get started.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/tours"
                className="inline-flex items-center justify-center rounded-full bg-[#2f8eb2] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:bg-black"
              >
                Go to Tours
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full border border-[#2f8eb2] bg-white px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#2f8eb2] transition-all duration-300 hover:bg-[#2f8eb2] hover:text-white"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}
