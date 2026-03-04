import { useEffect, useRef, useState } from 'react';
import { Calendar, Car, MapPin, Send, CheckCircle, User, Mail, Phone, MessageSquare, Users, MapPinned, CalendarDays, Settings, Fuel, Briefcase, Globe, Award, Heart, Shield, FileText, X } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';

const bookingTypes = [
  { id: 'event', label: 'Event Management', icon: Calendar },
  { id: 'car', label: 'Car Rental', icon: Car },
  { id: 'tour', label: 'Tourism Package', icon: MapPin },
];

// Event services offered - for multi-select dropdown
const eventServicesOptions = [
  { value: 'Sound System Setup', label: 'Sound System Setup' },
  { value: 'Professional Lighting', label: 'Professional Lighting' },
  { value: 'LED Screens', label: 'LED Screens' },
  { value: 'Cocktail Tables', label: 'Cocktail Tables' },
  { value: 'Round Tables', label: 'Round Tables' },
  { value: 'Event Decorations', label: 'Event Decorations' },
  { value: 'Smoke Machines', label: 'Smoke Machines' },
  { value: 'Professional Manpower', label: 'Professional Manpower' },
  { value: 'Wedding Planning', label: 'Wedding Planning' },
  { value: 'Corporate Meeting Management', label: 'Corporate Meeting Management' },
  { value: 'Stage Design', label: 'Stage Design' },
  { value: 'Photography & Videography', label: 'Photography & Videography' },
];

// Car rental additional services - for multi-select dropdown
const carServicesOptions = [
  { value: 'With Driver', label: 'With Professional Driver' },
  { value: 'Insurance', label: 'Comprehensive Insurance' },
  { value: 'Child Seat', label: 'Child Seat' },
  { value: 'GPS Navigation', label: 'GPS Navigation' },
  { value: 'WiFi Hotspot', label: 'WiFi Hotspot' },
  { value: 'Extra Driver', label: 'Additional Driver' },
  { value: 'Airport Pickup', label: 'Airport Pickup Service' },
  { value: '24/7 Roadside Assistance', label: '24/7 Roadside Assistance' },
  { value: 'Delivery to Hotel', label: 'Hotel Delivery' },
  { value: 'Cross-border Permit', label: 'Cross-border Permit' },
];

// Car models/brands available - for multi-select dropdown
const carModelsOptions = [
  { value: 'Toyota RAV4', label: 'Toyota RAV4' },
  { value: 'Toyota Land Cruiser Prado', label: 'Toyota Land Cruiser Prado' },
  { value: 'Range Rover Velar', label: 'Range Rover Velar' },
  { value: 'Mercedes C300', label: 'Mercedes C300' },
  { value: 'Hyundai Tucson', label: 'Hyundai Tucson' },
  { value: 'Coaster Bus', label: 'Coaster Bus' },
];

// Car types - for multi-select dropdown
const carTypesOptions = [
  { value: 'SUV', label: 'SUV' },
  { value: 'Sedan', label: 'Sedan' },
  { value: 'Luxury SUV', label: 'Luxury SUV' },
  { value: 'Bus', label: 'Bus' },
];

// Transmission types - for multi-select dropdown
const transmissionOptions = [
  { value: 'Automatic', label: 'Automatic' },
  { value: 'Manual', label: 'Manual' },
];

