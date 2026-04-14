export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  body: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'group-tours-share-the-joy-of-travel',
    title: 'Our Group Tours Share the Joy of Travel',
    description: 'Discover how our group adventures bring people together for unforgettable experiences across Rwanda and East Africa.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80',
    category: 'Group Tours',
    date: 'April 2026',
    body: `Group travel has a unique way of transforming individual journeys into shared memories. When you discover a new place with others, every sunset, local meal, and wildlife sighting becomes a story that belongs to the entire group.

Our small group tours focus on real connections. We bring together travelers who want to experience Rwanda and East Africa in a meaningful, easy, and joyful way. Whether you're visiting gorillas in the mist, watching elephants at sunset, or exploring local culture, the energy of the group helps every adventure feel richer.

The best group tours balance comfort with discovery. You move at a pace that feels relaxed, share moments with new friends, and still have time for personal reflection. This is why our groups are designed for connection, fun, and unforgettable shared experiences.`,
  },
  {
    id: 2,
    slug: 'why-small-group-travel-works-best',
    title: 'Why Small Group Travel Works Best',
    description: 'Learn why our intimate travel groups help you connect with nature, culture, and fellow travelers more deeply.',
    image: 'https://images.unsplash.com/photo-1565552636402-4fc8034ec3b5?w=1200&q=80',
    category: 'Travel Tips',
    date: 'March 2026',
    body: `Small group travel gives you the best of both worlds: structure and freedom. With a compact group, your itinerary stays smooth while still allowing space for spontaneous moments and local discoveries.

Our groups are small enough that everyone feels seen, but large enough to enjoy shared moments around campfires, on safari drives, and during cultural visits. The result is a travel experience that feels intimate, supportive, and deeply memorable.

When you travel in a smaller group, local guides can tailor the experience more easily. That means more wildlife sightings, better cultural access, and a pace that fits the group's energy. It also makes new friendships easier to form — often becoming the best part of the journey.`,
  },
  {
    id: 3,
    slug: 'top-safari-stories-from-our-guests',
    title: 'Top Safari Stories from Our Guests',
    description: 'Read real stories from travelers who experienced the magic of Rwanda wildlife and community tours.',
    image: 'https://images.unsplash.com/photo-1519197924295-5c9a35c3d272?w=1200&q=80',
    category: 'Stories',
    date: 'February 2026',
    body: `The most memorable safari stories often come from the unexpected moments. A quiet early morning when a herd of elephants crosses the plain, or a sudden break in the clouds that floods the valley with light, can stay with you for a lifetime.

Guests often tell us about the warmth of local hospitality, the thrill of listening to bird calls at dawn, and the emotional connection of seeing gorillas up close. These stories remind us that travel is not just sightseeing — it is a series of shared human moments.

While every safari has its highlights, the best stories are the ones told over dinner with the group, laughter still echoing as the day comes to a close. Those are the memories that bring travelers back to safari again and again.`,
  },
  {
    id: 4,
    slug: 'planning-your-next-adventure',
    title: 'Planning Your Next Adventure',
    description: 'Practical tips and inspiration for choosing the right itinerary and making the most of your journey.',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1200&q=80',
    category: 'Planning',
    date: 'January 2026',
    body: `Planning your next adventure starts with asking the right questions. What kinds of experiences matter most to you? Do you want wildlife, cultural immersion, or a mixture of both? Answering these questions helps shape the perfect itinerary.

We recommend choosing a trip with flexible highlights and a trusted guide. That means you can add an extra wildlife drive, visit a local village, or simply spend more time relaxing in a beautiful lodge.

Good planning also means preparing for every season, packing smart, and trusting the local experts. When your logistics are handled well, you can focus entirely on enjoying the journey.`,
  },
  {
    id: 5,
    slug: 'living-the-mountain-gorilla-moment',
    title: 'Living the Mountain Gorilla Moment',
    description: 'What to expect on a gorilla trekking experience and why it remains one of the most moving safari moments.',
    image: 'https://images.unsplash.com/photo-1560086847-aef8c5476a6e?w=1200&q=80',
    category: 'Wildlife',
    date: 'December 2025',
    body: `Gorilla trekking is one of the most powerful wildlife experiences in the world. Being close to a family of mountain gorillas, watching them breathe, socialize, and move through the forest, creates an unforgettable connection.

To make the most of the experience, come prepared with a calm mind, comfortable clothing, and plenty of respect for the animals. The moment you first see them through the trees is often described as both humbling and magical.

Our guides make sure every trek is safe, meaningful, and respectful — while helping you understand the behavior and conservation story behind these incredible animals.`,
  },
];
