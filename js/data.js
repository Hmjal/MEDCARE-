// MedCare Online Pharmacy - Mock Data & Store State

const PHARMACY_DATA = {
  categories: [
    {
      id: "cat-1",
      name: "Prescription Medicines",
      count: "1,240+ items",
      icon: "fa-solid fa-prescription-bottle-medical",
      color: "#0D6EFD",
      bgLight: "#e7f1ff",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
      description: "Authentic Rx medications verified by licensed pharmacists"
    },
    {
      id: "cat-2",
      name: "Over-the-Counter (OTC)",
      count: "850+ items",
      icon: "fa-solid fa-capsules",
      color: "#28A745",
      bgLight: "#e8f7ec",
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=400&q=80",
      description: "Pain relief, fever, cold & digestive health solutions"
    },
    {
      id: "cat-3",
      name: "Health Supplements",
      count: "620+ items",
      icon: "fa-solid fa-pills",
      color: "#17A2B8",
      bgLight: "#e3f7fa",
      image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=400&q=80",
      description: "Multivitamins, immunity boosters, omega-3 & proteins"
    },
    {
      id: "cat-4",
      name: "Personal Care",
      count: "940+ items",
      icon: "fa-solid fa-pump-soap",
      color: "#fd7e14",
      bgLight: "#fff3e8",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80",
      description: "Skin care, oral hygiene, hair care & daily body essentials"
    },
    {
      id: "cat-5",
      name: "Baby Care",
      count: "410+ items",
      icon: "fa-solid fa-baby",
      color: "#e83e8c",
      bgLight: "#fdecf4",
      image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=80",
      description: "Diapers, gentle wipes, baby nutrition & baby wellness"
    },
    {
      id: "cat-6",
      name: "Ayurvedic Products",
      count: "530+ items",
      icon: "fa-solid fa-leaf",
      color: "#198754",
      bgLight: "#e9f7ef",
      image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=400&q=80",
      description: "Natural herbal supplements, Chyawanprash & pure extracts"
    },
    {
      id: "cat-7",
      name: "Medical Devices",
      count: "320+ items",
      icon: "fa-solid fa-heart-pulse",
      color: "#6f42c1",
      bgLight: "#f1ebfa",
      image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80",
      description: "BP monitors, digital thermometers, glucometers & oximeters"
    },
    {
      id: "cat-8",
      name: "Covid Essentials",
      count: "290+ items",
      icon: "fa-solid fa-shield-virus",
      color: "#dc3545",
      bgLight: "#fde8ea",
      image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=400&q=80",
      description: "N95 masks, alcohol sanitizers, vaporizers & PPE supplies"
    }
  ],

  // Comprehensive Product Catalog for Shop / Listing Page
  allProducts: [
    {
      id: "prod-1",
      name: "Paracetamol 650mg Tablets",
      brand: "Dolo Health",
      category: "Over-the-Counter (OTC)",
      packSize: "Strip of 15 tablets",
      price: 32,
      mrp: 40,
      discount: 20,
      rating: 4.8,
      reviewsCount: 1420,
      inStock: true,
      requiresPrescription: false,
      dosage: "650mg Paracetamol",
      composition: "Paracetamol IP 650mg",
      manufacturer: "Micro Labs Ltd.",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80",
      description: "Fast-acting relief from fever, headache, body ache and mild to moderate pain. Doctor trusted and safe for adults when taken as directed.",
      dateAdded: "2026-09-10"
    },
    {
      id: "prod-2",
      name: "Amoxicillin & Potassium Clavulanate 625mg",
      brand: "Augmentin Care",
      category: "Prescription Medicines",
      packSize: "Strip of 10 tablets",
      price: 168,
      mrp: 210,
      discount: 20,
      rating: 4.9,
      reviewsCount: 980,
      inStock: true,
      requiresPrescription: true,
      dosage: "500mg + 125mg",
      composition: "Amoxicillin 500mg, Clavulanic Acid 125mg",
      manufacturer: "GlaxoSmithKline",
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=500&q=80",
      description: "Broad-spectrum antibacterial medication for respiratory, skin, urinary tract, and dental bacterial infections. Prescription verification required.",
      dateAdded: "2026-09-25"
    },
    {
      id: "prod-3",
      name: "Vitamin C 500mg + Zinc Chewables",
      brand: "Limcee Immunity",
      category: "Health Supplements",
      packSize: "Bottle of 60 tablets",
      price: 185,
      mrp: 240,
      discount: 23,
      rating: 4.7,
      reviewsCount: 2310,
      inStock: true,
      requiresPrescription: false,
      dosage: "500mg Vitamin C + 5mg Zinc",
      composition: "Ascorbic Acid IP 500mg, Zinc Sulphate",
      manufacturer: "Abbott Healthcare",
      image: "https://images.unsplash.com/photo-1563213126-a4273aed2016?auto=format&fit=crop&w=500&q=80",
      description: "Delicious orange flavored chewable tablets that strengthen immunity, promote collagen synthesis, and fight oxidative stress.",
      dateAdded: "2026-10-01"
    },
    {
      id: "prod-4",
      name: "Digital Blood Pressure Monitor with IntelliSense",
      brand: "Omron Healthcare",
      category: "Medical Devices",
      packSize: "1 Device + Wide Cuff + 4 AA Batteries",
      price: 1899,
      mrp: 2490,
      discount: 24,
      rating: 4.9,
      reviewsCount: 3120,
      inStock: true,
      requiresPrescription: false,
      dosage: "Dual User Memory (60 readings each)",
      composition: "Clinical Grade Oscillometric Sensor",
      manufacturer: "Omron Healthcare",
      image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=500&q=80",
      description: "Clinically validated automatic upper-arm BP monitor with IntelliSense technology, hypertension indicator, and irregular heartbeat detector.",
      dateAdded: "2026-10-12"
    },
    {
      id: "prod-5",
      name: "Dabur Chyawanprash Awaleha 2X Immunity",
      brand: "Dabur Ayurveda",
      category: "Ayurvedic Products",
      packSize: "Jar of 1000g (1kg)",
      price: 345,
      mrp: 410,
      discount: 16,
      rating: 4.8,
      reviewsCount: 1840,
      inStock: true,
      requiresPrescription: false,
      dosage: "1-2 teaspoons daily with warm milk",
      composition: "Amla, Ashwagandha, Pippali & 40+ Rare Herbs",
      manufacturer: "Dabur India Ltd.",
      image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=500&q=80",
      description: "Time-tested Ayurvedic formulation enriched with natural vitamin C and potent antioxidants to boost stamina, respiratory strength, and vitality.",
      dateAdded: "2026-08-15"
    },
    {
      id: "prod-6",
      name: "Gentle Baby Moisturizing Lotion pH 5.5",
      brand: "Sebamed Baby",
      category: "Baby Care",
      packSize: "Bottle of 400ml",
      price: 649,
      mrp: 810,
      discount: 20,
      rating: 4.9,
      reviewsCount: 750,
      inStock: true,
      requiresPrescription: false,
      dosage: "pH 5.5 Balanced Skin Care",
      composition: "Allantoin, Chamomile Recutita Extract",
      manufacturer: "Sebapharma GmbH",
      image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=500&q=80",
      description: "Clinically proven pH 5.5 lotion to support the natural moisture barrier of delicate newborn and infant skin. 0% parabens and phthalates.",
      dateAdded: "2026-09-18"
    },
    {
      id: "prod-7",
      name: "Accu-Chek Active Blood Glucose Test Strips",
      brand: "Roche Diabetes",
      category: "Medical Devices",
      packSize: "Pack of 50 Test Strips",
      price: 899,
      mrp: 1090,
      discount: 18,
      rating: 4.6,
      reviewsCount: 2040,
      inStock: true,
      requiresPrescription: false,
      dosage: "50 Test Strips + 1 Code Chip",
      composition: "Glucose Dehydrogenase Enzyme",
      manufacturer: "Roche Diagnostics",
      image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=500&q=80",
      description: "Reliable blood sugar testing strips compatible with Accu-Chek Active glucometer. Delivers accurate readings in just 5 seconds.",
      dateAdded: "2026-09-02"
    },
    {
      id: "prod-8",
      name: "N95 Protective Face Respirator Mask",
      brand: "3M SafeGuard",
      category: "Covid Essentials",
      packSize: "Pack of 5 Respirators",
      price: 240,
      mrp: 350,
      discount: 31,
      rating: 4.7,
      reviewsCount: 1640,
      inStock: true,
      requiresPrescription: false,
      dosage: "5-layer Filtration BFE ≥ 99%",
      composition: "Meltblown Non-Woven Polypropylene",
      manufacturer: "3M Personal Safety",
      image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=500&q=80",
      description: "NIOSH-style certified 5-ply protective respirator with cushioned nose clip and high electrostatic filtration efficiency against dust, pollen and viruses.",
      dateAdded: "2026-10-05"
    },
    {
      id: "prod-9",
      name: "Atorvastatin 10mg Tablets for Cholesterol",
      brand: "Cipla Health",
      category: "Prescription Medicines",
      packSize: "Strip of 15 tablets",
      price: 115,
      mrp: 155,
      discount: 26,
      rating: 4.8,
      reviewsCount: 890,
      inStock: true,
      requiresPrescription: true,
      dosage: "10mg once daily at bedtime",
      composition: "Atorvastatin Calcium IP 10mg",
      manufacturer: "Cipla Ltd.",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80",
      description: "HMG-CoA reductase inhibitor that effectively lowers LDL bad cholesterol and triglycerides, reducing risk of coronary artery complications.",
      dateAdded: "2026-10-08"
    },
    {
      id: "prod-10",
      name: "Metformin Hydrochloride 500mg SR",
      brand: "Sun Pharma",
      category: "Prescription Medicines",
      packSize: "Strip of 20 tablets",
      price: 48,
      mrp: 65,
      discount: 26,
      rating: 4.9,
      reviewsCount: 1730,
      inStock: true,
      requiresPrescription: true,
      dosage: "500mg Sustained Release",
      composition: "Metformin Hydrochloride IP 500mg",
      manufacturer: "Sun Pharmaceutical Industries",
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=500&q=80",
      description: "First-line antihyperglycemic oral medication for management of Type 2 Diabetes Mellitus. Sustained release reduces GI sensitivity.",
      dateAdded: "2026-08-28"
    },
    {
      id: "prod-11",
      name: "Pantoprazole Gastro-Resistant 40mg",
      brand: "Alkem Laboratories",
      category: "Prescription Medicines",
      packSize: "Strip of 15 tablets",
      price: 132,
      mrp: 175,
      discount: 25,
      rating: 4.7,
      reviewsCount: 1120,
      inStock: true,
      requiresPrescription: true,
      dosage: "40mg 30 mins before breakfast",
      composition: "Pantoprazole Sodium IP 40mg",
      manufacturer: "Alkem Laboratories Ltd.",
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=500&q=80",
      description: "Proton pump inhibitor (PPI) indicated for acid reflux, gastroesophageal reflux disease (GERD), and peptic gastric ulcers.",
      dateAdded: "2026-10-14"
    },
    {
      id: "prod-12",
      name: "Ibuprofen & Paracetamol Pain Relief",
      brand: "Cipla Health",
      category: "Over-the-Counter (OTC)",
      packSize: "Strip of 20 tablets",
      price: 54,
      mrp: 75,
      discount: 28,
      rating: 4.6,
      reviewsCount: 640,
      inStock: true,
      requiresPrescription: false,
      dosage: "Ibuprofen 400mg + Paracetamol 325mg",
      composition: "Combiflam Dual Analgesic Formulation",
      manufacturer: "Sanofi India",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80",
      description: "Synergistic dual pain relief formula indicated for toothache, muscular spasms, arthritis joint pain, and acute backache.",
      dateAdded: "2026-09-12"
    },
    {
      id: "prod-13",
      name: "Antacid Liquid Mint Flavor Suspension",
      brand: "Abbott Healthcare",
      category: "Over-the-Counter (OTC)",
      packSize: "Bottle of 200ml",
      price: 139,
      mrp: 170,
      discount: 18,
      rating: 4.8,
      reviewsCount: 920,
      inStock: true,
      requiresPrescription: false,
      dosage: "10ml after meals as required",
      composition: "Magnesium Hydroxide, Dried Aluminium Hydroxide Gel",
      manufacturer: "Abbott India Ltd.",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80",
      description: "Rapid soothing relief from heartburn, acid indigestion, gas bloating, and stomach sourness with a refreshing mint taste.",
      dateAdded: "2026-07-22"
    },
    {
      id: "prod-14",
      name: "Ultra Omega-3 Triple Strength 1000mg",
      brand: "NutriLife Pure",
      category: "Health Supplements",
      packSize: "Bottle of 90 Softgels",
      price: 699,
      mrp: 1299,
      discount: 46,
      rating: 4.8,
      reviewsCount: 1540,
      inStock: true,
      requiresPrescription: false,
      dosage: "550mg EPA + 380mg DHA per softgel",
      composition: "Molecularly Distilled Cold-Water Wild Fish Oil",
      manufacturer: "NutriLife Health Corp.",
      image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=500&q=80",
      description: "Mercury-free high potency Omega-3 fatty acids to improve cardiovascular health, cognitive brain function, and joint flexibility.",
      dateAdded: "2026-10-15"
    },
    {
      id: "prod-15",
      name: "Organic Ashwagandha Root Extract 500mg",
      brand: "Himalaya Wellness",
      category: "Ayurvedic Products",
      packSize: "Bottle of 60 Veg Capsules",
      price: 220,
      mrp: 290,
      discount: 24,
      rating: 4.7,
      reviewsCount: 880,
      inStock: true,
      requiresPrescription: false,
      dosage: "1 capsule twice daily",
      composition: "Withania Somnifera Pure Extract",
      manufacturer: "The Himalaya Drug Company",
      image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=500&q=80",
      description: "Clinically proven adaptogenic herb that lowers cortisol stress levels, enhances restorative sleep, and fortifies physical endurance.",
      dateAdded: "2026-09-30"
    },
    {
      id: "prod-16",
      name: "Pure Aloe Vera Soothing Gel 99%",
      brand: "Himalaya Wellness",
      category: "Personal Care",
      packSize: "Tube of 300ml",
      price: 175,
      mrp: 250,
      discount: 30,
      rating: 4.5,
      reviewsCount: 610,
      inStock: true,
      requiresPrescription: false,
      dosage: "Apply liberally to skin and hair",
      composition: "99% Pure Cold Pressed Organic Aloe Vera",
      manufacturer: "The Himalaya Drug Company",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80",
      description: "Multi-purpose calming gel to soothe sunburnt skin, hydrate dry patches, tame frizzy hair, and nourish minor cuts.",
      dateAdded: "2026-08-10"
    },
    {
      id: "prod-17",
      name: "Premium Baby Diaper Pants Size M (7-12kg)",
      brand: "Pampers Care",
      category: "Baby Care",
      packSize: "Jumbo Pack of 72 Diapers",
      price: 899,
      mrp: 1199,
      discount: 25,
      rating: 4.9,
      reviewsCount: 3400,
      inStock: true,
      requiresPrescription: false,
      dosage: "12-Hour Leak Protection",
      composition: "Breathable Cottony Soft Layer with Magic Gel Core",
      manufacturer: "Procter & Gamble",
      image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=500&q=80",
      description: "Ultra-absorbent pants with aloe vera lotion layer to safeguard baby's delicate skin from rashes and moisture for uninterrupted sleep.",
      dateAdded: "2026-10-11"
    },
    {
      id: "prod-18",
      name: "Infrared Non-Contact Digital Thermometer",
      brand: "Beurer Medical",
      category: "Medical Devices",
      packSize: "1 Gun Thermometer + Batteries",
      price: 849,
      mrp: 1699,
      discount: 50,
      rating: 4.8,
      reviewsCount: 1410,
      inStock: true,
      requiresPrescription: false,
      dosage: "1-Second Instant Reading",
      composition: "High Precision German Infrared Sensor",
      manufacturer: "Beurer Germany",
      image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=500&q=80",
      description: "Touchless forehead temperature measurement with fever alarm color backlight and 32 readings memory storage.",
      dateAdded: "2026-10-09"
    },
    {
      id: "prod-19",
      name: "Hand Sanitizer 75% Isopropyl Alcohol Dispenser",
      brand: "Dettol Safe",
      category: "Covid Essentials",
      packSize: "Pack of 2 x 500ml Dispensers",
      price: 199,
      mrp: 350,
      discount: 43,
      rating: 4.7,
      reviewsCount: 1890,
      inStock: true,
      requiresPrescription: false,
      dosage: "Kills 99.99% of Germs in 10s",
      composition: "75% v/v Isopropyl Alcohol with Glycerin & Vitamin E",
      manufacturer: "Reckitt Benckiser",
      image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=500&q=80",
      description: "Hospital grade sanitizing gel with skin-conditioning moisturizers. Non-sticky, fast drying formula keeps hands protected anywhere.",
      dateAdded: "2026-09-14"
    },
    {
      id: "prod-20",
      name: "Telmisartan 40mg Tablets for High BP",
      brand: "Sun Pharma",
      category: "Prescription Medicines",
      packSize: "Strip of 15 tablets",
      price: 82,
      mrp: 110,
      discount: 25,
      rating: 4.8,
      reviewsCount: 780,
      inStock: true,
      requiresPrescription: true,
      dosage: "40mg once daily in the morning",
      composition: "Telmisartan IP 40mg",
      manufacturer: "Sun Pharmaceutical Industries",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80",
      description: "Angiotensin II receptor antagonist (ARB) prescribed for essential hypertension and reducing cardiovascular mortality in at-risk adults.",
      dateAdded: "2026-10-03"
    },
    {
      id: "prod-21",
      name: "Multivitamin Daily Performance for Men & Women",
      brand: "Abbott Healthcare",
      category: "Health Supplements",
      packSize: "Pack of 60 tablets",
      price: 499,
      mrp: 750,
      discount: 33,
      rating: 4.9,
      reviewsCount: 2210,
      inStock: true,
      requiresPrescription: false,
      dosage: "1 tablet daily after meal",
      composition: "23 Essential Vitamins, Minerals, Ginseng & Biotin",
      manufacturer: "Abbott Healthcare",
      image: "https://images.unsplash.com/photo-1563213126-a4273aed2016?auto=format&fit=crop&w=500&q=80",
      description: "All-in-one daily multivitamin with ginseng and ginkgo biloba to sustain energy levels, boost brain acuity, and eliminate nutritional gaps.",
      dateAdded: "2026-10-16"
    },
    {
      id: "prod-22",
      name: "Pulse Oximeter Finger Clip with OLED Display",
      brand: "Omron Healthcare",
      category: "Medical Devices",
      packSize: "1 Oximeter + Lanyard + AAA Batteries",
      price: 799,
      mrp: 1499,
      discount: 47,
      rating: 4.7,
      reviewsCount: 1650,
      inStock: true,
      requiresPrescription: false,
      dosage: "Accurate SpO2 & Pulse Rate Measurement",
      composition: "Dual Wavelength Photodetector Sensor",
      manufacturer: "Omron Healthcare",
      image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=500&q=80",
      description: "Quick and non-invasive detection of blood oxygen saturation and pulse rate with multi-directional OLED display and auto-power off.",
      dateAdded: "2026-09-22"
    },
    {
      id: "prod-23",
      name: "Herbal Joint Pain Relief Gel Fast Action",
      brand: "Dabur Ayurveda",
      category: "Ayurvedic Products",
      packSize: "Pack of 2 Tubes x 50g",
      price: 220,
      mrp: 380,
      discount: 42,
      rating: 4.7,
      reviewsCount: 910,
      inStock: true,
      requiresPrescription: false,
      dosage: "Apply 3-4 times daily to affected area",
      composition: "Gandhapura Taila, Shallaki, Nilgiri & Pudina Satva",
      manufacturer: "Dabur India Ltd.",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80",
      description: "Deep-penetrating ayurvedic topical pain reliever for muscular stiffness, sprains, knee arthritis, and post-workout soreness.",
      dateAdded: "2026-08-19"
    },
    {
      id: "prod-24",
      name: "Antidandruff Shampoo with 2% Ketoconazole",
      brand: "Cipla Health",
      category: "Personal Care",
      packSize: "Bottle of 100ml",
      price: 215,
      mrp: 290,
      discount: 26,
      rating: 4.8,
      reviewsCount: 1350,
      inStock: false, // Out of stock example
      requiresPrescription: false,
      dosage: "Use twice weekly on damp scalp",
      composition: "Ketoconazole IP 2% w/v & Zinc Pyrithione (ZPTO)",
      manufacturer: "Cipla Health Ltd.",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80",
      description: "Clinically proven broad-spectrum antifungal shampoo that clears stubborn dandruff flakes, soothes itchy scalp, and prevents recurrence.",
      dateAdded: "2026-07-15"
    }
  ],

  deals: [
    {
      id: "deal-1",
      name: "Ultra Omega-3 Fish Oil 1000mg (90 Softgels)",
      brand: "NutriLife Pure",
      dealPrice: 699,
      originalPrice: 1299,
      discountPct: 46,
      soldPct: 78,
      rating: 4.8,
      badge: "FLASH DEAL",
      image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "deal-2",
      name: "Infrared Non-Contact Forehead Thermometer",
      brand: "Beurer Medical",
      dealPrice: 849,
      originalPrice: 1699,
      discountPct: 50,
      soldPct: 86,
      rating: 4.9,
      badge: "50% OFF",
      image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "deal-3",
      name: "Herbal Joint Pain Relief Gel 100g (Pack of 2)",
      brand: "Dabur Ayurveda",
      dealPrice: 220,
      originalPrice: 380,
      discountPct: 42,
      soldPct: 64,
      rating: 4.7,
      badge: "LIMITED STOCK",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "deal-4",
      name: "Hand Sanitizer 75% IPA 500ml Dispenser (2 Units)",
      brand: "Dettol Safe",
      dealPrice: 199,
      originalPrice: 350,
      discountPct: 43,
      soldPct: 91,
      rating: 4.8,
      badge: "HOT DEAL",
      image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=500&q=80"
    }
  ],

  blogs: [
    {
      id: "blog-1",
      title: "10 Essential Vitamins to Boost Immunity This Monsoon Season",
      category: "Wellness & Nutrition",
      author: "Dr. Sarah Johnson, MD",
      date: "Oct 15, 2026",
      readTime: "4 min read",
      thumbnail: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80",
      excerpt: "Learn how targeted micronutrients such as Vitamin C, Zinc, and Vitamin D3 shield your body from seasonal viral flu and microbial infections."
    },
    {
      id: "blog-2",
      title: "Managing Hypertension: Lifestyle Hacks and Medication Rules",
      category: "Heart Health",
      author: "Dr. Arvind Mehta, Cardiologist",
      date: "Oct 12, 2026",
      readTime: "6 min read",
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
      excerpt: "Expert guidance on monitoring daily blood pressure variations, low-sodium dietary habits, and ensuring strict adherence to prescribed antihypertensives."
    },
    {
      id: "blog-3",
      title: "How to Safely Store Your Medicines at Home: Avoid Common Mistakes",
      category: "Pharmacy Guide",
      author: "Pooja Sharma, Chief Pharmacist",
      date: "Oct 09, 2026",
      readTime: "5 min read",
      thumbnail: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80",
      excerpt: "Moisture, heat and bathroom cabinets can degrade medication potency. Discover standard temperature storage rules for syrups, tablets, and insulin."
    }
  ],

  testimonials: [
    {
      id: "test-1",
      name: "Rajesh Kumar",
      location: "Bengaluru, India",
      role: "Verified Patient",
      rating: 5,
      date: "2 days ago",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      text: "MedCare has been a lifesaver for my elderly parents. Uploading prescriptions is instantaneous, the pharmacist called to verify dosages, and medicines arrived within 3 hours in climate-controlled packaging!"
    },
    {
      id: "test-2",
      name: "Dr. Ananya Roy",
      location: "Mumbai, India",
      role: "Healthcare Professional",
      rating: 5,
      date: "1 week ago",
      photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80",
      text: "As a physician, I strictly recommend authentic pharmaceutical chains. MedCare provides 100% genuine batch-tested drugs with complete tax invoices and transparent expiration dates. Superb service!"
    },
    {
      id: "test-3",
      name: "Vikram Malhotra",
      location: "Delhi NCR, India",
      role: "Regular Customer",
      rating: 5,
      date: "2 weeks ago",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      text: "The 20% discount on monthly diabetic medications plus free doorstep delivery saves me over ₹1,500 every single month. Customer support on WhatsApp is friendly and highly responsive."
    },
    {
      id: "test-4",
      name: "Sneha Patel",
      location: "Pune, India",
      role: "Mother of Two",
      rating: 5,
      date: "3 weeks ago",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      text: "Ordering baby formula, diapers and first-aid supplies at midnight and having them delivered by early morning is unmatched. MedCare has won my trust for all our family's wellness essentials."
    }
  ]
};

