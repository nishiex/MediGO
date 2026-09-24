export const INITIAL_CATEGORIES = [
  "All",
  "Antibiotics",
  "Pain Relief",
  "Cardiology",
  "Diabetes Care",
  "Respiratory",
  "Gastrointestinal",
  "Vitamins & Supplements",
  "Dermatology",
  "Neurology"
];

export const INITIAL_PHARMACIES = [
  {
    id: "pharm-1",
    name: "Apex City Central Medical Store",
    email: "pharmacy@medigo.health",
    phone: "+1 (555) 234-5678",
    address: "742 Evergreen Blvd, Suite 100",
    city: "Metro City",
    state: "NY",
    zip: "10001",
    rating: 4.9,
    reviewsCount: 342,
    hours: "Open 24/7",
    distance: "0.8 km away",
    status: "Active",
    verified: true,
    licenseNumber: "RX-NY-984210",
    joinedDate: "2024-01-15",
    pharmacistName: "Dr. Sarah Jenkins, PharmD",
    image: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "pharm-2",
    name: "GreenCross Community Chemist",
    email: "greencross@medigo.health",
    phone: "+1 (555) 876-5432",
    address: "128 Oakridge Avenue",
    city: "Metro City",
    state: "NY",
    zip: "10014",
    rating: 4.8,
    reviewsCount: 189,
    hours: "08:00 AM - 10:00 PM",
    distance: "1.5 km away",
    status: "Active",
    verified: true,
    licenseNumber: "RX-NY-772190",
    joinedDate: "2024-02-01",
    pharmacistName: "Dr. Michael Chen, RPh",
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "pharm-3",
    name: "HealthFirst Express Drugs",
    email: "healthfirst@medigo.health",
    phone: "+1 (555) 345-9012",
    address: "502 West Medical Plaza",
    city: "Metro City",
    state: "NY",
    zip: "10022",
    rating: 4.7,
    reviewsCount: 215,
    hours: "07:30 AM - 11:00 PM",
    distance: "2.3 km away",
    status: "Active",
    verified: true,
    licenseNumber: "RX-NY-651034",
    joinedDate: "2024-03-10",
    pharmacistName: "Dr. Elena Rostova",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "pharm-4",
    name: "St. Jude Wellness Pharmacy",
    email: "stjude.rx@medigo.health",
    phone: "+1 (555) 678-1234",
    address: "88 Lincoln Park South",
    city: "Metro City",
    state: "NY",
    zip: "10036",
    rating: 4.6,
    reviewsCount: 94,
    hours: "09:00 AM - 09:00 PM",
    distance: "3.7 km away",
    status: "Active",
    verified: true,
    licenseNumber: "RX-NY-542011",
    joinedDate: "2024-04-18",
    pharmacistName: "Marcus Brody, PharmD",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800"
  }
];

