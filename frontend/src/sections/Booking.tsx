import { useEffect, useRef, useState } from 'react';
import { Calendar, Car, MapPin, CheckCircle, User, Mail, Phone, MessageSquare, Users, MapPinned, CalendarDays, Settings, Fuel, Briefcase, Globe, Award, Heart, Shield, FileText, X } from 'lucide-react';
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
  { value: 'Toyota Altis', label: 'Toyota Altis' },
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
  phone: '0782501110',
  whatsapp: '250782501110',
  email: 'info@paramountadventureandtravels.com',
  address: '1 KN 78 St, Kigali',
};

// Terms and Conditions content for each service
const termsContent = {
  event: {
    title: 'Event Management Terms and Conditions',
    content: `Paramount Adventure and Travels - Event Management Terms (Rwanda)

1. BOOKING CONFIRMATION
   • A binding contract is formed upon confirmation of booking and receipt of deposit
   • 50% non-refundable deposit to secure your date
   • Full payment due 5 days before event date
   • All prices quoted in USD or RWF as per contract

2. CANCELLATION POLICY (Based on Rwandan Civil Code)
   • 60+ days before event: 50% of deposit refunded
   • 30-59 days before event: 25% of deposit refunded
   • 15-29 days before event: No refund of deposit
   • 0-14 days before event: 100% of total contract value payable
   • All refunds processed within 30 days

3. FORCE MAJEURE (Act of God)
   • In case of events beyond reasonable control (natural disasters, government restrictions, public health emergencies)
   • Parties may reschedule without penalty within 12 months
   • If rescheduling impossible, refunds issued minus non-recoverable costs
   • Documentation of force majeure event

4. LIABILITY AND INSURANCE
   • Paramount Adventure and Travels carries public liability insurance as by Rwandan law
   • Maximum liability limited to total contract value
   • Client responsible for venue rules compliance and obtaining necessary permits
   • Client responsible for security of personal belongings
   • Paramount Adventure and Travels not liable for third-party vendor performance

5. PAYMENT TERMS
   • Payments accepted: Bank transfer, Mobile Money (MTN MoMo, Airtel Money), Cash
   • All payments must be in RWF unless otherwise agreed
   • VAT (18%) included where applicable as per Rwanda Revenue Authority
   • Late payments subject to 5% penalty per week
   • Non-payment constitutes contract breach

6. CLIENT RESPONSIBILITIES
   • Final guest count 10 days before event
   • Ensure venue access for setup 4 hours before event
   • Obtain all necessary permits and licenses (Rwanda National Police, RURA, etc.)
   • Provide dietary requirements 7 days in advance
   • Comply with all Rwandan laws and regulations during event

7. POST-EVENT
   • Feedback form sent within 3 days
   • Photos/videos delivered within 21 days
   • Equipment removal within agreed timeframe (overtime charges apply)
   • Damage to equipment charged at replacement cost

8. DISPUTE RESOLUTION
   • Any disputes shall first be resolved through negotiation
   • If unresolved, mediation through Rwanda Arbitration Center
   • Governing law: Laws of the Republic of Rwanda
   • Courts of Kigali have exclusive jurisdiction`,
  },
  car: {
    title: 'Car Rental Terms and Conditions',
    content: `Paramount Adventure and Travels - Car Rental Terms (Rwanda)

1. RENTAL REQUIREMENTS
   • Valid Rwandan or International Driving Permit (minimum 2 years)
   • Minimum age: 25 years
   • National ID or Passport for verification
   • Security deposit:
     - Standard vehicles: 500,000 RWF
     - Luxury vehicles: 1,000,000 RWF
     - Buses: 1,500,000 RWF
   • Deposit returned within 7 days after inspection

2. INSURANCE (As per Rwandan Law)
   • Third-party liability insurance included (RC - Responsabilité Civile)
   • Collision Damage Waiver (CDW) optional at 15,000 RWF/day
   • Theft protection included
   • Excess liability: 500,000 RWF per incident
   • Client responsible for first 500,000 RWF of any damage

3. FUEL POLICY
   • Vehicle provided with full tank
   • Return with full tank or fuel charges apply at 2,000 RWF/L
   • Pre-paid fuel option available at 50,000 RWF for half tank

4. MILEAGE AND TRAVEL
   • Unlimited mileage within Rwanda
   • Cross-border travel requires prior approval (additional fees apply)
   • Permitted countries: Uganda, DRC, Burundi, Tanzania (with permits)
   • Cross-border permit: 200,000 RWF + visa fees
   • GPS tracking mandatory for all vehicles

5. DRIVER SERVICE
   • Professional drivers available at 30,000 RWF/day
   • Driver hours: 8:00 AM - 8:00 PM standard
   • Overtime: 5,000 RWF/hour after 8:00 PM
   • Driver accommodation for multi-day trips (client responsibility)

6. CANCELLATION AND REFUNDS
   • Free cancellation up to 72 hours before pickup
   • 50% charge within 72 hours of pickup
   • No-show: 100% charge
   • Early returns: No refund for unused days
   • All cancellations must be in writing

7. DAMAGE AND ACCIDENTS
   • Report any damage immediately (within 24 hours)
   • Police report for all accidents (Rwanda National Police)
   • Client responsible for damage during rental period
   • Interior smoking fine: 250,000 RWF
   • Loss of keys: 150,000 RWF replacement fee

8. ADDITIONAL DRIVERS
   • Additional drivers allowed at 10,000 RWF/day
   • Must meet same requirements as primary driver
   • Maximum 3 additional drivers per vehicle
   • All drivers must sign rental agreement

9. RWANDA-SPECIFIC REGULATIONS
   • Compliance with RURA (Rwanda Utilities Regulatory Authority) rules
   • Seatbelts mandatory for all passengers
   • No alcohol consumption while driving (zero tolerance)
   • Speed limits strictly enforced
   • Child seats mandatory for children under 5`,
  },
  tour: {
    title: 'Tourism Package Terms and Conditions',
    content: `Paramount Adventure and Travels - Tourism Terms (Rwanda)

1. PACKAGE INCLUSIONS
   • As specified in package description
   • All entrance fees and permits included (including gorilla permits)
   • Meals as specified in itinerary
   • Accommodation as booked (star-rated hotels as per RDB classification)
   • Professional English/French-speaking guide (RDB certified)
   • Ground transportation in private vehicle with A/C
   • Bottled water during tours

2. EXCLUSIONS
   • International flights
   • Travel insurance (MANDATORY for all tourists)
   • Visa fees ($50 USD for single entry - subject to change)
   • Personal expenses (souvenirs, laundry, telephone)
   • Tips and gratuities (recommended: $10-20/day)
   • Alcoholic beverages
   • COVID-19 testing requirements

3. BOOKING AND PAYMENT
   • 30% deposit to confirm booking
   • Balance due 45 days before travel
   • Gorilla permits require FULL PAYMENT at time of booking
   • Permits are non-transferable and non-refundable
   • Group discounts available for 6+ pax
   • All prices in USD or equivalent RWF (central bank rate)

4. RWANDA-SPECIFIC CANCELLATION POLICY
   • 60+ days before departure: 75% refund
   • 30-59 days before departure: 50% refund
   • 15-29 days before departure: 25% refund
   • 0-14 days before departure: No refund
   • Gorilla permits: NON-REFUNDABLE under any circumstances
   • Name changes on permits: $50 fee (subject to RDB policy)

5. HEALTH AND SAFETY (Rwanda Requirements)
   • Travel insurance with medical evacuation MANDATORY
   • Yellow fever vaccination certificate REQUIRED for entry
   • Malaria prophylaxis strongly recommended
   • COVID-19 requirements as per current Rwanda Biomedical Centre guidelines
   • Declare any medical conditions in writing
   • Emergency evacuation insurance recommended

6. GORILLA TREKKING SPECIFIC
   • Age limit: 15 years and above (strictly enforced by RDB)
   • Physical fitness (trekking can take 2-6 hours)
   • Porter service available at $20 (supports local communities)
   • Maximum 1 hour with gorillas once located
   • No flash photography allowed
   • Maintain 7 meters distance from gorillas
   • No eating or drinking near gorillas

7. ITINERARY CHANGES
   • RDB reserves right to modify trekking groups
   • Weather-related changes accommodated where possible
   • Equivalent alternatives provided
   • No refund for voluntary changes
   • Force majeure handled as per Rwanda Tourism policy

8. RESPONSIBILITY AND LIABILITY
   • Paramount Adventure and Travels acts as intermediary for services
   • Not liable for acts of God, weather, political instability
   • Clients responsible for valid passport (6 months validity)
   • Baggage at owner's risk throughout tour
   • Compliance with Rwanda National Police and RDB regulations

9. RWANDA TOURISM BOARD REGULATIONS
   • All tours comply with RDB sustainable tourism guidelines
   • Community benefit sharing included
   • Environmental protection rules must be followed
   • No single-use plastics in national parks
   • Respect local customs and traditions

10. EMERGENCY PROCEDURES
    • 24/7 emergency contact provided
    • Evacuation procedures explained
    • Nearest medical facilities identified
    • Embassy contact details provided
    • Insurance claim assistance available`,
  },
};

