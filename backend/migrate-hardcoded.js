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
    // 3. MIGRATE TOURISM - WITH ORIGINAL IDS
    // ============================================
    console.log('🌍 Migrating Tourism Destinations...');

    const tourism = [
      {
        id: 201,
        title: 'Volcanoes National Park',
        category: 'National Park',
        location: 'Musanze',
        bestTime: 'June - September',
        image: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=800&q=80',
        description: 'Home to the endangered mountain gorillas, offering gorilla trekking experiences.',
        activities: JSON.stringify(['Gorilla Trekking', 'Hiking', 'Bird Watching']),
        duration: 'Full day',
        bestSeason: 'June to September',
        status: 'active'
      },
      {
        id: 202,
        title: 'Nyungwe National Park',
        category: 'National Park',
        location: 'Southwest Rwanda',
        bestTime: 'Year-round',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        description: 'One of Africa\'s oldest montane rainforests with canopy walk.',
        activities: JSON.stringify(['Canopy Walk', 'Chimpanzee Tracking', 'Hiking']),
        duration: '1-2 days',
        bestSeason: 'Year-round',
        status: 'active'
      },
      {
        id: 203,
        title: 'Akagera National Park',
        category: 'National Park',
        location: 'Eastern Province',
        bestTime: 'June - September',
        image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01c7e?w=800&q=80',
        description: 'Rwanda\'s Big Five safari destination with diverse wildlife.',
        activities: JSON.stringify(['Game Drives', 'Boat Safaris', 'Bird Watching']),
        duration: '1-2 days',
        bestSeason: 'June to September',
        status: 'active'
      },
      {
        id: 204,
        title: 'Lake Kivu',
        category: 'Lake',
        location: 'Western Province',
        bestTime: 'Year-round',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
        description: 'Beautiful lake with stunning beaches and island excursions.',
        activities: JSON.stringify(['Boat Rides', 'Kayaking', 'Beach Relaxation']),
        duration: '2-3 days',
        bestSeason: 'Year-round',
        status: 'active'
      },
      {
        id: 205,
        title: 'Lake Muhazi',
        category: 'Lake',
        location: 'Eastern Province',
        bestTime: 'Year-round',
        image: 'https://images.unsplash.com/photo-1578852318182-1c3dd2e9e8b0?w=800&q=80',
        description: 'Serene lake perfect for weekend getaways.',
        activities: JSON.stringify(['Boating', 'Fishing', 'Picnics']),
        duration: '1 day',
        bestSeason: 'Year-round',
        status: 'active'
      },
      {
        id: 206,
        title: 'Nyanza King\'s Palace Museum',
        category: 'Museum',
        location: 'Nyanza',
        bestTime: 'Year-round',
        image: 'https://images.unsplash.com/photo-1590518637260-5d6ad554f8d9?w=800&q=80',
        description: 'Traditional royal residence with cultural exhibits.',
        activities: JSON.stringify(['Cultural Tours', 'History Exhibits']),
        duration: '2-3 hours',
        bestSeason: 'Year-round',
        status: 'active'
      },
      {
        id: 207,
        title: 'Huye Ethnographic Museum',
        category: 'Museum',
        location: 'Huye',
        bestTime: 'Year-round',
        image: 'https://images.unsplash.com/photo-1566127992631-137a642a90f4?w=800&q=80',
        description: 'Premier museum of Rwandan culture with extensive artifacts.',
        activities: JSON.stringify(['Cultural Exhibits', 'Guided Tours']),
        duration: '2-3 hours',
        bestSeason: 'Year-round',
        status: 'active'
      }
    ];

    for (const dest of tourism) {
      await db.runAsync(
        `INSERT OR REPLACE INTO tourism (id, title, category, location, bestTime, image, description, activities, duration, bestSeason, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [dest.id, dest.title, dest.category, dest.location, dest.bestTime, dest.image, dest.description, 
         dest.activities, dest.duration, dest.bestSeason, dest.status]
      );
      console.log(`  ✅ Added tourism ID ${dest.id}: ${dest.title}`);
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