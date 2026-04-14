import { useNavigate } from 'react-router-dom';

const testimonials = [
  {
    id: 1,
    quote:
      'Paramount Adventure and Travels made our family vacation effortless from start to finish. Every detail was perfectly arranged, and the memories we created are priceless.',
    name: 'Maria Nkurunziza',
    location: 'Kigali, Rwanda',
    title: 'Family Traveler',
  },
  {
    id: 2,
    quote:
      'The team helped us book a group tour that exceeded expectations. Their local knowledge, friendly service, and attention to safety gave us total peace of mind.',
    name: 'Jean-Claude Habimana',
    location: 'Butare, Rwanda',
    title: 'Adventure Seeker',
  },
  {
    id: 3,
    quote:
      'From booking to airport transfer, everything was seamless. I highly recommend Paramount for anyone wanting a reliable and personalized travel experience.',
    name: 'Aline Mukamana',
    location: 'Musanze, Rwanda',
    title: 'Group Trip Organizer',
  },
];

export default function Testimonials() {
  const navigate = useNavigate();

  return (
    <section id="testimonials" className="relative w-full py-16 lg:py-24 bg-[#f8fafc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[#2E8B11] text-sm md:text-base font-semibold uppercase tracking-[0.3em] mb-4">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f172a]">
            The Trust From Clients
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600 text-base md:text-lg leading-8">
            Discover what our clients say about their experience traveling with Paramount Adventure and Travels.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-6 text-4xl leading-none text-[#2E8B11]">“</div>
              <p className="text-gray-700 leading-8 mb-8">{item.quote}</p>
              <div className="space-y-2">
                <p className="font-semibold text-[#0f172a]">{item.name}</p>
                <p className="text-sm text-gray-500">{item.title} · {item.location}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => navigate('/write-review')}
            className="inline-flex items-center rounded-full bg-[#2E8B11] px-8 py-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#1f6f95]"
          >
            Write a review
          </button>
        </div>
      </div>
    </section>
  );
}