// Fuel types - for multi-select dropdown
const fuelTypesOptions = [
  { value: 'Petrol', label: 'Petrol' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Electric', label: 'Electric' },
  { value: 'Hybrid', label: 'Hybrid' },
];

// Tourism packages - for multi-select dropdown
const tourPackagesOptions = [
  { value: 'Gorilla Trekking', label: 'Gorilla Trekking' },
  { value: 'Akagera Safari', label: 'Akagera Safari' },
  { value: 'Nyungwe Canopy Walk', label: 'Nyungwe Canopy Walk' },
  { value: 'Lake Kivu Excursion', label: 'Lake Kivu Excursion' },
  { value: 'Cultural Heritage Tour', label: 'Cultural Heritage Tour' },
  { value: 'Volcanoes National Park', label: 'Volcanoes National Park' },
  { value: 'Chimpanzee Trekking', label: 'Chimpanzee Trekking' },
  { value: 'Kigali City Tour', label: 'Kigali City Tour' },
  { value: 'Eastern Province Safari', label: 'Eastern Province Safari' },
  { value: 'Wetland Bird Watching', label: 'Wetland Bird Watching' },
];

// Tourism additional services - for multi-select dropdown
const tourServicesOptions = [
  { value: 'Professional Guide', label: 'Professional Tour Guide' },
  { value: 'Meals Included', label: 'All Meals Included' },
  { value: 'Private Transport', label: 'Private Transport' },
  { value: 'Accommodation', label: 'Accommodation' },
  { value: 'Airport Transfer', label: 'Airport Transfer' },
  { value: 'Travel Insurance', label: 'Travel Insurance' },
  { value: 'Photography Package', label: 'Photography Package' },
  { value: 'Cultural Performance', label: 'Cultural Performance' },
  { value: 'Gorilla Permit', label: 'Gorilla Permit (if applicable)' },
  { value: 'Porter Service', label: 'Porter Service (trekking)' },
];

// Contact Information
const CONTACT_INFO = {
  phone: '0782169162',
  whatsapp: '250782169162',
  email: 'thehurbertltd@gmail.com',
  address: '1 KN 78 St, Kigali',
};

// Terms and Conditions content for each service
const termsContent = {
  event: {
    title: 'Event Management Terms and Conditions',
    content: `THE HURBERT - Event Management Terms

1. BOOKING CONFIRMATION
   • Your booking is confirmed upon receipt of 50% deposit
   • Full payment due 7 days before event date
   • All bookings subject to availability

2. CANCELLATION POLICY
   • Free cancellation up to 30 days before event
   • 50% refund for cancellation 15-30 days before
   • No refund for cancellation within 14 days
   • Deposits are non-refundable after 14 days

3. SERVICES
   • All services are subject to availability at time of booking
   • Changes must be requested in writing 7 days in advance
   • Additional charges may apply for overtime or last-minute changes
   • Equipment specifications may vary based on availability

4. LIABILITY
   • THE HURBERT carries full liability insurance
   • Client responsible for venue rules compliance
   • Force majeure clause applies for circumstances beyond control
   • THE HURBERT not liable for third-party vendor issues

5. PAYMENT
   • Payments accepted via bank transfer, mobile money (Momo)
   • All prices in USD or equivalent RWF at current exchange rate
   • VAT (18%) included where applicable
   • Late payments subject to 5% penalty per week

6. CLIENT RESPONSIBILITIES
   • Provide accurate guest count 7 days prior
   • Ensure venue access for setup
   • Obtain necessary permits and licenses
   • Provide dietary requirements 5 days in advance

7. POST-EVENT
   • Feedback form will be sent within 3 days
   • Photos/videos delivered within 14 days
   • Equipment removal within agreed timeframe`,
  },
  car: {
    title: 'Car Rental Terms and Conditions',
    content: `THE HURBERT - Car Rental Terms

1. RENTAL REQUIREMENTS
   • Valid driver's license required (minimum 2 years)
   • Minimum age: 25 years
   • International driving permit recommended for non-Rwandan licenses
   • Passport or national ID required for verification

2. INSURANCE & SECURITY
   • Comprehensive third-party insurance included
   • Security deposit required: $500 (standard) / $1000 (luxury)
   • Excess liability: $500 per incident
   • CDW (Collision Damage Waiver) optional at $15/day

3. FUEL POLICY
   • Vehicle provided with full tank
   • Return with full tank or fuel charges apply ($2/L)
   • Pre-paid fuel option available at $50 for 1/2 tank

4. MILEAGE
   • Unlimited mileage for all vehicles
   • Cross-border travel requires prior approval and additional fees
   • GPS tracking for all vehicles

5. DRIVER SERVICE
   • Professional drivers available at $30/day
   • Driver hours: 8:00 AM - 8:00 PM standard
   • Overtime charges: $10/hour after 8:00 PM
   • Driver accommodation required for multi-day trips

6. CANCELLATION
   • Free cancellation up to 48 hours before pickup
   • 50% charge within 48 hours of pickup
   • No-show: 100% charge
   • Early returns: No refund for unused days

7. DAMAGE POLICY
   • Report any damage immediately
   • Customer responsible for damage during rental period
   • Theft protection included with police report
   • Interior smoking fine: $250

8. ADDITIONAL DRIVERS
   • Additional drivers allowed at $10/day
   • Must meet same requirements as primary driver
   • Maximum 3 additional drivers per vehicle`,
  },
  tour: {
    title: 'Tourism Package Terms and Conditions',
    content: `THE HURBERT - Tourism Terms

1. PACKAGE INCLUSIONS
   • As specified in package description
   • Entrance fees and permits included (including gorilla permits)
   • Meals as specified in itinerary
   • Accommodation as booked
   • Professional English-speaking guide
   • Ground transportation in private vehicle

2. EXCLUSIONS
   • International flights
   • Travel insurance (STRONGLY recommended)
   • Visa fees ($50 for single entry)
   • Personal expenses (souvenirs, laundry, etc.)
   • Tips and gratuities
   • Alcoholic beverages

3. BOOKING & PAYMENT
   • 30% deposit to confirm booking
   • Balance due 30 days before travel
   • Gorilla permits require FULL PAYMENT at time of booking
   • Permits are non-transferable and non-refundable
   • Group discounts available for 6+ pax

4. CANCELLATION POLICY
   • 60+ days before departure: 90% refund
   • 30-59 days before departure: 50% refund
   • 15-29 days before departure: 25% refund
   • 0-14 days before departure: No refund
   • Gorilla permits: NON-REFUNDABLE under any circumstances

5. HEALTH & SAFETY
   • Travel insurance with medical evacuation STRONGLY recommended
   • Yellow fever vaccination certificate REQUIRED for entry
   • Malaria prophylaxis recommended
   • COVID-19 requirements as per current regulations
   • Inform us of any medical conditions in advance

6. ITINERARY CHANGES
   • We reserve the right to modify due to circumstances
   • Equivalent alternatives provided
   • No refund for voluntary changes
   • Weather-related changes accommodated where possible

7. GORILLA TREKKING SPECIFIC
   • Age limit: 15 years and above
   • Physical fitness required (can take 2-6 hours)
   • Porter service available at $20
   • Maximum 1 hour with gorillas once located
   • No flash photography allowed

8. RESPONSIBILITY
   • THE HURBERT acts as intermediary for services
   • Not liable for acts of God, weather, political instability
   • Clients responsible for valid passport and visas
   • Baggage at owner's risk throughout tour`,
  },
};

// Helper functions to format messages
const formatWhatsAppMessage = (data: any, bookingNumber: string) => {
  let message = `*New Booking Request - THE HURBERT*\n\n`;
  message += `*Booking Reference:* ${bookingNumber}\n`;
  message += `*Service:* ${data.service_type}\n\n`;
  message += `*Customer:* ${data.fullName}\n`;
  message += `*Email:* ${data.email}\n`;
  message += `*Phone:* ${data.phone || 'Not provided'}\n`;
  
  // Add service-specific details
  if (data.service_id === 1) {
    message += `\n*EVENT DETAILS*\n`;
    message += `Event Type: ${data.eventType}\n`;
    message += `Event Start Date: ${data.startDate}\n`;
    message += `Event End Date: ${data.endDate}\n`;
    message += `Guests: ${data.numberOfGuests}\n`;
    message += `Venue: ${data.venuePreference || 'Not specified'}\n`;
    if (data.selectedServices?.length) {
      message += `\n*Services:*\n`;
      data.selectedServices.forEach((s: string) => {
        message += `• ${s}\n`;
      });
    }
  } else if (data.service_id === 2) {
    message += `\n*CAR RENTAL DETAILS*\n`;
    message += `Pickup Date: ${data.pickupDate}\n`;
    message += `Pickup Time: ${data.pickupTime}\n`;
    message += `Return Date: ${data.returnDate}\n`;
    message += `Return Time: ${data.returnTime}\n`;
    message += `Location: ${data.pickupLocation}\n`;
    if (data.selectedCarModels?.length) {
      message += `\n*Car Models:*\n`;
      data.selectedCarModels.forEach((m: string) => {
        message += `• ${m}\n`;
      });
    }
    if (data.selectedCarTypes?.length) {
      message += `\n*Car Types:*\n`;
      data.selectedCarTypes.forEach((t: string) => {
        message += `• ${t}\n`;
      });
    }
    message += `\nNumber of Cars: ${data.numberOfCars}\n`;
    if (data.selectedServices?.length) {
      message += `\n*Additional Services:*\n`;
      data.selectedServices.forEach((s: string) => {
        message += `• ${s}\n`;
      });
    }
  } else if (data.service_id === 3) {
    message += `\n*TOUR DETAILS*\n`;
    if (data.selectedPackages?.length) {
      message += `\n*Packages:*\n`;
      data.selectedPackages.forEach((p: string) => {
        message += `• ${p}\n`;
      });
    }
    message += `\nTour Start Date: ${data.startDate}\n`;
    message += `Tour End Date: ${data.endDate}\n`;
    message += `Travelers: ${data.numberOfTravelers}\n`;
    if (data.selectedServices?.length) {
      message += `\n*Additional Services:*\n`;
      data.selectedServices.forEach((s: string) => {
        message += `• ${s}\n`;
      });
    }
  }
  
  message += `\n*Message:* ${data.message || data.specialRequests || 'No additional message'}`;
  
  return message;
};

const formatEmailMessage = (data: any, bookingNumber: string) => {
  let body = `NEW BOOKING REQUEST - ${data.service_type}\n`;
  body += `Booking Reference: ${bookingNumber}\n\n`;
  body += `CUSTOMER DETAILS:\n`;
  body += `Name: ${data.fullName}\n`;
  body += `Email: ${data.email}\n`;
  body += `Phone: ${data.phone || 'Not provided'}\n\n`;

  if (data.service_id === 1) {
    body += `EVENT DETAILS:\n`;
    body += `Event Type: ${data.eventType}\n`;
    body += `Event Start Date: ${data.startDate}\n`;
    body += `Event End Date: ${data.endDate}\n`;
    body += `Number of Guests: ${data.numberOfGuests}\n`;
    body += `Venue: ${data.venuePreference || 'Not specified'}\n`;
    if (data.selectedServices?.length) {
      body += `\nSelected Services:\n`;
      data.selectedServices.forEach((s: string) => {
        body += `• ${s}\n`;
      });
    }
  } else if (data.service_id === 2) {
    body += `CAR RENTAL DETAILS:\n`;
    body += `Pickup Date: ${data.pickupDate}\n`;
    body += `Pickup Time: ${data.pickupTime}\n`;
    body += `Return Date: ${data.returnDate}\n`;
    body += `Return Time: ${data.returnTime}\n`;
    body += `Location: ${data.pickupLocation}\n`;
    if (data.selectedCarModels?.length) {
      body += `\nCar Models:\n`;
      data.selectedCarModels.forEach((m: string) => {
        body += `• ${m}\n`;
      });
    }
    if (data.selectedCarTypes?.length) {
      body += `\nCar Types:\n`;
      data.selectedCarTypes.forEach((t: string) => {
        body += `• ${t}\n`;
      });
    }
    body += `\nNumber of Cars: ${data.numberOfCars}\n`;
    if (data.selectedServices?.length) {
      body += `\nAdditional Services:\n`;
      data.selectedServices.forEach((s: string) => {
        body += `• ${s}\n`;
      });
    }
  } else if (data.service_id === 3) {
    body += `TOUR DETAILS:\n`;
    if (data.selectedPackages?.length) {
      body += `\nTour Packages:\n`;
      data.selectedPackages.forEach((p: string) => {
        body += `• ${p}\n`;
      });
    }
    body += `\nTour Start Date: ${data.startDate}\n`;
    body += `Tour End Date: ${data.endDate}\n`;
    body += `Travelers: ${data.numberOfTravelers}\n`;
    if (data.selectedServices?.length) {
      body += `\nAdditional Services:\n`;
      data.selectedServices.forEach((s: string) => {
        body += `• ${s}\n`;
      });
    }
  }
  
  body += `\nAdditional Message:\n${data.message || data.specialRequests || 'No additional message'}\n\n`;
  body += `---\nSent from THE HURBERT website.`;
  
  return body;
};

export default function Booking() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedType, setSelectedType] = useState('event');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [bookingNumber, setBookingNumber] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // ============================================
  // EVENT FORM STATE
  // ============================================
  const [eventForm, setEventForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    eventType: '',
    eventStartDate: '',
    eventEndDate: '',
    numberOfGuests: 50,
    venuePreference: '',
    selectedServices: [] as string[],
    message: '',
  });

  // ============================================
  // CAR RENTAL FORM STATE - Multi-select for all options
  // ============================================
  const [carForm, setCarForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    pickupLocation: 'Kigali International Airport',
    pickupDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: '',
    selectedCarModels: [] as string[],
    selectedCarTypes: [] as string[],
    selectedTransmissions: [] as string[],
    selectedFuelTypes: [] as string[],
    numberOfCars: 1,
    selectedServices: [] as string[],
    message: '',
  });

  // ============================================
  // TOURISM FORM STATE - Multi-select for all options
  // ============================================
  const [tourForm, setTourForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    selectedPackages: [] as string[],
    tourStartDate: '',
    tourEndDate: '',
    numberOfTravelers: 2,
    selectedServices: [] as string[],
    specialRequests: '',
  });

  // Store submitted data for WhatsApp/Email
  const [submittedData, setSubmittedData] = useState<any>({});

  // ============================================
  // VALIDATION FUNCTIONS
  // ============================================
  const validateEventForm = () => {
    if (!eventForm.fullName) return false;
    if (!eventForm.email) return false;
    if (!eventForm.phone) return false;
    if (!eventForm.eventType) return false;
    if (!eventForm.eventStartDate) return false;
    if (!eventForm.eventEndDate) return false;
    if (!eventForm.numberOfGuests) return false;
    return true;
  };

  const validateCarForm = () => {
    if (!carForm.fullName) return false;
    if (!carForm.email) return false;
    if (!carForm.phone) return false;
    if (!carForm.pickupDate) return false;
    if (!carForm.pickupTime) return false;
    if (!carForm.returnDate) return false;
    if (!carForm.returnTime) return false;
    if (!carForm.numberOfCars) return false;
    return true;
  };

  const validateTourForm = () => {
    if (!tourForm.fullName) return false;
    if (!tourForm.email) return false;
    if (!tourForm.phone) return false;
    if (tourForm.selectedPackages.length === 0) return false;
    if (!tourForm.tourStartDate) return false;
    if (!tourForm.tourEndDate) return false;
    if (!tourForm.numberOfTravelers) return false;
    return true;
  };

  // ============================================
  // FORM HANDLERS
  // ============================================
  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEventServicesChange = (selected: any) => {
    setEventForm(prev => ({
      ...prev,
      selectedServices: selected ? selected.map((item: any) => item.value) : []
    }));
  };

  // Car form handlers
  const handleCarChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCarForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCarModelsChange = (selected: any) => {
    setCarForm(prev => ({
      ...prev,
      selectedCarModels: selected ? selected.map((item: any) => item.value) : []
    }));
  };

  const handleCarTypesChange = (selected: any) => {
    setCarForm(prev => ({
      ...prev,
      selectedCarTypes: selected ? selected.map((item: any) => item.value) : []
    }));
  };

  const handleTransmissionsChange = (selected: any) => {
    setCarForm(prev => ({
      ...prev,
      selectedTransmissions: selected ? selected.map((item: any) => item.value) : []
    }));
  };

  const handleFuelTypesChange = (selected: any) => {
    setCarForm(prev => ({
      ...prev,
      selectedFuelTypes: selected ? selected.map((item: any) => item.value) : []
    }));
  };

  const handleCarServicesChange = (selected: any) => {
    setCarForm(prev => ({
      ...prev,
      selectedServices: selected ? selected.map((item: any) => item.value) : []
    }));
  };

  // Tour form handlers
  const handleTourChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTourForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTourPackagesChange = (selected: any) => {
    setTourForm(prev => ({
      ...prev,
      selectedPackages: selected ? selected.map((item: any) => item.value) : []
    }));
  };

  const handleTourServicesChange = (selected: any) => {
    setTourForm(prev => ({
      ...prev,
      selectedServices: selected ? selected.map((item: any) => item.value) : []
    }));
  };

  const handlePhoneChange = (value: string, country: any, field: string) => {
    if (selectedType === 'event') {
      setEventForm((prev) => ({ ...prev, phone: value }));
    } else if (selectedType === 'car') {
      setCarForm((prev) => ({ ...prev, phone: value }));
    } else if (selectedType === 'tour') {
      setTourForm((prev) => ({ ...prev, phone: value }));
    }
  };

  const resetAllForms = () => {
    setEventForm({
      fullName: '', email: '', phone: '', eventType: '', eventStartDate: '', eventEndDate: '',
      numberOfGuests: 50, venuePreference: '', selectedServices: [], message: ''
    });
    
    setCarForm({
      fullName: '', email: '', phone: '', pickupLocation: 'Kigali International Airport',
      pickupDate: '', pickupTime: '', returnDate: '', returnTime: '',
      selectedCarModels: [], selectedCarTypes: [], selectedTransmissions: [],
      selectedFuelTypes: [], numberOfCars: 1, selectedServices: [], message: ''
    });
    
    setTourForm({
      fullName: '', email: '', phone: '', selectedPackages: [], tourStartDate: '',
      tourEndDate: '', numberOfTravelers: 2, selectedServices: [], specialRequests: ''
    });
    
    setAgreeTerms(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      alert('Please agree to the Terms and Conditions to proceed.');
      return;
    }

    // Validate based on selected service
    let isValid = false;
    if (selectedType === 'event') {
      isValid = validateEventForm();
      if (!isValid) {
        alert('Please fill in all required fields for Event Management.');
        return;
      }
    } else if (selectedType === 'car') {
      isValid = validateCarForm();
      if (!isValid) {
        alert('Please fill in all required fields for Car Rental.');
        return;
      }
    } else if (selectedType === 'tour') {
      isValid = validateTourForm();
      if (!isValid) {
        alert('Please fill in all required fields for Tourism Package.');
        return;
      }
    }
    
    setIsSubmitting(true);

    const serviceLabel = bookingTypes.find(t => t.id === selectedType)?.label || 'Booking';
    
    // Prepare data based on selected service
    let completeData: any = {
      service_type: serviceLabel,
      service_id: selectedType === 'car' ? 2 : selectedType === 'tour' ? 3 : 1,
    };

    if (selectedType === 'event') {
      completeData = { ...completeData, ...eventForm };
    } else if (selectedType === 'car') {
      completeData = { ...completeData, ...carForm };
    } else if (selectedType === 'tour') {
      completeData = { ...completeData, ...tourForm };
    }

    setSubmittedData(completeData);

    // ========================================
    // SAVE TO DATABASE - ADMIN DASHBOARD
    // ========================================
    try {
      // First, create or find customer
      const customerResponse = await fetch('http://localhost:5000/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: completeData.fullName,
          email: completeData.email,
          phone: completeData.phone || '',
          country: 'Rwanda'
        })
      });
      
      const customerData = await customerResponse.json();
      const customerId = customerData.id || 1;

      // Calculate price based on service type
      let totalPrice = 0;
      if (selectedType === 'event') {
        totalPrice = 5000; // Base event price
      } else if (selectedType === 'car') {
        totalPrice = 85 * (carForm.numberOfCars || 1);
      } else if (selectedType === 'tour') {
        totalPrice = 150 * (tourForm.numberOfTravelers || 1);
      }

      const bookingData = {
        customerId: customerId,
        serviceId: completeData.service_id,
        startDate: selectedType === 'event' ? eventForm.eventStartDate : selectedType === 'car' ? carForm.pickupDate : tourForm.tourStartDate,
        endDate: selectedType === 'event' ? eventForm.eventEndDate : selectedType === 'car' ? carForm.returnDate : tourForm.tourEndDate,
        guests: selectedType === 'event' ? eventForm.numberOfGuests : selectedType === 'tour' ? tourForm.numberOfTravelers : carForm.numberOfCars,
        totalPrice: totalPrice,
        status: 'pending',
        paymentStatus: 'unpaid',
        notes: selectedType === 'event' ? eventForm.message : selectedType === 'car' ? carForm.message : tourForm.specialRequests,
        ...(selectedType === 'car' && {
          selectedCarModels: carForm.selectedCarModels,
          selectedCarTypes: carForm.selectedCarTypes,
          selectedTransmissions: carForm.selectedTransmissions,
          selectedFuelTypes: carForm.selectedFuelTypes,
          selectedServices: carForm.selectedServices,
          pickupLocation: carForm.pickupLocation,
          pickupTime: carForm.pickupTime,
          returnTime: carForm.returnTime
        }),
        ...(selectedType === 'tour' && {
          selectedPackages: tourForm.selectedPackages,
          selectedServices: tourForm.selectedServices
        }),
        ...(selectedType === 'event' && {
          eventType: eventForm.eventType,
          venuePreference: eventForm.venuePreference,
          selectedServices: eventForm.selectedServices
        })
      };

      const bookingResponse = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const bookingResult = await bookingResponse.json();
      const newBookingNumber = bookingResult.bookingNumber || 'REF-' + Date.now();

      setBookingNumber(newBookingNumber);

      // ========================================
      // SEND TO WHATSAPP (Optional - will work when you set up)
      // ========================================
      try {
        const whatsappMessage = formatWhatsAppMessage(completeData, newBookingNumber);
        
        await fetch('http://localhost:5000/api/send-whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: CONTACT_INFO.whatsapp,
            message: whatsappMessage
          })
        });
      } catch (whatsappError) {
        console.error('WhatsApp send failed (optional):', whatsappError);
        // Don't block submission if WhatsApp fails
      }

      // ========================================
      // SEND TO EMAIL (Optional - will work when you set up)
      // ========================================
      try {
        const emailSubject = `New Booking Request - ${serviceLabel} - ${newBookingNumber}`;
        const emailBody = formatEmailMessage(completeData, newBookingNumber);
        
        await fetch('http://localhost:5000/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: CONTACT_INFO.email,
            subject: emailSubject,
            body: emailBody
          })
        });
      } catch (emailError) {
        console.error('Email send failed (optional):', emailError);
        // Don't block submission if email fails
      }

      // ========================================
      // SHOW SUCCESS
      // ========================================
      setSubmitSuccess(true);
      resetAllForms();

    } catch (error) {
      console.error('Error saving booking:', error);
      alert('There was an error. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom styles for react-select to match our theme
  const selectStyles = {
    control: (provided: any) => ({
      ...provided,
      borderColor: '#e5e7eb',
      borderRadius: '0.5rem',
      padding: '0.125rem 0',
      fontSize: '0.75rem',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#c9a86c',
      },
      '&:focus': {
        borderColor: '#c9a86c',
        boxShadow: '0 0 0 1px #c9a86c',
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      fontSize: '0.75rem',
      backgroundColor: state.isSelected ? '#c9a86c' : state.isFocused ? '#fef3e2' : 'white',
      color: state.isSelected ? 'white' : 'black',
      '&:hover': {
        backgroundColor: state.isSelected ? '#c9a86c' : '#fef3e2',
      },
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: '#fef3e2',
      borderRadius: '0.375rem',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      fontSize: '0.7rem',
      color: '#c9a86c',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: '#c9a86c',
      '&:hover': {
        backgroundColor: '#c9a86c',
        color: 'white',
      },
    }),
  };

  return (
    <section
      id="booking"
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 bg-gray-50 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #c9a86c 1px, transparent 0)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Content */}
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-12'
            }`}
          >
            <span
              className="text-[#c9a86c] text-sm font-semibold uppercase tracking-[0.3em] mb-4 block"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Book Now
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold text-black mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Reserve Your Experience
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Ready to plan your next event, rent a vehicle, or explore Rwanda?
              Select a service below and fill out the form.
            </p>

            {/* Booking Type Cards */}
            <div className="space-y-4 mb-8">
              {bookingTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.id}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                      selectedType === type.id
                        ? 'border-[#c9a86c] bg-[#c9a86c]/5'
                        : 'border-gray-200 bg-white hover:border-[#c9a86c]/50 hover:shadow-md'
                    }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#c9a86c] flex items-center justify-center shadow-md">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-black text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {type.label}
                        </h3>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-[#c9a86c] flex items-center justify-center">
                        {selectedType === type.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#c9a86c]" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Contact Info */}
            <div className="p-5 bg-gradient-to-br from-gray-100 to-white rounded-xl text-black border border-gray-200">
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <Award className="w-4 h-4 text-[#c9a86c]" />
                Need Immediate Assistance?
              </h4>
              <div className="space-y-2 text-xs">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#c9a86c]" />
                  <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-[#c9a86c] transition-colors">
                    {CONTACT_INFO.phone}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#c9a86c]" />
                  <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-[#c9a86c] transition-colors">
                    {CONTACT_INFO.email}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <MapPinned className="w-4 h-4 text-[#c9a86c]" />
                  <span>{CONTACT_INFO.address}</span>
                </p>
              </div>
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent('Hello THE HURBERT! I would like to make a booking inquiry.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full bg-green-500 text-white py-2 rounded-lg font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 hover:bg-green-600"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <MessageSquare className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Right Form */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Form Header */}
              <div className="bg-[#c9a86c] px-6 py-4">
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {selectedType === 'event' && 'Event Management'}
                  {selectedType === 'car' && 'Car Rental'}
                  {selectedType === 'tour' && 'Tourism Package'}
                </h3>
              </div>

              {/* Hidden anchors for scrolling */}
              <div id="event-booking" className="scroll-mt-24"></div>
              <div id="car-booking" className="scroll-mt-24"></div>
              <div id="tourism-booking" className="scroll-mt-24"></div>

              {submitSuccess ? (
                <div className="text-center py-12 px-6">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-bold text-black mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Booking Request Sent!
                  </h3>
                  {bookingNumber && (
                    <p className="text-xs bg-gray-100 inline-block px-3 py-1 rounded-full mb-3">
                      Booking Reference: <span className="font-bold">{bookingNumber}</span>
                    </p>
                  )}
                  <p className="text-gray-600 text-xs mb-5">
                    We've received your request and will contact you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitSuccess(false);
                      setSelectedType('event');
                    }}
                    className="text-[#c9a86c] text-xs hover:underline"
                  >
                    Make another booking
                  </button>
                </div>
              ) : (
                <div className="p-5">
                  {selectedType === 'event' && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Personal Information */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-black flex items-center gap-2 text-xs border-b border-gray-100 pb-1">
                          <User className="w-3 h-3 text-[#c9a86c]" />
                          Your Information
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            name="fullName"
                            value={eventForm.fullName}
                            onChange={handleEventChange}
                            placeholder="Full Name *"
                            required
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#c9a86c] focus:border-transparent"
                          />
                          <input
                            type="email"
                            name="email"
                            value={eventForm.email}
                            onChange={handleEventChange}
                            placeholder="Email *"
                            required
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#c9a86c] focus:border-transparent"
                          />
                        </div>
                        <PhoneInput
                          country={'rw'}
                          value={eventForm.phone}
                          onChange={(value, country) => handlePhoneChange(value, country, 'event')}
                          inputClass="!w-full !pl-10 !py-2 !text-xs !border-gray-200 !rounded-lg focus:!ring-1 focus:!ring-[#c9a86c]"
                          buttonClass="!border-gray-200 !rounded-l-lg"
                          placeholder="Phone number *"
                          required
                          enableSearch={true}
                          searchPlaceholder="Search country..."
                        />
                      </div>

                      {/* Event Details */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-black flex items-center gap-2 text-xs border-b border-gray-100 pb-1">
                          <Calendar className="w-3 h-3 text-[#c9a86c]" />
                          Event Details
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <select
                            name="eventType"
                            value={eventForm.eventType}
                            onChange={handleEventChange}
                            required
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#c9a86c]"
                          >
                            <option value="">Event Type *</option>
                            <option value="wedding">Wedding</option>
                            <option value="corporate">Corporate Meeting</option>
                            <option value="conference">Conference</option>
                            <option value="birthday">Birthday Party</option>
                            <option value="gala">Gala Dinner</option>
                          </select>
                          <input
                            type="text"
                            name="venuePreference"
                            value={eventForm.venuePreference}
                            onChange={handleEventChange}
                            placeholder="Venue (optional)"
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#c9a86c]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Event Start Date *</label>
                            <input
                              type="date"
                              name="eventStartDate"
                              value={eventForm.eventStartDate}
                              onChange={handleEventChange}
                              required
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#c9a86c]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Event End Date *</label>
                            <input
                              type="date"
                              name="eventEndDate"
                              value={eventForm.eventEndDate}
                              onChange={handleEventChange}
                              required
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#c9a86c]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Number of Guests *</label>
                          <input
                            type="number"
                            name="numberOfGuests"
                            value={eventForm.numberOfGuests}
                            onChange={handleEventChange}
                            placeholder="Number of Guests *"
                            required
                            min="1"
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#c9a86c]"
                          />
                        </div>
                      </div>

                      {/* Services Selection - Multi-select dropdown */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-black flex items-center gap-2 text-xs border-b border-gray-100 pb-1">
                          <Briefcase className="w-3 h-3 text-[#c9a86c]" />
                          Services You Need (Select multiple)
                        </h4>
                        <Select
                          isMulti
                          options={eventServicesOptions}
                          value={eventServicesOptions.filter(option => 
                            eventForm.selectedServices.includes(option.value)
                          )}
                          onChange={handleEventServicesChange}
                          placeholder="Select services..."
                          className="text-xs"
                          styles={selectStyles}
                          closeMenuOnSelect={false}
                          blurInputOnSelect={false}
                        />
                      </div>

                      {/* Additional Message */}
                      <textarea
                        name="message"
                        value={eventForm.message}
                        onChange={handleEventChange}
                        rows={2}
                        placeholder="Additional information..."
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#c9a86c] resize-none"
                      />

                      {/* Terms and Conditions - Above Submit Button */}
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <button
                            type="button"
                            onClick={() => setShowTerms(true)}
                            className="text-xs text-[#c9a86c] hover:underline flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3" />
                            View Terms and Conditions
                          </button>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            required
                            className="w-3 h-3 text-[#c9a86c] rounded border-gray-300 focus:ring-[#c9a86c]"
                          />
                          <span className="text-xs text-gray-600">
                            I agree to the Terms and Conditions *
                          </span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#c9a86c] text-white py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wider hover:bg-black transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? 'Processing...' : 'Submit Booking'}
                      </button>
                    </form>
                  )}

                  {selectedType === 'car' && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Personal Information */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-black flex items-center gap-2 text-xs border-b border-gray-100 pb-1">
                          <User className="w-3 h-3 text-[#c9a86c]" />
                          Your Information
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            name="fullName"
                            value={carForm.fullName}
                            onChange={handleCarChange}
                            placeholder="Full Name *"
                            required
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#c9a86c]"
                          />
                          <input
                            type="email"
                            name="email"
                            value={carForm.email}
                            onChange={handleCarChange}
                            placeholder="Email *"
                            required
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#c9a86c]"
                          />
                        </div>
                        <PhoneInput
                          country={'rw'}
                          value={carForm.phone}
                          onChange={(value, country) => handlePhoneChange(value, country, 'car')}
                          inputClass="!w-full !pl-10 !py-2 !text-xs !border-gray-200 !rounded-lg focus:!ring-1 focus:!ring-[#c9a86c]"
                          buttonClass="!border-gray-200 !rounded-l-lg"
                          placeholder="Phone number *"
                          required
                          enableSearch={true}
                        />
                      </div>

                      {/* Pickup & Return Details */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-black flex items-center gap-2 text-xs border-b border-gray-100 pb-1">
                          <CalendarDays className="w-3 h-3 text-[#c9a86c]" />
                          Pickup & Return Details
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Pickup Date *</label>
                            <input
                              type="date"
                              name="pickupDate"
                              value={carForm.pickupDate}
                              onChange={handleCarChange}
                              required
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#c9a86c]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Pickup Time *</label>
                            <input
                              type="time"
                              name="pickupTime"
                              value={carForm.pickupTime}
                              onChange={handleCarChange}
                              required
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#c9a86c]"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Return Date *</label>
                            <input
                              type="date"
                              name="returnDate"
                              value={carForm.returnDate}
                              onChange={handleCarChange}
                              required
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#c9a86c]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Return Time *</label>
                            <input
                              type="time"
                              name="returnTime"
                              value={carForm.returnTime}
                              onChange={handleCarChange}
                              required
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#c9a86c]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Pickup Location</label>
                          <input
                            type="text"
                            name="pickupLocation"
                            value={carForm.pickupLocation}
                            onChange={handleCarChange}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#c9a86c]"
                            placeholder="e.g., Kigali International Airport"
                          />
                        </div>
                      </div>

                      {/* Car Models - Multi-select */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-black flex items-center gap-2 text-xs">
                          <Car className="w-3 h-3 text-[#c9a86c]" />
                          Car Models (Select multiple)
                        </h4>
                        <Select
                          isMulti
                          options={carModelsOptions}
                          value={carModelsOptions.filter(option => 
                            carForm.selectedCarModels.includes(option.value)
                          )}
                          onChange={handleCarModelsChange}
                          placeholder="Select car models..."
                          className="text-xs"
                          styles={selectStyles}
                          closeMenuOnSelect={false}
                        />
                      </div>

                      {/* Car Types - Multi-select */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-black flex items-center gap-2 text-xs">
                          <Car className="w-3 h-3 text-[#c9a86c]" />
                          Car Types (Select multiple)
                        </h4>
                        <Select
                          isMulti
                          options={carTypesOptions}
                          value={carTypesOptions.filter(option => 
                            carForm.selectedCarTypes.includes(option.value)
                          )}
                          onChange={handleCarTypesChange}
                          placeholder="Select car types..."
                          className="text-xs"
                          styles={selectStyles}
                          closeMenuOnSelect={false}
                        />
                      </div>

                      {/* Transmission Types - Multi-select */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-black flex items-center gap-2 text-xs">
                          <Settings className="w-3 h-3 text-[#c9a86c]" />
                          Transmission (Select multiple)
                        </h4>
                        <Select
                          isMulti
                          options={transmissionOptions}
                          value={transmissionOptions.filter(option => 
                            carForm.selectedTransmissions.includes(option.value)
                          )}
                          onChange={handleTransmissionsChange}
                          placeholder="Select transmission types..."
                          className="text-xs"
                          styles={selectStyles}
                          closeMenuOnSelect={false}
                        />
                      </div>

                      {/* Fuel Types - Multi-select */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-black flex items-center gap-2 text-xs">
                          <Fuel className="w-3 h-3 text-[#c9a86c]" />
                          Fuel Types (Select multiple)
                        </h4>
                        <Select
                          isMulti
                          options={fuelTypesOptions}
                          value={fuelTypesOptions.filter(option => 
                            carForm.selectedFuelTypes.includes(option.value)
                          )}
                          onChange={handleFuelTypesChange}
                          placeholder="Select fuel types..."
                          className="text-xs"
                          styles={selectStyles}
                          closeMenuOnSelect={false}
                        />
                      </div>

                      {/* Number of Cars */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-black flex items-center gap-2 text-xs">
                          <Car className="w-3 h-3 text-[#c9a86c]" />
                          Number of Cars *
                        </h4>
                        <input
                          type="number"
                          name="numberOfCars"
                          value={carForm.numberOfCars}
                          onChange={handleCarChange}
                          min="1"
                          required
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#c9a86c]"
                        />
                      </div>

                      {/* Additional Services - Multi-select */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-black flex items-center gap-2 text-xs">
                          <Shield className="w-3 h-3 text-[#c9a86c]" />
                          Additional Services (Select multiple)
                        </h4>
                        <Select
                          isMulti
                          options={carServicesOptions}
                          value={carServicesOptions.filter(option => 
                            carForm.selectedServices.includes(option.value)
                          )}
                          onChange={handleCarServicesChange}
                          placeholder="Select additional services..."
                          className="text-xs"
                          styles={selectStyles}
                          closeMenuOnSelect={false}
                        />
                      </div>

                      {/* Additional Message */}
                      <textarea
                        name="message"
                        value={carForm.message}
                        onChange={handleCarChange}
                        rows={2}
                        placeholder="Special requests..."
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#c9a86c]"
                      />

                      {/* Terms and Conditions - Above Submit Button */}
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <button
                            type="button"
                            onClick={() => setShowTerms(true)}
                            className="text-xs text-[#c9a86c] hover:underline flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3" />
                            View Terms and Conditions
                          </button>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            required
                            className="w-3 h-3 text-[#c9a86c] rounded border-gray-300 focus:ring-[#c9a86c]"
                          />
                          <span className="text-xs text-gray-600">
                            I agree to the Terms and Conditions *
                          </span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#c9a86c] text-white py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wider hover:bg-black"
                      >
                        {isSubmitting ? 'Processing...' : 'Submit Booking'}
                      </button>
                    </form>
                  )}

                  {selectedType === 'tour' && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Personal Information */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-black flex items-center gap-2 text-xs border-b border-gray-100 pb-1">
                          <User className="w-3 h-3 text-[#c9a86c]" />
                          Your Information
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            name="fullName"
                            value={tourForm.fullName}
                            onChange={handleTourChange}
                            placeholder="Full Name *"
                            required
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#c9a86c]"
                          />
                          <input
                            type="email"
                            name="email"
                            value={tourForm.email}
                            onChange={handleTourChange}
                            placeholder="Email *"
                            required
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#c9a86c]"
                          />
                        </div>
                        <PhoneInput
                          country={'rw'}
                          value={tourForm.phone}
                          onChange={(value, country) => handlePhoneChange(value, country, 'tour')}
                          inputClass="!w-full !pl-10 !py-2 !text-xs !border-gray-200 !rounded-lg focus:!ring-1 focus:!ring-[#c9a86c]"
                          buttonClass="!border-gray-200 !rounded-l-lg"
                          placeholder="Phone number *"
                          required
                          enableSearch={true}
                        />
                      </div>

                      {/* Tour Packages - Multi-select */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-black flex items-center gap-2 text-xs">
                          <Globe className="w-3 h-3 text-[#c9a86c]" />
                          Tour Packages (Select at least one) *
                        </h4>
                        <Select
                          isMulti
                          options={tourPackagesOptions}
                          value={tourPackagesOptions.filter(option => 
                            tourForm.selectedPackages.includes(option.value)
                          )}
                          onChange={handleTourPackagesChange}
                          placeholder="Select tour packages..."
                          className="text-xs"
                          styles={selectStyles}
                          closeMenuOnSelect={false}
                        />
                      </div>

                      {/* Travel Dates */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-black flex items-center gap-2 text-xs">
                          <CalendarDays className="w-3 h-3 text-[#c9a86c]" />
                          Travel Dates *
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Tour Start Date *</label>
                            <input
                              type="date"
                              name="tourStartDate"
                              value={tourForm.tourStartDate}
                              onChange={handleTourChange}
                              required
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#c9a86c]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Tour End Date *</label>
                            <input
                              type="date"
                              name="tourEndDate"
                              value={tourForm.tourEndDate}
                              onChange={handleTourChange}
                              required
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#c9a86c]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Number of Travelers */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-black flex items-center gap-2 text-xs">
                          <Users className="w-3 h-3 text-[#c9a86c]" />
                          Number of Travelers *
                        </h4>
                        <input
                          type="number"
                          name="numberOfTravelers"
                          value={tourForm.numberOfTravelers}
                          onChange={handleTourChange}
                          min="1"
                          required
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#c9a86c]"
                        />
                      </div>

                      {/* Additional Services - Multi-select */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-black flex items-center gap-2 text-xs">
                          <Heart className="w-3 h-3 text-[#c9a86c]" />
                          Additional Services (Select multiple)
                        </h4>
                        <Select
                          isMulti
                          options={tourServicesOptions}
                          value={tourServicesOptions.filter(option => 
                            tourForm.selectedServices.includes(option.value)
                          )}
                          onChange={handleTourServicesChange}
                          placeholder="Select additional services..."
                          className="text-xs"
                          styles={selectStyles}
                          closeMenuOnSelect={false}
                        />
                      </div>

                      {/* Special Requests */}
                      <textarea
                        name="specialRequests"
                        value={tourForm.specialRequests}
                        onChange={handleTourChange}
                        rows={2}
                        placeholder="Special requests..."
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#c9a86c]"
                      />

                      {/* Terms and Conditions - Above Submit Button */}
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <button
                            type="button"
                            onClick={() => setShowTerms(true)}
                            className="text-xs text-[#c9a86c] hover:underline flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3" />
                            View Terms and Conditions
                          </button>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            required
                            className="w-3 h-3 text-[#c9a86c] rounded border-gray-300 focus:ring-[#c9a86c]"
                          />
                          <span className="text-xs text-gray-600">
                            I agree to the Terms and Conditions *
                          </span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#c9a86c] text-white py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wider hover:bg-black"
                      >
                        {isSubmitting ? 'Processing...' : 'Submit Booking'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="bg-[#c9a86c] px-6 py-4 flex justify-between items-center">
              <h3 className="text-white font-bold">
                {selectedType === 'event' && termsContent.event.title}
                {selectedType === 'car' && termsContent.car.title}
                {selectedType === 'tour' && termsContent.tour.title}
              </h3>
              <button 
                onClick={() => setShowTerms(false)} 
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh] text-xs whitespace-pre-line leading-relaxed">
              {selectedType === 'event' && termsContent.event.content}
              {selectedType === 'car' && termsContent.car.content}
              {selectedType === 'tour' && termsContent.tour.content}
            </div>
            <div className="px-6 py-4 border-t flex justify-end">
              <button
                onClick={() => setShowTerms(false)}
                className="bg-[#c9a86c] text-white px-4 py-2 rounded-lg text-sm hover:bg-black transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}