// Helper function to get today's date in YYYY-MM-DD format for min attribute
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
  const todayDate = getTodayDate();

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
    
    // Generate booking number (this will be overridden by the backend)
    const newBookingNumber = 'BOOK-' + Date.now().toString().slice(-8);
    setBookingNumber(newBookingNumber);

    // Prepare data based on selected service
    let completeData: any = {
      service_type: serviceLabel,
      service_id: selectedType === 'car' ? 2 : selectedType === 'tour' ? 3 : 1,
      bookingNumber: newBookingNumber,
    };

    if (selectedType === 'event') {
      completeData = { 
        ...completeData, 
        customerName: eventForm.fullName,
        customerEmail: eventForm.email,
        customerPhone: eventForm.phone,
        eventType: eventForm.eventType,
        startDate: eventForm.eventStartDate,
        endDate: eventForm.eventEndDate,
        guests: eventForm.numberOfGuests,
        venuePreference: eventForm.venuePreference,
        selectedServices: eventForm.selectedServices,
        notes: eventForm.message,
        totalPrice: 5000 // Base event price
      };
    } else if (selectedType === 'car') {
      // STEP 1: Log form data before sending
      console.log('🔍 STEP 1 - Form data from state:', {
        models: carForm.selectedCarModels,
        types: carForm.selectedCarTypes,
        transmissions: carForm.selectedTransmissions,
        fuelTypes: carForm.selectedFuelTypes,
        services: carForm.selectedServices
      });
      
      completeData = { 
        ...completeData, 
        customerName: carForm.fullName,
        customerEmail: carForm.email,
        customerPhone: carForm.phone,
        pickupDate: carForm.pickupDate,
        pickupTime: carForm.pickupTime,
        returnDate: carForm.returnDate,
        returnTime: carForm.returnTime,
        pickupLocation: carForm.pickupLocation,
        selectedCarModels: carForm.selectedCarModels,
        selectedCarTypes: carForm.selectedCarTypes,
        selectedTransmissions: carForm.selectedTransmissions,
        selectedFuelTypes: carForm.selectedFuelTypes,
        carSelectedServices: carForm.selectedServices,
        numberOfCars: carForm.numberOfCars,
        notes: carForm.message,
        totalPrice: 85 * (carForm.numberOfCars || 1)
      };
      
      // STEP 2: Log what's being sent to email
      console.log('🔍 STEP 2 - Data being sent to email:', {
        selectedCarModels: completeData.selectedCarModels,
        selectedCarTypes: completeData.selectedCarTypes,
        selectedTransmissions: completeData.selectedTransmissions,
        selectedFuelTypes: completeData.selectedFuelTypes,
        carSelectedServices: completeData.carSelectedServices
      });
      
    } else if (selectedType === 'tour') {
      completeData = { 
        ...completeData, 
        customerName: tourForm.fullName,
        customerEmail: tourForm.email,
        customerPhone: tourForm.phone,
        selectedPackages: tourForm.selectedPackages,
        tourStartDate: tourForm.tourStartDate,
        tourEndDate: tourForm.tourEndDate,
        numberOfTravelers: tourForm.numberOfTravelers,
        tourSelectedServices: tourForm.selectedServices,
        specialRequests: tourForm.specialRequests,
        totalPrice: 150 * (tourForm.numberOfTravelers || 1)
      };
    }

    try {
      // ========================================
      // SAVE TO DATABASE - THIS WILL TRIGGER THE EMAILS FROM BACKEND
      // ========================================
      const customerResponse = await fetch('http://localhost:5000/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: completeData.customerName,
          email: completeData.customerEmail,
          phone: completeData.customerPhone || '',
          country: 'Rwanda'
        })
      });
      
      const customerData = await customerResponse.json();
      const customerId = customerData.id || 1;

      // Prepare booking data for database
      const bookingData: any = {
        customerId: customerId,
        serviceId: completeData.service_id,
        guests: selectedType === 'event' ? eventForm.numberOfGuests : selectedType === 'tour' ? tourForm.numberOfTravelers : carForm.numberOfCars,
        totalPrice: completeData.totalPrice,
        status: 'pending',
        paymentStatus: 'unpaid',
        bookingNumber: newBookingNumber,
      };

      // Add service-specific fields
      if (selectedType === 'event') {
        bookingData.startDate = eventForm.eventStartDate;
        bookingData.endDate = eventForm.eventEndDate;
        bookingData.eventType = eventForm.eventType;
        bookingData.venuePreference = eventForm.venuePreference;
        bookingData.selectedServices = eventForm.selectedServices;
        bookingData.notes = eventForm.message;
      } else if (selectedType === 'car') {
        bookingData.pickupDate = carForm.pickupDate;
        bookingData.pickupTime = carForm.pickupTime;
        bookingData.returnDate = carForm.returnDate;
        bookingData.returnTime = carForm.returnTime;
        bookingData.pickupLocation = carForm.pickupLocation;
        bookingData.selectedCarModels = carForm.selectedCarModels;
        bookingData.selectedCarTypes = carForm.selectedCarTypes;
        bookingData.selectedTransmissions = carForm.selectedTransmissions;
        bookingData.selectedFuelTypes = carForm.selectedFuelTypes;
        bookingData.carSelectedServices = carForm.selectedServices;
        bookingData.numberOfCars = carForm.numberOfCars;
        bookingData.notes = carForm.message;
      } else if (selectedType === 'tour') {
        bookingData.tourStartDate = tourForm.tourStartDate;
        bookingData.tourEndDate = tourForm.tourEndDate;
        bookingData.selectedPackages = tourForm.selectedPackages;
        bookingData.tourSelectedServices = tourForm.selectedServices;
        bookingData.numberOfTravelers = tourForm.numberOfTravelers;
        bookingData.specialRequests = tourForm.specialRequests;
      }

      console.log('📤 Sending to database:', bookingData);

      const bookingResponse = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const bookingResult = await bookingResponse.json();
      
      // Update with the actual booking number from backend
      if (bookingResult.bookingNumber) {
        setBookingNumber(bookingResult.bookingNumber);
      }

      // ========================================
      // MANUAL EMAIL CALL REMOVED - Now emails are sent from backend only
      // ========================================

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
        borderColor: '#2f8eb2',
      },
      '&:focus': {
        borderColor: '#2f8eb2',
        boxShadow: '0 0 0 1px #2f8eb2',
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      fontSize: '0.75rem',
      backgroundColor: state.isSelected ? '#2f8eb2' : state.isFocused ? '#fef3e2' : 'white',
      color: state.isSelected ? 'white' : 'black',
      '&:hover': {
        backgroundColor: state.isSelected ? '#2f8eb2' : '#fef3e2',
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
      color: '#2f8eb2',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: '#2f8eb2',
      '&:hover': {
        backgroundColor: '#2f8eb2',
        color: 'white',
      },
    }),
  };

  return (
    <section
      id="booking"
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 bg-[#f8fafc] overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #2f8eb2 1px, transparent 0)`,
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
              className="text-[#2f8eb2] text-sm font-semibold uppercase tracking-[0.3em] mb-4 block"
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
                        ? 'border-[#2f8eb2] bg-[#2f8eb2]/5'
                        : 'border-gray-200 bg-white hover:border-[#2f8eb2]/50 hover:shadow-md'
                    }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#2f8eb2] flex items-center justify-center shadow-md">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-black text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {type.label}
                        </h3>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-[#2f8eb2] flex items-center justify-center">
                        {selectedType === type.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#2f8eb2]" />
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
                <Award className="w-4 h-4 text-[#2f8eb2]" />
                Need Immediate Assistance?
              </h4>
              <div className="space-y-2 text-xs">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#2f8eb2]" />
                  <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-[#2f8eb2] transition-colors">
                    {CONTACT_INFO.phone}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#2f8eb2]" />
                  <a 
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_INFO.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#2f8eb2] transition-colors"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <MapPinned className="w-4 h-4 text-[#2f8eb2]" />
                  <a 
                    href="https://maps.google.com/?q=1+KN+78+St,+Kigali,+Rwanda"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#2f8eb2] transition-colors"
                  >
                    {CONTACT_INFO.address}
                  </a>
                </p>
              </div>
              
              {/* WhatsApp Chat Link - Only for urgent inquiries, not for booking submission */}
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent('Hello Paramount Adventure and Travels! I have an urgent inquiry about my booking.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full bg-green-500 text-white py-2 rounded-lg font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 hover:bg-green-600"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <MessageSquare className="w-4 h-4" />
                Urgent? Chat on WhatsApp
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
              <div className="bg-[#2f8eb2] px-6 py-4">
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {selectedType === 'event' && 'Event Management'}
                  {selectedType === 'car' && 'Car Rental'}
                  {selectedType === 'tour' && 'Tourism Package'}
                </h3>
              </div>

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
                  
                  {/* WhatsApp Link in Success Message for Urgent Inquiries */}
                  <a
                    href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(`Hello Paramount Adventure and Travels! I have an urgent question about my booking ${bookingNumber}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-green-600 transition-colors mb-3"
                  >
                    <MessageSquare className="w-3 h-3" />
                    Urgent? Chat on WhatsApp
                  </a>
                  
                  <button
                    onClick={() => {
                      setSubmitSuccess(false);
                      setSelectedType('event');
                    }}
                    className="block text-[#2f8eb2] text-xs hover:underline mt-2"
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
                          <User className="w-3 h-3 text-[#2f8eb2]" />
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
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2f8eb2] focus:border-transparent"
                          />
                          <input
                            type="email"
                            name="email"
                            value={eventForm.email}
                            onChange={handleEventChange}
                            placeholder="Email *"
                            required
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2f8eb2] focus:border-transparent"
                          />
                        </div>
                        <PhoneInput
                          country={'rw'}
                          value={eventForm.phone}
                          onChange={(value, country) => handlePhoneChange(value, country, 'event')}
                          inputClass="!w-full !pl-10 !py-2 !text-xs !border-gray-200 !rounded-lg focus:!ring-1 focus:!ring-[#2f8eb2]"
                          buttonClass="!border-gray-200 !rounded-l-lg"
                          placeholder="Phone number *"
                          enableSearch={true}
                          searchPlaceholder="Search country..."
                        />
                      </div>

                      {/* Event Details */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-black flex items-center gap-2 text-xs border-b border-gray-100 pb-1">
                          <Calendar className="w-3 h-3 text-[#2f8eb2]" />
                          Event Details
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <select
                            name="eventType"
                            value={eventForm.eventType}
                            onChange={handleEventChange}
                            required
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2f8eb2]"
                          >
                            <option value="" disabled hidden>Event Type *</option>
                            <option value="wedding">Wedding</option>
                            <option value="corporate">Corporate Meeting</option>
                            <option value="conference">Conference</option>
                            <option value="birthday">Birthday Party</option>
                            <option value="gala">Gala Dinner</option>
                            <option value="virtual">Virtual/Online Event</option>
                          </select>
                          <input
                            type="text"
                            name="venuePreference"
                            value={eventForm.venuePreference}
                            onChange={handleEventChange}
                            placeholder="Venue (optional)"
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2f8eb2]"
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
                              min={todayDate}
                              required
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2f8eb2]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Event End Date *</label>
                            <input
                              type="date"
                              name="eventEndDate"
                              value={eventForm.eventEndDate}
                              onChange={handleEventChange}
                              min={todayDate}
                              inputProps={{ required: true }}
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2f8eb2]"
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
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2f8eb2]"
                          />
                        </div>
                      </div>

                      {/* Services Selection - Multi-select dropdown */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-black flex items-center gap-2 text-xs border-b border-gray-100 pb-1">
                          <Briefcase className="w-3 h-3 text-[#2f8eb2]" />
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
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2f8eb2] resize-none"
                      />

                      {/* Terms and Conditions */}
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <button
                            type="button"
                            onClick={() => setShowTerms(true)}
                            className="text-xs text-[#2f8eb2] hover:underline flex items-center gap-1"
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
                            className="w-3 h-3 text-[#2f8eb2] rounded border-gray-300 focus:ring-[#2f8eb2]"
                          />
                          <span className="text-xs text-gray-600">
                            I agree to the Terms and Conditions *
                          </span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#2f8eb2] text-white py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wider hover:bg-black transition-colors disabled:opacity-50"
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
                          <User className="w-3 h-3 text-[#2f8eb2]" />
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
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2f8eb2]"
                          />
                          <input
                            type="email"
                            name="email"
                            value={carForm.email}
                            onChange={handleCarChange}
                            placeholder="Email *"
                            required
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2f8eb2]"
                          />
                        </div>
                        <PhoneInput
                          country={'rw'}
                          value={carForm.phone}
                          onChange={(value, country) => handlePhoneChange(value, country, 'car')}
                          inputClass="!w-full !pl-10 !py-2 !text-xs !border-gray-200 !rounded-lg focus:!ring-1 focus:!ring-[#2f8eb2]"
                          buttonClass="!border-gray-200 !rounded-l-lg"
                          placeholder="Phone number *"
                          inputProps={{ required: true }}
                          enableSearch={true}
                        />
                      </div>

                      {/* Pickup & Return Details */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-black flex items-center gap-2 text-xs border-b border-gray-100 pb-1">
                          <CalendarDays className="w-3 h-3 text-[#2f8eb2]" />
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
                              min={todayDate}
                              required
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2f8eb2]"
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
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2f8eb2]"
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
                              min={todayDate}
                              required
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2f8eb2]"
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
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2f8eb2]"
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
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2f8eb2]"
                            placeholder="e.g., Kigali International Airport"
                          />
                        </div>
                      </div>

                      {/* Car Models - Multi-select */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-black flex items-center gap-2 text-xs">
                          <Car className="w-3 h-3 text-[#2f8eb2]" />
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
                          <Car className="w-3 h-3 text-[#2f8eb2]" />
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
                          <Settings className="w-3 h-3 text-[#2f8eb2]" />
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
                          <Fuel className="w-3 h-3 text-[#2f8eb2]" />
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
                          <Car className="w-3 h-3 text-[#2f8eb2]" />
                          Number of Cars *
                        </h4>
                        <input
                          type="number"
                          name="numberOfCars"
                          value={carForm.numberOfCars}
                          onChange={handleCarChange}
                          min="1"
                          required
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2f8eb2]"
                        />
                      </div>

                      {/* Additional Services - Multi-select */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-black flex items-center gap-2 text-xs">
                          <Shield className="w-3 h-3 text-[#2f8eb2]" />
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
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2f8eb2]"
                      />

                      {/* Terms and Conditions */}
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <button
                            type="button"
                            onClick={() => setShowTerms(true)}
                            className="text-xs text-[#2f8eb2] hover:underline flex items-center gap-1"
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
                            className="w-3 h-3 text-[#2f8eb2] rounded border-gray-300 focus:ring-[#2f8eb2]"
                          />
                          <span className="text-xs text-gray-600">
                            I agree to the Terms and Conditions *
                          </span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#2f8eb2] text-white py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wider hover:bg-black"
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
                          <User className="w-3 h-3 text-[#2f8eb2]" />
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
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2f8eb2]"
                          />
                          <input
                            type="email"
                            name="email"
                            value={tourForm.email}
                            onChange={handleTourChange}
                            placeholder="Email *"
                            required
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2f8eb2]"
                          />
                        </div>
                        <PhoneInput
                          country={'rw'}
                          value={tourForm.phone}
                          onChange={(value, country) => handlePhoneChange(value, country, 'tour')}
                          inputClass="!w-full !pl-10 !py-2 !text-xs !border-gray-200 !rounded-lg focus:!ring-1 focus:!ring-[#2f8eb2]"
                          buttonClass="!border-gray-200 !rounded-l-lg"
                          placeholder="Phone number *"
                          inputProps={{ required: true }}
                          enableSearch={true}
                        />
                      </div>

                      {/* Tour Packages - Multi-select */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-black flex items-center gap-2 text-xs">
                          <Globe className="w-3 h-3 text-[#2f8eb2]" />
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
                          <CalendarDays className="w-3 h-3 text-[#2f8eb2]" />
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
                              min={todayDate}
                              required
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2f8eb2]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Tour End Date *</label>
                            <input
                              type="date"
                              name="tourEndDate"
                              value={tourForm.tourEndDate}
                              onChange={handleTourChange}
                              min={todayDate}
                              required
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2f8eb2]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Number of Travelers */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-black flex items-center gap-2 text-xs">
                          <Users className="w-3 h-3 text-[#2f8eb2]" />
                          Number of Travelers *
                        </h4>
                        <input
                          type="number"
                          name="numberOfTravelers"
                          value={tourForm.numberOfTravelers}
                          onChange={handleTourChange}
                          min="1"
                          required
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2f8eb2]"
                        />
                      </div>

                      {/* Additional Services - Multi-select */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-black flex items-center gap-2 text-xs">
                          <Heart className="w-3 h-3 text-[#2f8eb2]" />
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
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2f8eb2]"
                      />

                      {/* Terms and Conditions */}
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <button
                            type="button"
                            onClick={() => setShowTerms(true)}
                            className="text-xs text-[#2f8eb2] hover:underline flex items-center gap-1"
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
                            className="w-3 h-3 text-[#2f8eb2] rounded border-gray-300 focus:ring-[#2f8eb2]"
                          />
                          <span className="text-xs text-gray-600">
                            I agree to the Terms and Conditions *
                          </span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#2f8eb2] text-white py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wider hover:bg-black"
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
            <div className="bg-[#2f8eb2] px-6 py-4 flex justify-between items-center">
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
                className="bg-[#2f8eb2] text-white px-4 py-2 rounded-lg text-sm hover:bg-black transition-colors"
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
