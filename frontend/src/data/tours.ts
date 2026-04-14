export interface Tour {
  id: string;
  name: string;
  location: string;
  duration: string;
  price: number;
  description: string;
  longDescription: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  importantInfo: string[];
  images: string[];
  category: string;
  groupSize: string;
  bestTime: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  overnight?: string;
  meals?: string;
}

export const toursData: Tour[] = [
  {
    id: "akagera-2-days",
    name: "2 Days Akagera National Park, Wildlife Safaris & Boat Cruise",
    location: "Kigali, Kayonza District",
    duration: "2 Days",
    price: 693,
    description: "This trip takes you around to experience Rwanda's Wildlife safaris and the boat cruise experiences of Akagera National Park.",
    longDescription: "Experience the best of Rwanda's wildlife on this 2-day adventure to Akagera National Park. This private tour takes you through the stunning savannah landscapes of eastern Rwanda, offering exceptional game viewing opportunities including the Big Five. The highlight includes a spectacular sunset boat cruise on Lake Ihema, where you can observe hippos and crocodiles in their natural habitat. Perfect for nature enthusiasts and photographers, this tour combines thrilling game drives with relaxing boat experiences, all while staying in comfortable lodges within the park.",
    highlights: [
      "Big Five safari experience (lion, rhino, elephant, buffalo, leopard)",
      "Sunset boat cruise on Lake Ihema with hippo and crocodile viewing",
      "Over 500 bird species - a birder's paradise",
      "Private 4x4 safari jeep for optimal game viewing",
      "Professional English-speaking driver-guide",
      "Scenic drive through Rwanda's Eastern Province"
    ],
    itinerary: [
      {
        day: 1,
        title: "Transfer to Akagera National Park - Boat Cruise",
        description: "Early morning pickup from your hotel in Kigali (6:00 AM) and transfer to Akagera National Park (approximately 2.5 hours drive). Enjoy scenic stopovers along the route for photos. Arrive at the park around 9:00 AM, check into your lodge, and have lunch. In the afternoon (4:00 PM), embark on a 2-hour sunset boat cruise on Lake Ihema. Spot hippos, crocodiles, and diverse bird species. Return to the lodge for dinner and overnight stay.",
        overnight: "Akagera Game Lodge (Bed & Breakfast)",
        meals: "Lunch, Dinner"
      },
      {
        day: 2,
        title: "Full Day Safari Game Drive - Return to Kigali",
        description: "Early morning breakfast at 5:30 AM, then depart for a full-day game drive (6:00 AM - 12:00 PM). Search for the Big Five and other wildlife including zebras, giraffes, antelopes, and baboons. Stop at a picnic site within the park for a packed lunch. Continue game viewing in different sectors of the park. Begin the journey back to Kigali at 2:00 PM, arriving at approximately 5:00 PM. Drop off at your hotel or the airport.",
        overnight: "Not included",
        meals: "Breakfast, Packed Lunch"
      }
    ],
    included: [
      "Transfers with meet and assist",
      "Game drives / Park entries",
      "Boat trip sunset in Akagera National Park",
      "Conservation park levies",
      "Vehicle entry",
      "Accommodations in a double/twin room (Bed & breakfast basis)",
      "Private transport in a 4x4 tourist converted safari jeep",
      "Services of an English-speaking driver-guide",
      "Bottled drinking water while in vehicle",
      "All activities highlighted in the itinerary",
      "All taxes on services quoted above",
      "Our assistance"
    ],
    excluded: [
      "Meals not mentioned in itinerary",
      "International, regional and local airfares",
      "Visa fees",
      "Porterage",
      "Tips and gratuities",
      "Items of personal nature (souvenirs, drinks, etc.)",
      "Travel insurance",
      "Costs of services not mentioned"
    ],
    importantInfo: [
      "The passport should be valid for at least 6 months from the date of departure",
      "Above is just a quote and no services are confirmed at present",
      "Confirmation of hotels and other services is subject to availability",
      "Rates are subject to availability at the time of booking",
      "Game drives start very early in the morning for best animal viewing",
      "Pack neutral-colored clothing for game drives",
      "Bring binoculars and a good camera"
    ],
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
      "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800",
      "https://images.unsplash.com/photo-1564767655654-dee63f9b7a31?w=800"
    ],
    category: "wildlife",
    groupSize: "2-7 people",
    bestTime: "June to September (Dry season)"
  },
  {
    id: "gorilla-trekking-3-days",
    name: "3 Days Gorilla Trekking in Volcanoes National Park",
    location: "Musanze, Northern Province",
    duration: "3 Days",
    price: 1500,
    description: "Experience the unforgettable encounter with mountain gorillas in their natural habitat.",
    longDescription: "This 3-day gorilla trekking adventure takes you to the breathtaking Volcanoes National Park, home to over 300 mountain gorillas. You'll have the rare opportunity to spend an hour with a gorilla family, observing their daily behaviors in the misty forests. This once-in-a-lifetime experience includes a cultural visit to the Iby'Iwacu village, where you'll learn about local traditions and conservation efforts.",
    highlights: [
      "Once-in-a-lifetime gorilla trekking experience",
      "Encounter with endangered mountain gorillas",
      "Scenic views of the Virunga Mountains",
      "Cultural experience at Iby'Iwacu village",
      "Professional guide and park rangers",
      "Certificate of participation"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival and Transfer to Musanze",
        description: "Pick up from Kigali International Airport or your hotel. Drive to Musanze (2-3 hours) with scenic stops. Check into your lodge, have lunch, and visit the Iby'Iwacu Cultural Village in the evening.",
        overnight: "Five Volcanoes Boutique Hotel",
        meals: "Lunch, Dinner"
      },
      {
        day: 2,
        title: "Gorilla Trekking Experience",
        description: "Early breakfast at 5:00 AM, transfer to the park headquarters for briefing by 6:30 AM. Trekking starts at 7:00 AM (can take 1-6 hours depending on gorilla location). Spend 1 magical hour with the gorillas. Return to the lodge for lunch and relaxation.",
        overnight: "Five Volcanoes Boutique Hotel",
        meals: "Breakfast, Lunch, Dinner"
      },
      {
        day: 3,
        title: "Departure",
        description: "Breakfast at the lodge, then transfer back to Kigali. Optional stop at the Ellen DeGeneres Campus of the Dian Fossey Gorilla Fund. Drop off at the airport or your hotel.",
        overnight: "Not included",
        meals: "Breakfast"
      }
    ],
    included: [
      "Gorilla permit ($1500 per person)",
      "Private 4x4 transportation",
      "Professional English-speaking guide",
      "2 nights accommodation",
      "Meals as per itinerary",
      "Bottled water",
      "Cultural village visit",
      "Park entry fees"
    ],
    excluded: [
      "International flights",
      "Visa fees",
      "Travel insurance",
      "Tips and gratuities",
      "Personal expenses",
      "Alcoholic drinks",
      "Optional activities"
    ],
    importantInfo: [
      "Gorilla permits are limited and sell out months in advance",
      "Trekking requires good physical fitness",
      "Minimum age is 15 years",
      "Bring waterproof gear and hiking boots",
      "Porters are available for hire ($20)"
    ],
    images: [
      "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800",
      "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800",
      "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800"
    ],
    category: "gorilla",
    groupSize: "1-8 people",
    bestTime: "June-September & December-February"
  },
  {
    id: "nyungwe-canopy-4-days",
    name: "4 Days Nyungwe Forest Canopy Walk & Chimpanzee Trekking",
    location: "Nyungwe National Park, Southern Province",
    duration: "4 Days",
    price: 850,
    description: "Explore Rwanda's largest mountain rainforest and walk above the canopy.",
    longDescription: "Discover the ancient rainforest of Nyungwe National Park, home to 13 primate species including chimpanzees. This 4-day adventure combines primate trekking with the thrilling canopy walkway, suspended 70 meters above the forest floor. Experience the rich biodiversity of one of Africa's oldest forests.",
    highlights: [
      "Thrilling canopy walkway experience",
      "Chimpanzee trekking in their natural habitat",
      "Waterfall hike through pristine forest",
      "Over 300 bird species including 27 endemics",
      "Tea plantation tour",
      "Colobus monkey tracking"
    ],
    itinerary: [
      {
        day: 1,
        title: "Transfer to Nyungwe National Park",
        description: "Morning pickup from Kigali, drive 4-5 hours through stunning landscapes. Stop at the King's Palace Museum in Nyanza. Check into your lodge and enjoy views of Lake Kivu.",
        overnight: "Nyungwe Top View Hill Hotel",
        meals: "Lunch, Dinner"
      },
      {
        day: 2,
        title: "Canopy Walk & Waterfall Hike",
        description: "After breakfast, head to the canopy walkway. Walk 90 meters above the forest floor on a 200-meter long bridge. Afternoon hike to the beautiful Ngungwe Waterfall.",
        overnight: "Nyungwe Top View Hill Hotel",
        meals: "Breakfast, Lunch, Dinner"
      },
      {
        day: 3,
        title: "Chimpanzee Trekking",
        description: "Early morning briefing at 5:00 AM, then trek to find habituated chimpanzee groups. Spend one hour observing these fascinating primates. Afternoon optional visit to the tea plantation.",
        overnight: "Nyungwe Top View Hill Hotel",
        meals: "Breakfast, Lunch, Dinner"
      },
      {
        day: 4,
        title: "Departure",
        description: "Breakfast at the lodge, then transfer back to Kigali with optional stops at the National Museum or craft markets.",
        overnight: "Not included",
        meals: "Breakfast"
      }
    ],
    included: [
      "Private transportation",
      "Professional guide",
      "3 nights accommodation",
      "Canopy walkway permit",
      "Chimpanzee trekking permit",
      "All meals as per itinerary",
      "Park entrance fees",
      "Bottled water"
    ],
    excluded: [
      "International flights",
      "Visa fees",
      "Travel insurance",
      "Tips",
      "Alcoholic beverages",
      "Laundry services"
    ],
    importantInfo: [
      "Chimpanzee trekking requires early start (5:00 AM)",
      "Waterproof boots and rain jacket recommended",
      "Canopy walk is not suitable for those with vertigo",
      "Bring insect repellent"
    ],
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800"
    ],
    category: "adventure",
    groupSize: "2-10 people",
    bestTime: "February-June & September-November"
  }
];