// Backwards compatibility for homepage featured products
PHARMACY_DATA.featuredProducts = PHARMACY_DATA.allProducts.slice(0, 8);

// Helper to get product with rich tabs & gallery data
PHARMACY_DATA.getProductById = function(id) {
  const cleanId = String(id || '').trim();
  const prod = PHARMACY_DATA.allProducts.find(p => p.id === cleanId || p.id === 'prod-' + cleanId || p.id.replace('prod-', '') === cleanId) || PHARMACY_DATA.allProducts[0];
  
  // High quality curated medical galleries matching category
  const galleryLibrary = {
    "Prescription Medicines": [
      prod.image,
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563213126-a4273aed2016?auto=format&fit=crop&w=800&q=80"
    ],
    "Over-the-Counter (OTC)": [
      prod.image,
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563213126-a4273aed2016?auto=format&fit=crop&w=800&q=80"
    ],
    "Health Supplements": [
      prod.image,
      "https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563213126-a4273aed2016?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80"
    ],
    "Medical Devices": [
      prod.image,
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=800&q=80"
    ]
  };

  const gallery = galleryLibrary[prod.category] || [
    prod.image,
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1563213126-a4273aed2016?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80"
  ];

  return {
    ...prod,
    galleryImages: gallery,
    keyBenefits: [
      `Clinically proven active formulation with high bio-availability and targeted therapeutic efficacy.`,
      `Manufactured under certified WHO-GMP and FDA compliance standards by ${prod.manufacturer}.`,
      `Rapid absorption matrix designed to provide symptomatic relief within 30-45 minutes.`,
      `100% batch tested for chemical purity, zero heavy-metal adulteration, and strict microbial safety.`
    ],
    howToUse: {
      direction: `Take this medication orally with a full glass of water, either with or after meals as indicated by your medical practitioner.`,
      dosage: prod.dosage || `Adults: 1 dose 2-3 times daily or as prescribed by a licensed healthcare professional. Do not exceed recommended dosage.`,
      storage: `Store in a cool, dry place away from direct sunlight, moisture, and excess heat (below 25°C). Keep out of reach of children and pets.`
    },
    safety: {
      sideEffects: [
        "Mild nausea, epigastric discomfort, or heartburn (usually subsides with food)",
        "Occasional dizziness or mild headache during initial adjustment",
        "Rare allergic skin rash or pruritus in sensitive individuals"
      ],
      precautions: [
        "Consult your physician before use if you have chronic liver impairment or renal dysfunction.",
        "Inform your doctor if you are pregnant, planning to conceive, or breastfeeding.",
        "Avoid alcohol consumption during the medication course as it may increase hepatotoxicity risks."
      ],
      interactions: [
        "Concomitant use with other blood thinners (Warfarin/Aspirin) should be medically monitored.",
        "Avoid taking alongside other products containing overlapping active salts to prevent accidental overdose."
      ],
      warnings: `Keep strictly to prescribed limits. In case of suspected accidental overdose or acute adverse allergic reaction, discontinue immediately and contact MedCare emergency helpline or your nearest hospital.`
    },
    reviewsList: [
      {
        id: "rev-1",
        name: "Dr. K. Srinivas Rao",
        rating: 5,
        date: "October 14, 2026",
        verified: true,
        title: "Reliable and 100% authentic formulation",
        comment: "I have been ordering this through MedCare for several months for my clinic and family. Packaging is tamper-evident and genuine batch dates are verified on the strip. Highly recommended!"
      },
      {
        id: "rev-2",
        name: "Meera Subramanian",
        rating: 5,
        date: "October 08, 2026",
        verified: true,
        title: "Fast relief and prompt doorstep delivery",
        comment: "Delivered within 3 hours in Bengaluru! Excellent pricing compared to local retail chemists, and the pharmacist called to verify the dosage before dispatch."
      },
      {
        id: "rev-3",
        name: "Arunav Chatterjee",
        rating: 4,
        date: "September 28, 2026",
        verified: true,
        title: "Good efficacy, seamless online ordering",
        comment: "Effective medicine with genuine safety seal. Saved over 20% on the MRP with the first order coupon code. Will definitely purchase again."
      }
    ]
  };
};