export const INITIAL_MEDICINES = [
  {
    id: "med-1",
    name: "Amoxicillin Trihydrate",
    genericName: "Amoxicillin",
    brandName: "Amoxil",
    category: "Antibiotics",
    dosageForm: "Capsule",
    strength: "500 mg",
    manufacturer: "GlaxoSmithKline",
    price: 18.50,
    prescriptionRequired: true,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    description: "Broad-spectrum penicillin antibiotic used to treat bacterial infections including respiratory tract infections, ear infections, and urinary tract infections.",
    usage: "Take 1 capsule every 8 hours with or without food. Complete the full prescribed course.",
    sideEffects: "Nausea, diarrhea, mild rash. Contact physician if severe allergic reaction occurs.",
    pharmacyId: "pharm-1",
    pharmacyName: "Apex City Central Medical Store",
    pharmacyAddress: "742 Evergreen Blvd, Suite 100",
    distance: "0.8 km",
    stockQuantity: 42,
    stockStatus: "In Stock",
    expiryDate: "2026-11-30",
    rating: 4.8,
    reviewsCount: 128
  },
  {
    id: "med-2",
    name: "Lipitor (Atorvastatin)",
    genericName: "Atorvastatin Calcium",
    brandName: "Lipitor",
    category: "Cardiology",
    dosageForm: "Tablet",
    strength: "20 mg",
    manufacturer: "Pfizer Inc.",
    price: 32.00,
    prescriptionRequired: true,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=800",
    description: "HMG-CoA reductase inhibitor (statin) used to lower LDL cholesterol and triglycerides in the blood and reduce cardiovascular risk.",
    usage: "Take once daily in the evening with a glass of water, with or without food.",
    sideEffects: "Muscle soreness, headache, mild abdominal cramps.",
    pharmacyId: "pharm-1",
    pharmacyName: "Apex City Central Medical Store",
    pharmacyAddress: "742 Evergreen Blvd, Suite 100",
    distance: "0.8 km",
    stockQuantity: 6,
    stockStatus: "Low Stock",
    expiryDate: "2027-02-15",
    rating: 4.9,
    reviewsCount: 210
  },
  {
    id: "med-3",
    name: "Metformin Hydrochloride",
    genericName: "Metformin HCl",
    brandName: "Glucophage",
    category: "Diabetes Care",
    dosageForm: "Extended-Release Tablet",
    strength: "850 mg",
    manufacturer: "Merck & Co.",
    price: 14.75,
    prescriptionRequired: true,
    image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=800",
    description: "First-line oral anti-hyperglycemic medication for the management of Type 2 diabetes mellitus.",
    usage: "Take with meals to minimize gastrointestinal discomfort as directed by endocrinologist.",
    sideEffects: "Metallic taste, mild nausea, diarrhea.",
    pharmacyId: "pharm-2",
    pharmacyName: "GreenCross Community Chemist",
    pharmacyAddress: "128 Oakridge Avenue",
    distance: "1.5 km",
    stockQuantity: 65,
    stockStatus: "In Stock",
    expiryDate: "2026-09-18",
    rating: 4.7,
    reviewsCount: 95
  },
  {
    id: "med-4",
    name: "Ventolin HFA (Albuterol Inhaler)",
    genericName: "Albuterol Sulfate",
    brandName: "Ventolin",
    category: "Respiratory",
    dosageForm: "Metered Dose Inhaler",
    strength: "90 mcg/actuation (200 doses)",
    manufacturer: "GlaxoSmithKline",
    price: 45.00,
    prescriptionRequired: true,
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=800",
    description: "Quick-relief bronchodilator for preventing and treating bronchospasm in patients with asthma or COPD.",
    usage: "Inhale 2 puffs every 4 to 6 hours as needed for wheezing or acute shortness of breath.",
    sideEffects: "Slight tremors, increased heart rate, nervousness.",
    pharmacyId: "pharm-3",
    pharmacyName: "HealthFirst Express Drugs",
    pharmacyAddress: "502 West Medical Plaza",
    distance: "2.3 km",
    stockQuantity: 0,
    stockStatus: "Out of Stock",
    expiryDate: "2026-10-30",
    rating: 4.9,
    reviewsCount: 310
  },
  {
    id: "med-5",
    name: "Ibuprofen Extra Strength",
    genericName: "Ibuprofen",
    brandName: "Advil / Motrin",
    category: "Pain Relief",
    dosageForm: "Liquid Gel",
    strength: "400 mg",
    manufacturer: "Haleon",
    price: 11.25,
    prescriptionRequired: false,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800",
    description: "Nonsteroidal anti-inflammatory drug (NSAID) for temporary relief of minor aches, muscle pain, toothache, and fever.",
    usage: "Take 1 softgel every 4 to 6 hours while symptoms persist.",
    sideEffects: "Heartburn, stomach upset. Take with food or milk.",
    pharmacyId: "pharm-1",
    pharmacyName: "Apex City Central Medical Store",
    pharmacyAddress: "742 Evergreen Blvd, Suite 100",
    distance: "0.8 km",
    stockQuantity: 88,
    stockStatus: "In Stock",
    expiryDate: "2027-08-01",
    rating: 4.9,
    reviewsCount: 540
  },
  {
    id: "med-6",
    name: "Omeprazole Delayed-Release",
    genericName: "Omeprazole",
    brandName: "Prilosec",
    category: "Gastrointestinal",
    dosageForm: "Delayed-Release Capsule",
    strength: "20 mg",
    manufacturer: "AstraZeneca",
    price: 21.00,
    prescriptionRequired: false,
    image: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&q=80&w=800",
    description: "Proton pump inhibitor (PPI) that decreases the amount of acid produced in the stomach.",
    usage: "Take 1 capsule before breakfast daily with water for 14 days.",
    sideEffects: "Mild headache, stomach pain, flatulence.",
    pharmacyId: "pharm-2",
    pharmacyName: "GreenCross Community Chemist",
    pharmacyAddress: "128 Oakridge Avenue",
    distance: "1.5 km",
    stockQuantity: 24,
    stockStatus: "In Stock",
    expiryDate: "2026-12-15",
    rating: 4.8,
    reviewsCount: 160
  }
];

