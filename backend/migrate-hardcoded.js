import db from './db.js';

async function migrateData() {
  console.log('🚀 Starting migration of hardcoded data to database...');
  console.log('==========================================\n');

  try {
    // ============================================
    // 1. MIGRATE EVENTS - WITH ORIGINAL IDS
    // ============================================
    console.log('📅 Migrating Events...');
    
    const events = [
      {
        id: 1,
        title: 'Founders Friday at Norrsken',
        category: '2025',
        location: 'Norrsken House Kigali',
        date: 'Last Friday of every month',
        image: '/norrsken.png',
        description: 'A monthly gathering bringing together founders, investors, and ecosystem players to connect, share experiences, and build the future of African tech.',
        client: 'Norrsken Foundation',
        website: 'https://www.foundersfriday.co/',
        attendees: '200-300+',
        duration: 'Monthly Event',
        servicesProvided: JSON.stringify([
          'Sound System Setup',
          'Lighting Installation',
          'LED Screens',
          'Cocktail Tables',
          'Round Tables',
          'Event Planning',
        ]),
        status: 'active'
      },
      {
        id: 2,
        title: 'Jasiri Annual Gathering',
        category: '2025',
        location: 'Kigali, Rwanda',
        date: 'July 2025',
        image: '/6.jpeg',
        description: 'We proudly supported Jasiri in their annual event, bringing together visionaries and change-makers from across Africa.',
        client: 'Jasiri',
        website: 'https://jasiri.org/',
        attendees: '300+',
        duration: '2 Days',
        servicesProvided: JSON.stringify([
          'Full Event Production',
          'Stage Setup',
          'Lighting Design',
          'Sound Engineering',
          'LED Screens',
          'Decorations',
          'Manpower',
        ]),
        status: 'active'
      },
      {
        id: 3,
        title: 'Mastercard Foundation',
        category: '2025',
        location: 'Kigali',
        date: 'June 2025',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
        description: 'A two-day gathering of scholars, partners, and leaders celebrating achievements in education across Africa.',
        client: 'Mastercard Foundation',
        website: 'https://mastercardfdn.org/',
        attendees: '500+',
        duration: '2 Days',
        servicesProvided: JSON.stringify([
          'Sound System',
          'Lighting',
          'LED Screens',
          'Cocktail Tables',
          'Round Tables',
          'Event Planning',
          'Smoke Machine',
        ]),
        status: 'active'
      },
      {
        id: 4,
        title: 'Zaria Court End of Year Celebration',
        category: '2025',
        location: 'Zaria Court, Kigali',
        date: 'December 20, 2025',
        image: '/zaria.png',
        description: 'A luxurious end-of-year celebration at Zaria Court with elegant decor and entertainment.',
        client: 'Zaria Court',
        website: 'https://zariacourt.org/',
        attendees: '150+',
        duration: '1 Evening',
        servicesProvided: JSON.stringify([
          'Decorations',
          'Lighting',
          'Sound System',
          'Cocktail Tables',
          'Round Tables',
          'Event Planning',
          'Manpower',
        ]),
        status: 'active'
      },
      {
        id: 6,
        title: 'The 17th IGF',
        category: '2022',
        location: 'Kigali, Rwanda',
        date: 'Nov 2022',
        image: './3.jpeg',
        description: 'Internet Governance Forum bringing together stakeholders from government and private sector.',
        client: 'United Nations',
        attendees: '3,000+',
        duration: '5 Days',
        servicesProvided: JSON.stringify([
          'Sound System',
          'Lighting',
          'LED Screens',
          'Event Planning',
          'Manpower',
        ]),
        status: 'active'
      },
      {
        id: 7,
        title: 'Rwanda Tourism Week',
        category: '2022',
        location: 'Various Locations',
        date: '2022',
        image: './volcano.png',
        description: 'A week-long celebration of Rwandan tourism featuring exhibitions and networking events.',
        client: 'Rwanda Development Board',
        attendees: '1,500+',
        duration: '7 Days',
        servicesProvided: JSON.stringify([
          'Event Planning',
          'Decorations',
          'Sound System',
          'Lighting',
          'Cocktail Tables',
          'Round Tables',
        ]),
        status: 'active'
      },
      {
        id: 8,
        title: 'Basketball Africa League 2021',
        category: '2021',
        location: 'Kigali Arena',
        date: 'May 2021',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
        description: 'The inaugural season of the Basketball Africa League.',
        client: 'NBA Africa',
        attendees: '5,000+',
        duration: '2 Weeks',
        servicesProvided: JSON.stringify([
          'LED Screens',
          'Sound System',
          'Lighting',
          'Event Planning',
          'Manpower',
        ]),
        status: 'active'
      },
      {
        id: 9,
        title: 'AU-EU Foreign Affairs Ministerial Meeting',
        category: '2021',
        location: 'Kigali Convention Centre',
        date: 'Oct 2021',
        image: 'https://images.unsplash.com/photo-1558008258-3256797b43f3?w=800&q=80',
        description: 'High-level diplomatic meeting between African Union and European Union ministers.',
        client: 'Ministry of Foreign Affairs',
        attendees: '100+ Ministers',
        duration: '2 Days',
        servicesProvided: JSON.stringify([
          'LED Screens',
          'Sound System',
          'Lighting',
          'Event Planning',
          'Round Tables',
        ]),
        status: 'active'
      },
      {
        id: 10,
        title: 'Kigali International Peace Marathon',
        category: '2023',
        location: 'Kigali, Rwanda',
        date: 'May 2023',
        image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&q=80',
        description: 'Annual marathon event promoting peace and unity through sports.',
        client: 'Kigali City',
        attendees: '10,000+ Runners',
        duration: '1 Day',
        servicesProvided: JSON.stringify([
          'Sound System',
          'Event Planning',
          'Manpower',
          'Stage Setup',
        ]),
        status: 'active'
      }
    ];

    for (const event of events) {
      await db.runAsync(
        `INSERT OR REPLACE INTO events (id, title, category, location, date, image, description, client, website, attendees, duration, servicesProvided, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [event.id, event.title, event.category, event.location, event.date, event.image, event.description, 
         event.client, event.website, event.attendees, event.duration, event.servicesProvided, event.status]
      );
      console.log(`  ✅ Added event ID ${event.id}: ${event.title}`);
    }
    console.log(`  ✅ ${events.length} events migrated\n`);

    // ============================================
    // 2. MIGRATE CARS - WITH ORIGINAL IDS
    // ============================================
    console.log('🚗 Migrating Cars...');

    const cars = [
      {
        id: 101,
        title: 'Toyota RAV4',
        category: 'SUV',
        features: '5 seats • AC • GPS • Bluetooth',
        image: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&q=80',
        description: 'Luxury SUV, perfect for family trips and business travel.',
        price: '$85/day',
        transmission: 'Automatic',
        fuel: 'Petrol',
        mileage: 'Unlimited',
        status: 'available'
      },
      {
        id: 102,
        title: 'Mercedes C300',
        category: 'Sedan',
        features: 'Leather seats • Sunroof • Premium sound',
        image: 'https://images.unsplash.com/photo-1617654112368-307921291f42?w=800&q=80',
        description: 'Executive sedan for business travel.',
        price: '$120/day',
        transmission: 'Automatic',
        fuel: 'Petrol',
        mileage: 'Unlimited',
        status: 'available'
      },
      {
        id: 103,
        title: 'Toyota Land Cruiser Prado',
        category: 'SUV',
        features: '7 seats • 4WD • AC',
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
        description: 'Perfect for safari and off-road adventures.',
        price: '$150/day',
        transmission: 'Automatic',
        fuel: 'Diesel',
        mileage: 'Unlimited',
        status: 'available'
      },
      {
        id: 104,
        title: 'Coaster Bus',
        category: 'Bus',
        features: '25 seats • AC • Luggage space',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
        description: 'Perfect for group travel and corporate outings.',
        price: '$250/day',
        transmission: 'Manual',
        fuel: 'Diesel',
        mileage: 'Limited',
        status: 'available'
      },
      {
        id: 105,
        title: 'Hyundai Tucson',
        category: 'SUV',
        features: '5 seats • Fuel efficient • Bluetooth',
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
        description: 'Economy SUV, great value for money.',
        price: '$70/day',
        transmission: 'Automatic',
        fuel: 'Petrol',
        mileage: 'Unlimited',
        status: 'available'
      },
      {
        id: 106,
        title: 'Range Rover Velar',
        category: 'Luxury SUV',
        features: 'Luxury interior • Panoramic roof',
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
        description: 'Ultimate luxury SUV for discerning clients.',
        price: '$200/day',
        transmission: 'Automatic',
        fuel: 'Petrol',
        mileage: 'Unlimited',
        status: 'available'
      }
    ];

    for (const car of cars) {
      await db.runAsync(
        `INSERT OR REPLACE INTO cars (id, title, category, features, image, description, price, transmission, fuel, mileage, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [car.id, car.title, car.category, car.features, car.image, car.description, 
         car.price, car.transmission, car.fuel, car.mileage, car.status]
      );
      console.log(`  ✅ Added car ID ${car.id}: ${car.title}`);
    }
    console.log(`  ✅ ${cars.length} cars migrated\n`);

    // ============================================
    // 3. MIGRATE TOURISM - TOUR DETAIL DATA
    // ============================================
    console.log('🌍 Migrating Tour Detail Data...');

    const tourism = [
      {
        id: 1,
        name: "2 Days Akagera National Park, Wildlife Safaris & Boat Cruise",
        title: "2 Days Akagera National Park, Wildlife Safaris & Boat Cruise",
        category: "wildlife",
        location: "Kigali, Kayonza District",
        duration: "2 Days",
        bestTime: "June to September (Dry season)",
        price: 693,
        description: "This trip takes you around to experience Rwanda's Wildlife safaris and the boat cruise experiences of Akagera National Park.",
        longDescription: "Experience the best of Rwanda's wildlife on this 2-day adventure to Akagera National Park. This private tour takes you through the stunning savannah landscapes of eastern Rwanda, offering exceptional game viewing opportunities including the Big Five. The highlight includes a spectacular sunset boat cruise on Lake Ihema, where you can observe hippos and crocodiles in their natural habitat. Perfect for nature enthusiasts and photographers, this tour combines thrilling game drives with relaxing boat experiences, all while staying in comfortable lodges within the park.",
        highlights: JSON.stringify([
          "Big Five safari experience (lion, rhino, elephant, buffalo, leopard)",
          "Sunset boat cruise on Lake Ihema with hippo and crocodile viewing",
          "Over 500 bird species - a birder's paradise",
          "Private 4x4 safari jeep for optimal game viewing",
          "Professional English-speaking driver-guide",
          "Scenic drive through Rwanda's Eastern Province"
        ]),
        itinerary: JSON.stringify([
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
        ]),
        included: JSON.stringify([
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
        ]),
        excluded: JSON.stringify([
          "Meals not mentioned in itinerary",
          "International, regional and local airfares",
          "Visa fees",
          "Porterage",
          "Tips and gratuities",
          "Items of personal nature (souvenirs, drinks, etc.)",
          "Travel insurance",
          "Costs of services not mentioned"
        ]),
        importantInfo: JSON.stringify([
          "The passport should be valid for at least 6 months from the date of departure",
          "Above is just a quote and no services are confirmed at present",
          "Confirmation of hotels and other services is subject to availability",
          "Rates are subject to availability at the time of booking",
          "Game drives start very early in the morning for best animal viewing",
          "Pack neutral-colored clothing for game drives",
          "Bring binoculars and a good camera"
        ]),
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
          "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800",
          "https://images.unsplash.com/photo-1564767655654-dee63f9b7a31?w=800"
        ]),
        groupSize: "2-7 people",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
        status: 'active'
      },
      {
        id: 2,
        name: "3 Days Gorilla Trekking in Volcanoes National Park",
        title: "3 Days Gorilla Trekking in Volcanoes National Park",
        category: "gorilla",
        location: "Musanze, Northern Province",
        duration: "3 Days",
        bestTime: "June-September & December-February",
        price: 1500,
        description: "Experience the unforgettable encounter with mountain gorillas in their natural habitat.",
        longDescription: "This 3-day gorilla trekking adventure takes you to the breathtaking Volcanoes National Park, home to over 300 mountain gorillas. You'll have the rare opportunity to spend an hour with a gorilla family, observing their daily behaviors in the misty forests. This once-in-a-lifetime experience includes a cultural visit to the Iby'Iwacu village, where you'll learn about local traditions and conservation efforts.",
        highlights: JSON.stringify([
          "Once-in-a-lifetime gorilla trekking experience",
          "Encounter with endangered mountain gorillas",
          "Scenic views of the Virunga Mountains",
          "Cultural experience at Iby'Iwacu village",
          "Professional guide and park rangers",
          "Certificate of participation"
        ]),
        itinerary: JSON.stringify([
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
        ]),
        included: JSON.stringify([
          "Gorilla permit ($1500 per person)",
          "Private 4x4 transportation",
          "Professional English-speaking guide",
          "2 nights accommodation",
          "Meals as per itinerary",
          "Bottled water",
          "Cultural village visit",
          "Park entry fees"
        ]),
        excluded: JSON.stringify([
          "International flights",
          "Visa fees",
          "Travel insurance",
          "Tips and gratuities",
          "Personal expenses",
          "Alcoholic drinks",
          "Optional activities"
        ]),
        importantInfo: JSON.stringify([
          "Gorilla permits are limited and sell out months in advance",
          "Trekking requires good physical fitness",
          "Minimum age is 15 years",
          "Bring waterproof gear and hiking boots",
          "Porters are available for hire ($20)"
        ]),
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800",
          "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800",
          "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800"
        ]),
        groupSize: "1-8 people",
        image: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800",
        status: 'active'
      },
      {
        id: 3,
        name: "4 Days Nyungwe Forest Canopy Walk & Chimpanzee Trekking",
        title: "4 Days Nyungwe Forest Canopy Walk & Chimpanzee Trekking",
        category: "adventure",
        location: "Nyungwe National Park, Southern Province",
        duration: "4 Days",
        bestTime: "February-June & September-November",
        price: 850,
        description: "Explore Rwanda's largest mountain rainforest and walk above the canopy.",
        longDescription: "Discover the ancient rainforest of Nyungwe National Park, home to 13 primate species including chimpanzees. This 4-day adventure combines primate trekking with the thrilling canopy walkway, suspended 70 meters above the forest floor. Experience the rich biodiversity of one of Africa's oldest forests.",
        highlights: JSON.stringify([
          "Thrilling canopy walkway experience",
          "Chimpanzee trekking in their natural habitat",
          "Waterfall hike through pristine forest",
          "Over 300 bird species including 27 endemics",
          "Tea plantation tour",
          "Colobus monkey tracking"
        ]),
        itinerary: JSON.stringify([
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
        ]),
        included: JSON.stringify([
          "Private transportation",
          "Professional guide",
          "3 nights accommodation",
          "Canopy walkway permit",
          "Chimpanzee trekking permit",
          "All meals as per itinerary",
          "Park entrance fees",
          "Bottled water"
        ]),
        excluded: JSON.stringify([
          "International flights",
          "Visa fees",
          "Travel insurance",
          "Tips",
          "Alcoholic beverages",
          "Laundry services"
        ]),
        importantInfo: JSON.stringify([
          "Chimpanzee trekking requires early start (5:00 AM)",
          "Waterproof boots and rain jacket recommended",
          "Canopy walk is not suitable for those with vertigo",
          "Bring insect repellent"
        ]),
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800"
        ]),
        groupSize: "2-10 people",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
        status: 'active'
      },
      // Uganda Tours
      {
        id: 4,
        name: "3 Days Chimpanzee Tracking & Murchison Falls Safari",
        title: "3 Days Chimpanzee Tracking & Murchison Falls Safari",
        category: "wildlife",
        location: "Uganda - Kampala, Murchison Falls National Park",
        duration: "3 Days",
        bestTime: "December to February (Dry season)",
        price: 850,
        description: "Experience Uganda's wildlife wonders with chimpanzee tracking in Kibale Forest and the mighty Murchison Falls.",
        longDescription: "Embark on an unforgettable 3-day adventure through Uganda's most spectacular wildlife destinations. Begin with chimpanzee tracking in Kibale Forest National Park, home to over 1,500 chimpanzees. Continue to Murchison Falls National Park for game drives, boat safaris, and witnessing the Nile's most powerful waterfall. This tour combines primate encounters with big game viewing in one of Africa's most biodiverse countries.",
        highlights: JSON.stringify([
          "Chimpanzee tracking in Kibale Forest",
          "Murchison Falls boat safari on the Nile",
          "Big Five game viewing",
          "Hot air balloon safari option",
          "Cultural encounters with local communities",
          "Scenic Nile River landscapes"
        ]),
        itinerary: JSON.stringify([
          {
            day: 1,
            title: "Kampala to Kibale Forest - Chimpanzee Tracking",
            description: "Depart Kampala early morning for Kibale Forest National Park (about 5 hours drive). Arrive and check into your lodge. Afternoon chimpanzee tracking permit briefing. Enjoy dinner and overnight at the lodge.",
            overnight: "Kibale Forest Lodge",
            meals: "Lunch, Dinner"
          },
          {
            day: 2,
            title: "Chimpanzee Tracking & Transfer to Murchison",
            description: "Early morning chimpanzee tracking (2-3 hours). Return to lodge for breakfast. Afternoon transfer to Murchison Falls National Park (about 6 hours). Evening game drive spotting elephants, lions, and antelopes.",
            overnight: "Murchison Falls Lodge",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 3,
            title: "Murchison Falls Safari & Return to Kampala",
            description: "Morning boat safari on the Nile to see hippos, crocodiles, and the base of Murchison Falls. Afternoon game drive. Depart for Kampala in the evening, arriving late night.",
            overnight: "Not included",
            meals: "Breakfast, Lunch"
          }
        ]),
        included: JSON.stringify([
          "Ground transportation in 4x4 safari vehicle",
          "Professional English-speaking guide",
          "Chimpanzee tracking permits",
          "Park entrance fees",
          "Accommodation in lodges",
          "Meals as specified",
          "Bottled drinking water",
          "All activities mentioned"
        ]),
        excluded: JSON.stringify([
          "International flights",
          "Visa fees",
          "Travel insurance",
          "Personal expenses",
          "Tips and gratuities",
          "Hot air balloon safari",
          "Items of personal nature"
        ]),
        importantInfo: JSON.stringify([
          "Chimpanzee tracking requires good physical fitness",
          "Weather can be unpredictable",
          "Best time for wildlife viewing is dry season",
          "Carry appropriate clothing and insect repellent",
          "Valid passport required for park entry"
        ]),
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800",
          "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800",
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
        ]),
        groupSize: "2-8 people",
        image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800",
        status: 'active'
      },
      // Kenya Tours
      {
        id: 5,
        name: "4 Days Maasai Mara Safari & Nairobi Experience",
        title: "4 Days Maasai Mara Safari & Nairobi Experience",
        category: "wildlife",
        location: "Kenya - Nairobi, Maasai Mara National Reserve",
        duration: "4 Days",
        bestTime: "July to October (Great Migration)",
        price: 1200,
        description: "Witness the Great Migration in Maasai Mara and explore Nairobi's vibrant culture and wildlife.",
        longDescription: "Experience Kenya's most iconic safari destinations on this comprehensive 4-day tour. Begin in Nairobi with city highlights and a visit to the David Sheldrick Wildlife Trust elephant orphanage. Then journey to the Maasai Mara for an incredible wildlife experience during the Great Migration season. Stay in luxury lodges and enjoy game drives, cultural encounters with Maasai communities, and breathtaking savanna landscapes.",
        highlights: JSON.stringify([
          "Maasai Mara Great Migration viewing",
          "Big Five safari experience",
          "Maasai cultural village visit",
          "Nairobi National Park game drive",
          "Elephant orphanage visit",
          "Hot air balloon safari option",
          "Amboseli National Park extension available"
        ]),
        itinerary: JSON.stringify([
          {
            day: 1,
            title: "Nairobi Arrival & City Tour",
            description: "Arrive in Nairobi, transfer to hotel. Afternoon city tour visiting Karen Blixen Museum, Giraffe Centre, and David Sheldrick Elephant Orphanage. Evening game drive in Nairobi National Park.",
            overnight: "Nairobi Safari Lodge",
            meals: "Dinner"
          },
          {
            day: 2,
            title: "Transfer to Maasai Mara",
            description: "Early morning transfer to Maasai Mara (about 5 hours). Afternoon game drive spotting the Big Five. Witness wildebeest migration if in season. Evening Maasai cultural performance.",
            overnight: "Maasai Mara Safari Lodge",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 3,
            title: "Full Day Maasai Mara Safari",
            description: "Full day game drives exploring different areas of the reserve. Optional hot air balloon safari at sunrise. Visit Maasai villages and learn about their culture and traditions.",
            overnight: "Maasai Mara Safari Lodge",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 4,
            title: "Maasai Mara to Nairobi & Departure",
            description: "Morning game drive and breakfast. Transfer back to Nairobi (5 hours). Afternoon at leisure or optional activities before departure transfer to airport.",
            overnight: "Not included",
            meals: "Breakfast, Lunch"
          }
        ]),
        included: JSON.stringify([
          "Airport transfers",
          "Ground transportation in 4x4 safari vehicles",
          "Professional safari guide",
          "Park entrance fees",
          "Accommodation in lodges",
          "Meals as specified",
          "Bottled drinking water",
          "Cultural visits and performances"
        ]),
        excluded: JSON.stringify([
          "International flights",
          "Visa fees",
          "Travel insurance",
          "Personal expenses",
          "Tips and gratuities",
          "Optional hot air balloon safari",
          "Items of personal nature"
        ]),
        importantInfo: JSON.stringify([
          "Great Migration best viewed July-October",
          "Weather can be dusty during dry season",
          "Carry appropriate safari clothing",
          "Malaria prophylaxis recommended",
          "Valid passport required"
        ]),
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800",
          "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800",
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800"
        ]),
        groupSize: "2-7 people",
        image: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800",
        status: 'active'
      },
      // Tanzania Tours
      {
        id: 6,
        name: "5 Days Serengeti Safari & Ngorongoro Crater",
        title: "5 Days Serengeti Safari & Ngorongoro Crater",
        category: "wildlife",
        location: "Tanzania - Arusha, Serengeti National Park, Ngorongoro",
        duration: "5 Days",
        bestTime: "June to September (Dry season)",
        price: 1500,
        description: "Explore Tanzania's wildlife paradise with the Serengeti Great Migration and Ngorongoro Crater.",
        longDescription: "Discover Tanzania's most famous wildlife destinations on this comprehensive 5-day safari. Experience the endless plains of the Serengeti during the Great Migration, descend into the Ngorongoro Crater for incredible game viewing, and stay in luxury lodges with stunning views. This tour offers exceptional wildlife encounters and breathtaking landscapes that define the African safari experience.",
        highlights: JSON.stringify([
          "Serengeti Great Migration",
          "Ngorongoro Crater full-day safari",
          "Big Five game viewing",
          "Maasai cultural encounters",
          "Hot air balloon safari option",
          "Centrally located luxury lodges",
          "Professional photography guides available"
        ]),
        itinerary: JSON.stringify([
          {
            day: 1,
            title: "Arusha to Serengeti National Park",
            description: "Depart Arusha early morning for Serengeti National Park (about 6 hours). Afternoon game drive spotting lions, cheetahs, and migrating herds. Enjoy spectacular sunset views over the plains.",
            overnight: "Serengeti Safari Lodge",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 2,
            title: "Full Day Serengeti Safari",
            description: "Full day exploring different areas of Serengeti. Visit Seronera River for hippo pools and predator viewing. Optional hot air balloon safari at dawn for incredible aerial perspectives.",
            overnight: "Serengeti Safari Lodge",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 3,
            title: "Serengeti to Ngorongoro Crater",
            description: "Morning game drive in Serengeti, then transfer to Ngorongoro Conservation Area (about 4 hours). Afternoon relaxation at the lodge with crater views.",
            overnight: "Ngorongoro Crater Lodge",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 4,
            title: "Ngorongoro Crater Safari",
            description: "Full day descending into Ngorongoro Crater for incredible wildlife viewing. Spot all Big Five in one day, plus thousands of flamingos and other species in this natural amphitheater.",
            overnight: "Ngorongoro Crater Lodge",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 5,
            title: "Ngorongoro to Arusha & Departure",
            description: "Morning game drive or relaxation. Transfer back to Arusha (about 4 hours). Afternoon at leisure before departure transfer to airport or onward travel.",
            overnight: "Not included",
            meals: "Breakfast, Lunch"
          }
        ]),
        included: JSON.stringify([
          "Ground transportation in 4x4 safari vehicles",
          "Professional English-speaking safari guide",
          "Park entrance fees and conservation levies",
          "Accommodation in luxury lodges",
          "Meals as specified",
          "Bottled drinking water",
          "All game drives and activities mentioned"
        ]),
        excluded: JSON.stringify([
          "International flights",
          "Visa fees",
          "Travel insurance",
          "Personal expenses",
          "Tips and gratuities",
          "Optional hot air balloon safari",
          "Items of personal nature"
        ]),
        importantInfo: JSON.stringify([
          "Great Migration best viewed June-September",
          "Ngorongoro Crater descent requires early start",
          "Weather can be cool at higher elevations",
          "Carry layered clothing and rain jacket",
          "Malaria prophylaxis recommended",
          "Valid passport required for park entry"
        ]),
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
        ]),
        groupSize: "2-7 people",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
        status: 'active'
      },
      // Additional Uganda Tours
      {
        id: 7,
        name: "3 Days Bwindi Impenetrable Forest Gorilla Trekking",
        title: "3 Days Bwindi Impenetrable Forest Gorilla Trekking",
        category: "wildlife",
        location: "Uganda - Kampala, Bwindi Impenetrable National Park",
        duration: "3 Days",
        bestTime: "June to September (Dry season)",
        price: 950,
        description: "Track mountain gorillas in the misty forests of Bwindi Impenetrable National Park.",
        longDescription: "Experience one of Uganda's most incredible wildlife encounters - mountain gorilla trekking in Bwindi Impenetrable National Park. This UNESCO World Heritage site is home to almost half of the world's remaining mountain gorillas. Spend three days immersed in the lush rainforest, tracking these magnificent creatures and learning about conservation efforts. Combined with cultural experiences and scenic beauty, this tour offers an unforgettable glimpse into Uganda's biodiversity.",
        highlights: JSON.stringify([
          "Mountain gorilla trekking and habituation",
          "Bwindi Impenetrable Forest exploration",
          "Batwa pygmy community cultural experience",
          "Bird watching (over 350 species)",
          "Bamboo forest walks",
          "Conservation education and community support"
        ]),
        itinerary: JSON.stringify([
          {
            day: 1,
            title: "Kampala to Bwindi Impenetrable Forest",
            description: "Early morning departure from Kampala to Bwindi (about 8-9 hours drive). Stop for lunch en route. Arrive in the afternoon and check into your lodge. Evening briefing about gorilla trekking and local conservation efforts.",
            overnight: "Bwindi Lodge",
            meals: "Lunch, Dinner"
          },
          {
            day: 2,
            title: "Gorilla Trekking Experience",
            description: "Early morning breakfast followed by gorilla trekking (4-8 hours depending on gorilla location). Spend up to one hour observing the gorillas in their natural habitat. Afternoon visit to a local Batwa pygmy community to learn about their traditional way of life.",
            overnight: "Bwindi Lodge",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 3,
            title: "Forest Walk & Return to Kampala",
            description: "Morning nature walk in the forest trails. Afternoon departure for Kampala (8-9 hours). Arrive in Kampala in the evening with unforgettable memories of Uganda's gorillas.",
            overnight: "Not included",
            meals: "Breakfast, Lunch"
          }
        ]),
        included: JSON.stringify([
          "Ground transportation",
          "Gorilla trekking permits",
          "Professional guide",
          "Park entrance fees",
          "Accommodation",
          "Meals as specified",
          "Community visit fees",
          "Bottled water"
        ]),
        excluded: JSON.stringify([
          "International flights",
          "Visa fees",
          "Travel insurance",
          "Personal expenses",
          "Tips and gratuities",
          "Items of personal nature"
        ]),
        importantInfo: JSON.stringify([
          "Gorilla trekking requires good physical fitness",
          "Weather can be rainy in forest",
          "Carry appropriate clothing and rain gear",
          "Maximum 8 people per gorilla group",
          "Photography restrictions apply near gorillas"
        ]),
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
          "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800",
          "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800"
        ]),
        groupSize: "1-8 people",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
        status: 'active'
      },
      {
        id: 8,
        name: "4 Days Queen Elizabeth National Park Wildlife Safari",
        title: "4 Days Queen Elizabeth National Park Wildlife Safari",
        category: "wildlife",
        location: "Uganda - Kampala, Queen Elizabeth National Park",
        duration: "4 Days",
        bestTime: "June to September (Dry season)",
        price: 780,
        description: "Explore Uganda's most biodiverse park with game drives, boat safaris, and crater lakes.",
        longDescription: "Queen Elizabeth National Park is Uganda's most visited park and offers incredible wildlife diversity. This 4-day safari takes you through savanna grasslands, crater lakes, and along the Kazinga Channel for boat safaris. Spot tree-climbing lions, enormous elephant herds, and over 600 bird species. The park's location between Lake Edward and Lake George creates a unique ecosystem that's home to Uganda's highest concentration of wildlife.",
        highlights: JSON.stringify([
          "Tree-climbing lions",
          "Kazinga Channel boat safari",
          "Crater lakes exploration",
          "Elephant and buffalo herds",
          "Over 600 bird species",
          "Kyambura Gorge chimpanzee tracking"
        ]),
        itinerary: JSON.stringify([
          {
            day: 1,
            title: "Kampala to Queen Elizabeth National Park",
            description: "Depart Kampala early morning for Queen Elizabeth (about 6 hours). Afternoon game drive spotting elephants, lions, and antelopes. Evening relaxation at the lodge overlooking the park.",
            overnight: "Queen Elizabeth Safari Lodge",
            meals: "Lunch, Dinner"
          },
          {
            day: 2,
            title: "Full Day Game Drives & Boat Safari",
            description: "Morning game drive through the park. Afternoon boat safari on Kazinga Channel spotting hippos, crocodiles, and water birds. Optional evening game drive for nocturnal animals.",
            overnight: "Queen Elizabeth Safari Lodge",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 3,
            title: "Kyambura Gorge & Crater Drive",
            description: "Morning chimpanzee tracking in Kyambura Gorge. Afternoon scenic drive around the crater lakes and salt lakes. Visit the local communities and learn about salt harvesting.",
            overnight: "Queen Elizabeth Safari Lodge",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 4,
            title: "Final Game Drive & Return to Kampala",
            description: "Early morning game drive to catch wildlife at dawn. Breakfast and departure for Kampala (6 hours). Arrive in Kampala in the afternoon.",
            overnight: "Not included",
            meals: "Breakfast, Lunch"
          }
        ]),
        included: JSON.stringify([
          "Ground transportation",
          "Park entrance fees",
          "Boat safari",
          "Professional guide",
          "Accommodation",
          "Meals as specified",
          "Bottled water"
        ]),
        excluded: JSON.stringify([
          "International flights",
          "Visa fees",
          "Travel insurance",
          "Personal expenses",
          "Tips and gratuities",
          "Chimpanzee tracking permits",
          "Items of personal nature"
        ]),
        importantInfo: JSON.stringify([
          "Best wildlife viewing in dry season",
          "Carry binoculars and camera",
          "Weather can be hot during day",
          "Malaria area - take precautions",
          "Fuel surcharge may apply for boat safari"
        ]),
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800",
          "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800",
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
        ]),
        groupSize: "2-6 people",
        image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800",
        status: 'active'
      },
      {
        id: 9,
        name: "2 Days Source of the Nile & Jinja Adventure",
        title: "2 Days Source of the Nile & Jinja Adventure",
        category: "adventure",
        location: "Uganda - Kampala, Jinja",
        duration: "2 Days",
        bestTime: "June to September (Dry season)",
        price: 350,
        description: "Visit the legendary Source of the Nile and experience white-water rafting in Jinja.",
        longDescription: "Discover where the world's longest river begins! The Nile River starts at Lake Victoria in Jinja, Uganda. This 2-day adventure combines cultural exploration at the Source of the Nile with thrilling white-water rafting on Grade 5 rapids. Visit the Nile River Explorers statue, learn about the river's history, and experience some of Africa's best white-water rafting on the world's most famous river.",
        highlights: JSON.stringify([
          "Source of the Nile monument and history",
          "White-water rafting on Grade 5 rapids",
          "Nile River Explorers statue",
          "Bujagali Falls scenic views",
          "Cultural boat ride on Lake Victoria",
          "Adventure sports and local cuisine"
        ]),
        itinerary: JSON.stringify([
          {
            day: 1,
            title: "Kampala to Jinja - Source of the Nile",
            description: "Morning departure from Kampala to Jinja (1.5 hours). Visit the Source of the Nile monument and learn about the river's history. Afternoon boat ride to see where the Nile begins. Evening free time in Jinja town.",
            overnight: "Jinja Guest House",
            meals: "Lunch, Dinner"
          },
          {
            day: 2,
            title: "White-water Rafting & Return",
            description: "Morning white-water rafting on the Nile's Grade 5 rapids (3-4 hours of excitement). Afternoon relaxation or optional bungee jumping. Late afternoon departure back to Kampala (1.5 hours).",
            overnight: "Not included",
            meals: "Breakfast, Lunch"
          }
        ]),
        included: JSON.stringify([
          "Ground transportation",
          "Source of the Nile entrance",
          "Boat ride",
          "White-water rafting equipment",
          "Professional rafting guides",
          "Safety equipment",
          "Meals as specified"
        ]),
        excluded: JSON.stringify([
          "International flights",
          "Visa fees",
          "Travel insurance",
          "Personal expenses",
          "Tips and gratuities",
          "Optional activities",
          "Items of personal nature"
        ]),
        importantInfo: JSON.stringify([
          "White-water rafting requires swimming ability",
          "Medical certificate may be required",
          "Weather dependent activity",
          "Minimum age 18 for rafting",
          "Carry appropriate clothing and sunscreen"
        ]),
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800",
          "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800",
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
        ]),
        groupSize: "4-12 people",
        image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800",
        status: 'active'
      },
      // Additional Kenya Tours
      {
        id: 10,
        name: "3 Days Amboseli National Park Safari",
        title: "3 Days Amboseli National Park Safari",
        category: "wildlife",
        location: "Kenya - Nairobi, Amboseli National Park",
        duration: "3 Days",
        bestTime: "June to October (Dry season)",
        price: 650,
        description: "Experience Kenya's elephant paradise with Mount Kilimanjaro views in Amboseli.",
        longDescription: "Amboseli National Park is famous for its large elephant herds and stunning views of Mount Kilimanjaro. This 3-day safari offers exceptional game viewing in a landscape dominated by the snow-capped peak of Africa's highest mountain. Watch elephants, lions, cheetahs, and hundreds of bird species against the dramatic backdrop of Kibo peak. The park's swamps and acacia woodlands provide perfect habitats for diverse wildlife.",
        highlights: JSON.stringify([
          "Largest elephant population in Kenya",
          "Mount Kilimanjaro views",
          "Big Five game viewing",
          "Observation Hill viewpoints",
          "Maasai cultural visits",
          "Night game drives",
          "Dust devils and desert landscapes"
        ]),
        itinerary: JSON.stringify([
          {
            day: 1,
            title: "Nairobi to Amboseli National Park",
            description: "Early morning departure from Nairobi to Amboseli (3 hours). Morning game drive spotting elephants and other wildlife. Afternoon relaxation at the lodge with Kilimanjaro views.",
            overnight: "Amboseli Safari Lodge",
            meals: "Lunch, Dinner"
          },
          {
            day: 2,
            title: "Full Day Amboseli Game Drives",
            description: "Full day exploring Amboseli's diverse habitats. Visit Observation Hill for panoramic views. Afternoon game drive focusing on elephant herds and predators. Optional Maasai village visit.",
            overnight: "Amboseli Safari Lodge",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 3,
            title: "Final Game Drive & Return to Nairobi",
            description: "Early morning game drive to catch wildlife at dawn. Breakfast and departure for Nairobi (3 hours). Afternoon arrival in Nairobi.",
            overnight: "Not included",
            meals: "Breakfast, Lunch"
          }
        ]),
        included: JSON.stringify([
          "Ground transportation",
          "Park entrance fees",
          "Professional guide",
          "Accommodation",
          "Meals as specified",
          "Bottled water",
          "Game drives"
        ]),
        excluded: JSON.stringify([
          "International flights",
          "Visa fees",
          "Travel insurance",
          "Personal expenses",
          "Tips and gratuities",
          "Items of personal nature"
        ]),
        importantInfo: JSON.stringify([
          "Best elephant viewing year-round",
          "Kilimanjaro views weather dependent",
          "Carry binoculars and camera",
          "Dust can be an issue in dry season",
          "Malaria area - take precautions"
        ]),
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800",
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
          "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800"
        ]),
        groupSize: "2-6 people",
        image: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800",
        status: 'active'
      },
      {
        id: 11,
        name: "4 Days Tsavo National Park Adventure",
        title: "4 Days Tsavo National Park Adventure",
        category: "wildlife",
        location: "Kenya - Nairobi, Tsavo National Park",
        duration: "4 Days",
        bestTime: "September to March (Wet season)",
        price: 720,
        description: "Explore Kenya's largest national park with red elephants and volcanic landscapes.",
        longDescription: "Tsavo National Park, Kenya's largest wildlife sanctuary, offers a different safari experience with its volcanic landscapes and unique 'red elephant' population. This 4-day adventure takes you through Tsavo East and West, exploring lava flows, palm-fringed rivers, and diverse wildlife. Visit the famous Yatta Plateau, the longest lava flow in the world, and experience the park's rich history and biodiversity.",
        highlights: JSON.stringify([
          "Red elephants of Tsavo",
          "Yatta Plateau (world's longest lava flow)",
          "Tsavo River wildlife corridors",
          "Volcanic landscapes and black cotton soil",
          "Man-Eaters of Tsavo history",
          "Palm-fringed rivers and springs",
          "Night game drives"
        ]),
        itinerary: JSON.stringify([
          {
            day: 1,
            title: "Nairobi to Tsavo East National Park",
            description: "Morning departure from Nairobi to Tsavo East (4 hours). Afternoon game drive exploring the park's volcanic landscapes and spotting wildlife. Visit Aruba Dam for bird watching.",
            overnight: "Tsavo Safari Lodge",
            meals: "Lunch, Dinner"
          },
          {
            day: 2,
            title: "Tsavo East Exploration",
            description: "Full day exploring Tsavo East. Visit Yatta Plateau and Mudanda Rock. Afternoon game drive focusing on the park's unique red soil elephants and diverse antelope species.",
            overnight: "Tsavo Safari Lodge",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 3,
            title: "Transfer to Tsavo West",
            description: "Morning transfer to Tsavo West (2 hours). Afternoon game drive visiting Mzima Springs and the Ngulia Rhino Sanctuary. Optional night game drive.",
            overnight: "Tsavo West Safari Lodge",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 4,
            title: "Tsavo West & Return to Nairobi",
            description: "Morning game drive in Tsavo West. Visit Shetani Lava Flow and Chaimu Crater. Afternoon departure for Nairobi (4 hours) with arrival in the evening.",
            overnight: "Not included",
            meals: "Breakfast, Lunch"
          }
        ]),
        included: JSON.stringify([
          "Ground transportation",
          "Park entrance fees",
          "Professional guide",
          "Accommodation",
          "Meals as specified",
          "Bottled water",
          "Game drives"
        ]),
        excluded: JSON.stringify([
          "International flights",
          "Visa fees",
          "Travel insurance",
          "Personal expenses",
          "Tips and gratuities",
          "Items of personal nature"
        ]),
        importantInfo: JSON.stringify([
          "Tsavo is Kenya's largest park",
          "Red elephants get color from volcanic soil",
          "Wet season brings more water and greenery",
          "Carry binoculars and camera",
          "Malaria area - take precautions"
        ]),
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
          "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800",
          "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800"
        ]),
        groupSize: "2-6 people",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
        status: 'active'
      },
      {
        id: 12,
        name: "5 Days Mount Kenya Climbing Adventure",
        title: "5 Days Mount Kenya Climbing Adventure",
        category: "adventure",
        location: "Kenya - Nairobi, Mount Kenya National Park",
        duration: "5 Days",
        bestTime: "January to March (Dry season)",
        price: 1100,
        description: "Climb Africa's second-highest peak with experienced guides and stunning alpine scenery.",
        longDescription: "Mount Kenya, Africa's second-highest mountain and a UNESCO World Heritage site, offers an incredible climbing adventure. This 5-day expedition takes you to Point Lenana (4,985m), accessible to climbers of various skill levels. Experience diverse ecosystems from rainforest to alpine desert, spot unique mountain wildlife, and enjoy breathtaking views across the Kenyan landscape. Professional guides ensure safety while you create unforgettable memories.",
        highlights: JSON.stringify([
          "Summit Point Lenana (4,985m)",
          "Diverse ecosystems from rainforest to alpine",
          "Unique mountain wildlife and birds",
          "Sirimon Route climbing experience",
          "Mountain lodge accommodation",
          "Stunning equatorial glacier views",
          "Cultural interactions with local communities"
        ]),
        itinerary: JSON.stringify([
          {
            day: 1,
            title: "Nairobi to Mount Kenya",
            description: "Early morning departure from Nairobi to Nanyuki (3 hours), then to Sirimon Gate (2 hours). Afternoon acclimatization walk and briefing about the climb. Overnight at Mountain Lodge.",
            overnight: "Mount Kenya Mountain Lodge",
            meals: "Lunch, Dinner"
          },
          {
            day: 2,
            title: "Old Moses Camp (3,300m)",
            description: "Morning hike through rainforest and heather zones (5-6 hours). Arrive at Old Moses Camp. Afternoon rest and acclimatization. Evening stargazing and mountain stories.",
            overnight: "Old Moses Camp",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 3,
            title: "Shipton's Camp (4,200m)",
            description: "Continue ascent through alpine vegetation (4-5 hours). Arrive at Shipton's Camp. Afternoon acclimatization and preparation for summit day. Spectacular views of surrounding peaks.",
            overnight: "Shipton's Camp",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 4,
            title: "Summit Day - Point Lenana",
            description: "Early morning summit attempt (3-4 hours to Point Lenana). Return to camp for breakfast. Afternoon descent to Mountain Lodge (4-5 hours). Celebration of achievement.",
            overnight: "Mount Kenya Mountain Lodge",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 5,
            title: "Descent & Return to Nairobi",
            description: "Final descent to park gate (3 hours). Transfer back to Nairobi (5 hours) with arrival in the evening. Farewell dinner and certificates.",
            overnight: "Not included",
            meals: "Breakfast, Lunch"
          }
        ]),
        included: JSON.stringify([
          "Ground transportation",
          "Park entrance and climbing fees",
          "Professional climbing guides",
          "Mountain lodge and camping accommodation",
          "Meals as specified",
          "Climbing equipment",
          "Porter support",
          "Emergency oxygen and first aid"
        ]),
        excluded: JSON.stringify([
          "International flights",
          "Visa fees",
          "Travel insurance",
          "Personal expenses",
          "Tips and gratuities",
          "Personal climbing gear",
          "Items of personal nature"
        ]),
        importantInfo: JSON.stringify([
          "Requires good physical fitness",
          "Medical certificate recommended",
          "Altitude sickness possible",
          "Weather can change rapidly",
          "Minimum age 16 for climbing",
          "Group size limited to 12 climbers"
        ]),
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800",
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
          "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800"
        ]),
        groupSize: "4-12 people",
        image: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800",
        status: 'active'
      },
      {
        id: 13,
        name: "3 Days Mombasa Coastal Beaches & Culture",
        title: "3 Days Mombasa Coastal Beaches & Culture",
        category: "cultural",
        location: "Kenya - Nairobi, Mombasa",
        duration: "3 Days",
        bestTime: "December to March (Dry season)",
        price: 550,
        description: "Experience Kenya's Indian Ocean coast with pristine beaches, Swahili culture, and marine life.",
        longDescription: "Discover Kenya's beautiful coastline on this 3-day cultural and beach adventure. Mombasa, with its rich Swahili heritage and stunning beaches, offers a perfect blend of relaxation and cultural exploration. Visit historic Fort Jesus, explore the old town, relax on pristine beaches, and experience the unique Swahili culture that has flourished here for centuries. Optional dhow boat trips and marine activities add to the coastal experience.",
        highlights: JSON.stringify([
          "Fort Jesus UNESCO World Heritage Site",
          "Mombasa Old Town walking tour",
          "Swahili cultural performances",
          "Pristine beach relaxation",
          "Dhow boat sunset cruises",
          "Marine park snorkeling",
          "Spice market visits",
          "Indian Ocean seafood cuisine"
        ]),
        itinerary: JSON.stringify([
          {
            day: 1,
            title: "Nairobi to Mombasa - Fort Jesus",
            description: "Morning flight from Nairobi to Mombasa (1 hour). Transfer to hotel. Afternoon visit to Fort Jesus and Mombasa Old Town. Evening free time on the beach or optional cultural performance.",
            overnight: "Mombasa Beach Resort",
            meals: "Lunch, Dinner"
          },
          {
            day: 2,
            title: "Coastal Exploration & Marine Park",
            description: "Morning visit to Haller Park and Bombolulu Workshops. Afternoon snorkeling or boat trip in the marine park. Evening relaxation on the beach with optional dhow cruise.",
            overnight: "Mombasa Beach Resort",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 3,
            title: "Beach Time & Return to Nairobi",
            description: "Morning free time on the beach or optional activities. Afternoon flight back to Nairobi (1 hour). Transfer to your accommodation or airport.",
            overnight: "Not included",
            meals: "Breakfast, Lunch"
          }
        ]),
        included: JSON.stringify([
          "Domestic flights Nairobi-Mombasa return",
          "Airport transfers",
          "Hotel accommodation",
          "Meals as specified",
          "Fort Jesus entrance",
          "Cultural site visits",
          "Bottled water"
        ]),
        excluded: JSON.stringify([
          "International flights",
          "Visa fees",
          "Travel insurance",
          "Personal expenses",
          "Tips and gratuities",
          "Optional activities",
          "Marine park fees",
          "Items of personal nature"
        ]),
        importantInfo: JSON.stringify([
          "Mombasa has tropical climate",
          "Modest dress for cultural sites",
          "Swahili is the local language",
          "Beach activities weather dependent",
          "Mosquito protection recommended",
          "Carry sunscreen and hat"
        ]),
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800",
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
          "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800"
        ]),
        groupSize: "2-8 people",
        image: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800",
        status: 'active'
      },
      // Additional Tanzania Tours
      {
        id: 14,
        name: "7 Days Mount Kilimanjaro Climb - Machame Route",
        title: "7 Days Mount Kilimanjaro Climb - Machame Route",
        category: "adventure",
        location: "Tanzania - Arusha, Mount Kilimanjaro",
        duration: "7 Days",
        bestTime: "June to October (Dry season)",
        price: 1800,
        description: "Climb Africa's highest mountain with experienced guides on the scenic Machame Route.",
        longDescription: "Conquer Africa's highest peak on this challenging 7-day Machame Route expedition. Known as the 'Whiskey Route' for its scenic beauty, this trek offers diverse landscapes from rainforest to arctic conditions. With experienced guides, proper acclimatization, and support crew, you'll have the best chance of reaching Uhuru Peak (5,895m). This is not just a climb - it's a journey through five distinct climate zones and an unforgettable life achievement.",
        highlights: JSON.stringify([
          "Summit Uhuru Peak (5,895m)",
          "Five climate zones experience",
          "Machame Route scenic beauty",
          "Professional climbing team",
          "Proper acclimatization schedule",
          "Stunning equatorial glaciers",
          "African Rift Valley views",
          "Certificate of achievement"
        ]),
        itinerary: JSON.stringify([
          {
            day: 1,
            title: "Arusha to Machame Gate - Forest Camp",
            description: "Depart Arusha for Machame Gate (1,800m). Begin trek through rainforest (5-7 hours) to Machame Camp (3,000m). Afternoon acclimatization and camp briefing.",
            overnight: "Machame Camp",
            meals: "Lunch, Dinner"
          },
          {
            day: 2,
            title: "Machame Camp to Shira Camp",
            description: "Continue through heather and moorland (5-6 hours) to Shira Camp (3,840m). Afternoon rest and acclimatization. Stunning views of Kibo and surrounding peaks.",
            overnight: "Shira Camp",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 3,
            title: "Shira Camp to Lava Tower to Barranco Camp",
            description: "Trek to Lava Tower (4,630m) for acclimatization, then descend to Barranco Camp (3,950m). Cross Barranco Wall on Day 4. Total trekking 6-8 hours.",
            overnight: "Barranco Camp",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 4,
            title: "Barranco Camp to Karanga Camp",
            description: "Cross spectacular Barranco Wall (6-8 hours) to Karanga Camp (4,035m). Afternoon rest and preparation for final ascent. Amazing alpine scenery.",
            overnight: "Karanga Camp",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 5,
            title: "Karanga Camp to Barafu Camp",
            description: "Final acclimatization trek (3-4 hours) to Barafu Camp (4,640m). Early dinner and rest before midnight summit attempt. Last chance for good sleep.",
            overnight: "Barafu Camp",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 6,
            title: "Summit Day - Uhuru Peak to Mweka Camp",
            description: "Midnight departure for summit (6-8 hours to Uhuru Peak). Descend to Mweka Camp (3,100m) for rest. Longest and most challenging day.",
            overnight: "Mweka Camp",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 7,
            title: "Mweka Camp to Mweka Gate to Arusha",
            description: "Final descent through rainforest (3-4 hours) to Mweka Gate. Transfer back to Arusha. Celebration dinner and certificates.",
            overnight: "Not included",
            meals: "Breakfast, Lunch"
          }
        ]),
        included: JSON.stringify([
          "Professional climbing guides",
          "Mountain crew (cook, porters)",
          "National park fees and climbing permits",
          "Camping equipment and meals",
          "Emergency oxygen and medical kit",
          "Airport transfers",
          "Summit certificate",
          "All meals during trek"
        ]),
        excluded: JSON.stringify([
          "International flights",
          "Visa fees",
          "Travel insurance",
          "Personal expenses",
          "Tips and gratuities",
          "Personal climbing gear",
          "Items of personal nature"
        ]),
        importantInfo: JSON.stringify([
          "Requires excellent physical fitness",
          "Medical certificate mandatory",
          "Altitude sickness possible",
          "Weather extremely variable",
          "Minimum age 18 for climbing",
          "Maximum group size 12 climbers",
          "7-8 hours summit day"
        ]),
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
        ]),
        groupSize: "4-12 people",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
        status: 'active'
      },
      {
        id: 15,
        name: "3 Days Ngorongoro Crater Day Trip",
        title: "3 Days Ngorongoro Crater Day Trip",
        category: "wildlife",
        location: "Tanzania - Arusha, Ngorongoro Conservation Area",
        duration: "3 Days",
        bestTime: "June to September (Dry season)",
        price: 650,
        description: "Descend into the Ngorongoro Crater for incredible wildlife viewing in this natural amphitheater.",
        longDescription: "The Ngorongoro Crater is often called the 'Eighth Wonder of the World' - a collapsed volcano that forms the world's largest unflooded volcanic caldera. This 3-day safari focuses on the crater itself, where you can see the Big Five in a single day. The crater floor is a wildlife paradise with permanent water sources attracting thousands of animals. Combined with nearby cultural visits and scenic landscapes, this tour offers exceptional game viewing in one of Tanzania's most unique destinations.",
        highlights: JSON.stringify([
          "Ngorongoro Crater full-day safari",
          "Big Five in one day",
          "Over 25,000 animals in the crater",
          "Maasai cultural boma visit",
          "Olduvai Gorge (cradle of mankind)",
          "Empakai Crater views",
          "Flame-throwing Maasai ceremony"
        ]),
        itinerary: JSON.stringify([
          {
            day: 1,
            title: "Arusha to Ngorongoro - Maasai Village",
            description: "Early morning departure from Arusha (2 hours) to Ngorongoro. Visit a traditional Maasai village to learn about their culture and way of life. Afternoon game drive en route to lodge.",
            overnight: "Ngorongoro Safari Lodge",
            meals: "Lunch, Dinner"
          },
          {
            day: 2,
            title: "Full Day Ngorongoro Crater Safari",
            description: "Early morning descent into the crater (6-8 hours game drive). Spot lions, elephants, rhinos, buffalo, and thousands of other animals. Picnic lunch in the crater. Afternoon exploration of different habitats.",
            overnight: "Ngorongoro Safari Lodge",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 3,
            title: "Optional Activities & Return to Arusha",
            description: "Optional visit to Olduvai Gorge or Empakai Crater. Morning at leisure or optional activities. Afternoon transfer back to Arusha (2 hours).",
            overnight: "Not included",
            meals: "Breakfast, Lunch"
          }
        ]),
        included: JSON.stringify([
          "Ground transportation",
          "Crater entrance fees",
          "Professional guide",
          "Accommodation",
          "Meals as specified",
          "Cultural village visit",
          "Game drives",
          "Bottled water"
        ]),
        excluded: JSON.stringify([
          "International flights",
          "Visa fees",
          "Travel insurance",
          "Personal expenses",
          "Tips and gratuities",
          "Items of personal nature"
        ]),
        importantInfo: JSON.stringify([
          "Crater descent starts early (6 AM)",
          "Full day in crater (8+ hours)",
          "Weather can be cool in crater",
          "Binoculars essential for game viewing",
          "Maasai village visit is optional",
          "Conservancy fees apply"
        ]),
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
        ]),
        groupSize: "2-6 people",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
        status: 'active'
      },
      {
        id: 16,
        name: "4 Days Zanzibar Island Paradise",
        title: "4 Days Zanzibar Island Paradise",
        category: "cultural",
        location: "Tanzania - Arusha, Zanzibar (Stone Town & Beaches)",
        duration: "4 Days",
        bestTime: "June to October (Dry season)",
        price: 750,
        description: "Explore the spice islands of Zanzibar with historic Stone Town and pristine beaches.",
        longDescription: "Zanzibar, the legendary Spice Islands, offers a perfect blend of history, culture, and tropical paradise. This 4-day adventure takes you from the bustling historic Stone Town with its Arabic architecture and spice markets to the pristine white-sand beaches of the east coast. Experience the unique Swahili culture, visit spice plantations, relax on idyllic beaches, and enjoy fresh seafood while learning about the islands' rich history as a trading hub.",
        highlights: JSON.stringify([
          "Stone Town UNESCO World Heritage Site",
          "Spice plantation tours",
          " Jozani Forest red colobus monkeys",
          "Pristine white-sand beaches",
          "Swahili cultural experiences",
          "Fresh seafood and tropical cuisine",
          "Dhow boat sunset cruises",
          "Historic fort and palace visits"
        ]),
        itinerary: JSON.stringify([
          {
            day: 1,
            title: "Arusha to Zanzibar - Stone Town",
            description: "Morning flight from Arusha to Zanzibar (1.5 hours). Transfer to Stone Town hotel. Afternoon walking tour of historic Stone Town, visiting the fort, palace, and markets.",
            overnight: "Stone Town Boutique Hotel",
            meals: "Lunch, Dinner"
          },
          {
            day: 2,
            title: "Spice Island Exploration",
            description: "Full day spice plantation tour learning about cinnamon, cloves, and vanilla. Visit Jozani Forest for red colobus monkeys. Afternoon free time in Stone Town.",
            overnight: "Stone Town Boutique Hotel",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 3,
            title: "Transfer to Beach Resort",
            description: "Morning transfer to east coast beach resort (1 hour). Afternoon beach relaxation, snorkeling, or optional dhow boat trip. Evening seafood dinner.",
            overnight: "Zanzibar Beach Resort",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 4,
            title: "Beach Day & Return Flight",
            description: "Morning free time on the beach. Afternoon transfer to airport for flight back to Arusha (1.5 hours). Evening arrival in Arusha.",
            overnight: "Not included",
            meals: "Breakfast, Lunch"
          }
        ]),
        included: JSON.stringify([
          "Domestic flights Arusha-Zanzibar return",
          "Airport transfers",
          "Hotel accommodation",
          "Meals as specified",
          "Spice plantation tour",
          "Stone Town walking tour",
          "Bottled water",
          "Park entrance fees"
        ]),
        excluded: JSON.stringify([
          "International flights",
          "Visa fees",
          "Travel insurance",
          "Personal expenses",
          "Tips and gratuities",
          "Optional activities",
          "Items of personal nature"
        ]),
        importantInfo: JSON.stringify([
          "Zanzibar has Muslim culture - modest dress",
          "Spice tours very informative",
          "Beach resorts vary in quality",
          "Mosquito protection recommended",
          "Carry sunscreen and hat",
          "Swahili/Arabic influence everywhere"
        ]),
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
        ]),
        groupSize: "2-8 people",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
        status: 'active'
      },
      {
        id: 17,
        name: "3 Days Lake Manyara National Park Safari",
        title: "3 Days Lake Manyara National Park Safari",
        category: "wildlife",
        location: "Tanzania - Arusha, Lake Manyara National Park",
        duration: "3 Days",
        bestTime: "June to September (Dry season)",
        price: 580,
        description: "Experience Tanzania's tree-climbing lions and flamingo-filled lake in Lake Manyara.",
        longDescription: "Lake Manyara National Park is famous for its tree-climbing lions and the pink flamingos that line its shores. This 3-day safari explores the park's diverse habitats from acacia woodlands to the alkaline lake. The park is also known for its large baboon troops and over 400 bird species. Combined with visits to Maasai villages and the stunning Great Rift Valley escarpment, this tour offers a unique Tanzanian safari experience close to Arusha.",
        highlights: JSON.stringify([
          "Tree-climbing lions",
          "Flamingo colonies on the lake",
          "Large baboon troops",
          "Over 400 bird species",
          "Maasai village cultural visits",
          "Hot springs and ground water forest",
          "Great Rift Valley views",
          "Night game drives"
        ]),
        itinerary: JSON.stringify([
          {
            day: 1,
            title: "Arusha to Lake Manyara",
            description: "Morning departure from Arusha (2 hours) to Lake Manyara. Afternoon game drive exploring the park's diverse habitats and spotting wildlife. Visit the hot springs.",
            overnight: "Lake Manyara Safari Lodge",
            meals: "Lunch, Dinner"
          },
          {
            day: 2,
            title: "Full Day Lake Manyara Exploration",
            description: "Full day game drive focusing on tree-climbing lions and bird life. Visit the ground water forest and picnic by the lake. Optional Maasai village visit in the afternoon.",
            overnight: "Lake Manyara Safari Lodge",
            meals: "Breakfast, Lunch, Dinner"
          },
          {
            day: 3,
            title: "Final Game Drive & Return to Arusha",
            description: "Early morning game drive to catch wildlife at dawn. Breakfast and departure for Arusha (2 hours). Afternoon arrival in Arusha.",
            overnight: "Not included",
            meals: "Breakfast, Lunch"
          }
        ]),
        included: JSON.stringify([
          "Ground transportation",
          "Park entrance fees",
          "Professional guide",
          "Accommodation",
          "Meals as specified",
          "Game drives",
          "Cultural visits",
          "Bottled water"
        ]),
        excluded: JSON.stringify([
          "International flights",
          "Visa fees",
          "Travel insurance",
          "Personal expenses",
          "Tips and gratuities",
          "Items of personal nature"
        ]),
        importantInfo: JSON.stringify([
          "Tree-climbing lions are unique to Manyara",
          "Flamingo numbers vary by season",
          "Ground water forest is lush year-round",
          "Maasai village visit optional",
          "Binoculars essential for bird watching",
          "Park closes at 6 PM"
        ]),
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
        ]),
        groupSize: "2-6 people",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
        status: 'active'
      }
    ];

    for (const dest of tourism) {
      await db.runAsync(
        `INSERT OR REPLACE INTO tourism (
          id, name, title, category, location, duration, bestTime, price,
          description, longDescription, highlights, itinerary, included,
          excluded, importantInfo, images, groupSize, image, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          dest.id, dest.name, dest.title, dest.category, dest.location,
          dest.duration, dest.bestTime, dest.price, dest.description,
          dest.longDescription, dest.highlights, dest.itinerary,
          dest.included, dest.excluded, dest.importantInfo, dest.images,
          dest.groupSize, dest.image, dest.status
        ]
      );
      console.log(`  ✅ Added tour ID ${dest.id}: ${dest.title}`);
    }
    console.log(`  ✅ ${tourism.length} tourism destinations migrated\n`);

    // ============================================
    // 4. MIGRATE PARTNERS - WITH ORIGINAL IDS
    // ============================================
    console.log('🤝 Migrating Partners...');

    const partners = [
      {
        id: 1,
        name: 'Norrsken',
        logo: '/norrsken-logo.png',
        website: 'https://norrsken.org',
        status: 'active'
      },
      {
        id: 2,
        name: 'Kozo',
        logo: '/kozo-logo.png',
        website: '#',
        status: 'active'
      },
      {
        id: 3,
        name: 'Kivu Noire',
        logo: '/KivuNoire-Logo.png',
        website: '#',
        status: 'active'
      },
      {
        id: 4,
        name: 'Zaria Court',
        logo: '/ZariaCourt-logo.png',
        website: '#',
        status: 'active'
      }
    ];

    for (const partner of partners) {
      await db.runAsync(
        `INSERT OR REPLACE INTO partners (id, name, logo, website, status)
         VALUES (?, ?, ?, ?, ?)`,
        [partner.id, partner.name, partner.logo, partner.website, partner.status]
      );
      console.log(`  ✅ Added partner ID ${partner.id}: ${partner.name}`);
    }
    console.log(`  ✅ ${partners.length} partners migrated\n`);

    // ============================================
    // 5. MIGRATE STAFF - WITH ORIGINAL IDS
    // ============================================
    console.log('👥 Migrating Staff...');

    const staff = [
      {
        id: 1,
        name: 'Harindintwali Jean Paul',
        role: 'Chief Executive Officer',
        image: '/staff/ceo.jpeg',
        bio: 'Visionary leader with over 10 years of experience in event management and hospitality.',
        email: 'ceo@thehurbert.com',
        linkedin: '#',
        status: 'active'
      },
      {
        id: 2,
        name: 'Iyumva Danny',
        role: 'Chief Marketing Officer',
        image: '/staff/cmo.jpeg',
        bio: 'Marketing expert specializing in luxury brand experiences and customer engagement.',
        email: 'cmo@thehurbert.com',
        linkedin: '#',
        status: 'active'
      },
      {
        id: 3,
        name: 'Mbabazi Channy',
        role: 'Site Manager',
        image: '/staff/sm.jpeg',
        bio: 'Ensures flawless execution of all events with meticulous attention to detail.',
        email: 'manager@thehurbert.com',
        linkedin: '#',
        status: 'active'
      }
    ];

    for (const member of staff) {
      await db.runAsync(
        `INSERT OR REPLACE INTO staff (id, name, role, image, bio, email, linkedin, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [member.id, member.name, member.role, member.image, member.bio, member.email, member.linkedin, member.status]
      );
      console.log(`  ✅ Added staff ID ${member.id}: ${member.name}`);
    }
    console.log(`  ✅ ${staff.length} staff members migrated\n`);

    console.log('==========================================');
    console.log('🎉🎉🎉 MIGRATION COMPLETE! 🎉🎉🎉');
    console.log('==========================================');
    console.log('\n📊 Summary:');
    console.log(`   • Events: ${events.length}`);
    console.log(`   • Cars: ${cars.length}`);
    console.log(`   • Tourism: ${tourism.length}`);
    console.log(`   • Partners: ${partners.length}`);
    console.log(`   • Staff: ${staff.length}`);
    console.log('\n✅ All hardcoded data is now in the database with ORIGINAL IDs!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    process.exit();
  }
}

migrateData();