// Prescription Page FAQs
PHARMACY_DATA.prescriptionFaqs = [
  {
    q: "Why is a doctor's prescription required for certain medicines?",
    a: "Under the Drugs and Cosmetics Act of India, Schedule H, H1, and X medications require a valid registered medical practitioner's prescription. This safeguards patients against incorrect dosages, drug misuse, and dangerous contraindications."
  },
  {
    q: "What makes a prescription valid on MedCare?",
    a: "A valid prescription must clearly display: (1) Doctor's full name, clinic/hospital header & registration number, (2) Patient's full name and age, (3) Date of consultation (prescriptions older than 6 months for acute medications may not be accepted), (4) Medicine name, strength/dosage, and course duration, and (5) Doctor's physical or digital signature."
  },
  {
    q: "How long does the pharmacist verification take?",
    a: "Our certified clinical pharmacists review prescriptions within 10 to 15 minutes of upload. You will receive an SMS and a verification call to confirm dosages, quantities, and schedule delivery."
  },
  {
    q: "Can I upload multiple photos or an e-prescription PDF?",
    a: "Yes! MedCare supports uploading multiple photos (JPG, PNG, WEBP) as well as multi-page PDF documents up to 5MB each directly from your smartphone, tablet, or PC."
  },
  {
    q: "Can I order for my parents or family members?",
    a: "Absolutely. Simply enter the patient's name as stated on the doctor's prescription slip, and enter your delivery address and contact number for order confirmation."
  },
  {
    q: "Is my medical data kept private and confidential?",
    a: "Yes. All uploaded prescriptions are stored on 256-bit encrypted HIPAA-compliant servers and are only accessible by licensed pharmacists processing your medical order."
  }
];

// Attach to window and exports globally
if (typeof window !== 'undefined') {
  window.PHARMACY_DATA = PHARMACY_DATA;
  window.medCareData = PHARMACY_DATA;
}
if (typeof globalThis !== 'undefined') {
  globalThis.PHARMACY_DATA = PHARMACY_DATA;
  globalThis.medCareData = PHARMACY_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PHARMACY_DATA };
}