export const INITIAL_RESERVATIONS = [
  {
    id: "res-101",
    reservationCode: "MED-9214",
    userId: "user-1",
    userName: "Alex Johnson",
    userEmail: "user@medigo.health",
    userPhone: "+1 (555) 123-4567",
    medicineId: "med-1",
    medicineName: "Amoxicillin Trihydrate 500 mg",
    medicineImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    category: "Antibiotics",
    quantity: 1,
    unitPrice: 18.50,
    totalPrice: 18.50,
    pharmacyId: "pharm-1",
    pharmacyName: "Apex City Central Medical Store",
    pharmacyAddress: "742 Evergreen Blvd, Suite 100",
    pharmacyPhone: "+1 (555) 234-5678",
    status: "Confirmed",
    reservedAt: "2026-09-23T14:30:00Z",
    pickupDeadline: "2026-09-25T18:00:00Z",
    notes: "Please pack with patient guide sheet."
  },
  {
    id: "res-102",
    reservationCode: "MED-7831",
    userId: "user-1",
    userName: "Alex Johnson",
    userEmail: "user@medigo.health",
    userPhone: "+1 (555) 123-4567",
    medicineId: "med-5",
    medicineName: "Ibuprofen Extra Strength 400 mg",
    medicineImage: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800",
    category: "Pain Relief",
    quantity: 2,
    unitPrice: 11.25,
    totalPrice: 22.50,
    pharmacyId: "pharm-1",
    pharmacyName: "Apex City Central Medical Store",
    pharmacyAddress: "742 Evergreen Blvd, Suite 100",
    pharmacyPhone: "+1 (555) 234-5678",
    status: "Pending",
    reservedAt: "2026-09-24T08:15:00Z",
    pickupDeadline: "2026-09-25T20:00:00Z"
  }
];

export const INITIAL_USERS = [
  {
    id: "user-1",
    name: "Alex Johnson",
    email: "user@medigo.health",
    role: "user",
    phone: "+1 (555) 123-4567",
    address: "350 5th Ave, New York, NY 10118",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    status: "Active",
    createdAt: "2024-01-10"
  },
  {
    id: "pharm-admin-1",
    name: "Dr. Sarah Jenkins",
    email: "pharmacy@medigo.health",
    role: "pharmacy",
    pharmacyId: "pharm-1",
    pharmacyName: "Apex City Central Medical Store",
    phone: "+1 (555) 234-5678",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
    status: "Active",
    createdAt: "2024-01-15"
  },
  {
    id: "admin-1",
    name: "Elena Vance (System Admin)",
    email: "admin@medigo.health",
    role: "admin",
    phone: "+1 (555) 999-0000",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    status: "Active",
    createdAt: "2023-12-01"
  }
];

export function getMockDB() {
  const getOrSet = (key, initial) => {
    try {
      const stored = localStorage.getItem(`medigo_${key}`);
      if (!stored) {
        localStorage.setItem(`medigo_${key}`, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(stored);
    } catch (e) {
      return initial;
    }
  };

  return {
    medicines: getOrSet("medicines", INITIAL_MEDICINES),
    pharmacies: getOrSet("pharmacies", INITIAL_PHARMACIES),
    reservations: getOrSet("reservations", INITIAL_RESERVATIONS),
    users: getOrSet("users", INITIAL_USERS),
    categories: INITIAL_CATEGORIES
  };
}

export function saveMockDB(key, data) {
  try {
    localStorage.setItem(`medigo_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save to localStorage", e);
  }
}

export function resetMockDB() {
  try {
    localStorage.removeItem('medigo_medicines');
    localStorage.removeItem('medigo_pharmacies');
    localStorage.removeItem('medigo_reservations');
    localStorage.removeItem('medigo_users');
    localStorage.removeItem('medigo_user');
    localStorage.removeItem('medigo_token');
    return getMockDB();
  } catch (e) {
    console.error("Failed to reset mock DB", e);
  }
}
