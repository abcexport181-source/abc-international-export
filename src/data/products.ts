export interface Product {
  id: string;
  category: string;
  name: string;
  description: string;
  image: string;
  features: string[];
  specs: { [key: string]: string };
  exportDetails: {
    moq: string;
    origin: string;
    capacity: string;
    packaging: string;
    payment: string;
    delivery: string;
  };
}

export interface Industry {
  id: string;
  title: string;
  icon: string;
  desc: string;
  keys: string[];
  fullInfo: string;
}

export const industriesData: Industry[] = [
  {
    id: 'agro-food',
    title: 'Agro & Food',
    icon: '🌾',
    desc: 'Agricultural products, food items, spices, grains, pulses, and processed foods',
    keys: ['Rice & Wheat', 'Spices', 'Pulses & Lentils', 'Tea & Coffee', 'Fruits & Vegetables', 'Processed Foods'],
    fullInfo: 'India is a global powerhouse for agricultural and food exports. We source premium commodities and processed foods directly from verified manufacturers, ensuring strict quality control and international standard packaging.'
  },
  {
    id: 'packaging',
    title: 'Packaging',
    icon: '📦',
    desc: 'Corrugated boxes, flexible packaging, labels, cartons, and custom packaging solutions',
    keys: ['Corrugated Boxes', 'Flexible Packaging', 'Labels & Stickers', 'Cartons', 'Pouches', 'Industrial Packaging'],
    fullInfo: 'We provide comprehensive packaging solutions ranging from standard corrugated boxes to high-tech flexible packaging. All materials are tested for export durability and shelf-life protection.'
  },
  {
    id: 'industrial-raw-materials',
    title: 'Industrial Raw Materials',
    icon: '⚙️',
    desc: 'Metals, alloys, polymers, resins, and industrial chemicals for manufacturing',
    keys: ['Steel & Metals', 'Polymers & Plastics', 'Industrial Chemicals', 'Resins', 'Rubber', 'Minerals'],
    fullInfo: 'Sourcing critical raw materials for global manufacturing. We ensure consistent quality, chemical purity, and reliable supply chains for metals, polymers, and industrial minerals.'
  },
  {
    id: 'chemicals',
    title: 'Chemicals',
    icon: '🧪',
    desc: 'Industrial chemicals, specialty chemicals, dyes, pigments, and chemical intermediates',
    keys: ['Specialty Chemicals', 'Dyes & Pigments', 'Pharma Intermediates', 'Agricultural Chemicals', 'Food Additives', 'Lab Chemicals'],
    fullInfo: 'Our chemical sourcing network covers specialty compounds and industrial intermediates. We ensure all MSDS documentation and hazardous cargo handling compliance are strictly followed.'
  },
  {
    id: 'consumer-products',
    title: 'Consumer Products',
    icon: '🛍️',
    desc: 'Home goods, personal care, electronics, appliances, and lifestyle products',
    keys: ['Home Appliances', 'Personal Care', 'Electronics', 'Kitchenware', 'Furniture', 'Lifestyle Products'],
    fullInfo: 'Access India\'s diverse consumer goods market. We source high-quality home, personal care, and lifestyle products that meet international safety and design standards.'
  },
  {
    id: 'private-label',
    title: 'Private Label',
    icon: '🏷️',
    desc: 'White-label manufacturing for your brand across multiple product categories',
    keys: ['Beauty & Cosmetics', 'Health Supplements', 'Food Products', 'Apparel', 'Home Goods', 'Electronics'],
    fullInfo: 'Launch your own brand with our private label manufacturing services. We connect you with state-of-the-art facilities that follow international GMP and quality standards.'
  },
  {
    id: 'handicrafts',
    title: 'Handicrafts',
    icon: '🎨',
    desc: 'Traditional Indian handicrafts, home decor, textiles, and artisan products',
    keys: ['Home Decor', 'Textiles', 'Handloom', 'Pottery & Ceramics', 'Metalwork', 'Wood Crafts'],
    fullInfo: 'Experience the rich heritage of Indian craftsmanship. We source authentic, ethically made handicrafts and home decor items from artisan clusters across India.'
  },
  {
    id: 'engineering-products',
    title: 'Engineering Products',
    icon: '🔧',
    desc: 'Machinery, tools, auto parts, electrical components, and industrial equipment',
    keys: ['Auto Parts', 'Machinery', 'Tools & Hardware', 'Electrical Components', 'Industrial Equipment', 'Precision Parts'],
    fullInfo: 'Precision-engineered products from India\'s manufacturing centers. We ensure all industrial goods meet your required technical specifications and international quality certifications.'
  },
  {
    id: 'textiles-apparel',
    title: 'Textiles & Apparel',
    icon: '👕',
    desc: 'Fabrics, garments, home textiles, and fashion accessories',
    keys: ['Fabrics', 'Readymade Garments', 'Home Textiles', 'Fashion Accessories', 'Yarns', 'Technical Textiles'],
    fullInfo: 'From sustainable cotton to high-fashion apparel, our textile network offers end-to-end sourcing, including custom garment manufacturing and bulk fabric supply.'
  },
  {
    id: 'pharmaceuticals',
    title: 'Pharmaceuticals',
    icon: '💊',
    desc: 'APIs, formulations, nutraceuticals, and pharmaceutical intermediates',
    keys: ['APIs', 'Formulations', 'Nutraceuticals', 'Herbal Products', 'Medical Devices', 'Pharma Packaging'],
    fullInfo: 'India is the "Pharmacy of the World". We facilitate the export of high-quality, cost-effective pharmaceutical products and medical consumables under strict regulatory compliance.'
  },
  {
    id: 'building-materials',
    title: 'Building Materials',
    icon: '🏗️',
    desc: 'Tiles, sanitary ware, construction materials, and building hardware',
    keys: ['Tiles & Ceramics', 'Sanitary Ware', 'Marble & Granite', 'Plywood', 'Hardware', 'Paint & Coatings'],
    fullInfo: 'Source high-quality ceramic tiles, natural stone, and building hardware from India\'s leading manufacturing hubs. We coordinate bulk shipments and ensure breakage-free packaging.'
  },
  {
    id: 'electronics-components',
    title: 'Electronics Components',
    icon: '📱',
    desc: 'Electronic components, PCBs, semiconductors, and assembly services',
    keys: ['PCBs', 'Electronic Components', 'LED Products', 'Consumer Electronics', 'IT Hardware', 'Telecom Equipment'],
    fullInfo: 'Bridge your supply chain with India\'s growing electronics ecosystem. We source everything from basic components to fully assembled electronic products.'
  }
];

export const productsData: Product[] = [
  {
    id: 'premium-basmati-rice',
    category: 'agro-food',
    name: 'Premium long-grain Basmati Rice',
    description: 'Authentic Indian Basmati Rice characterized by its extra-long slender grains, unique aroma, and delicious taste. Sourced from the foothills of the Himalayas.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
    features: [
      'Extra long grain with length up to 8.4mm',
      'Naturally aged for 12-24 months',
      'Non-sticky after cooking',
      'Pesticide residue-free',
      'Rich in aroma and flavor'
    ],
    specs: {
      'Average Length': '8.35 mm',
      'Moisture': '12% Max',
      'Broken Grain': '1% Max',
      'Damaged/Discolored': '0.5% Max',
      'Purity': '95% Min'
    },
    exportDetails: {
      moq: '20 Metric Tons (1 Full Container)',
      origin: 'India (Haryana/Punjab region)',
      capacity: '500 Metric Tons per month',
      packaging: '5kg, 10kg, 20kg, 50kg PP/Jute Bags',
      payment: 'L/C at sight or T/T (30% advance)',
      delivery: '15-20 days from order confirmation'
    }
  },
  {
    id: 'organic-turmeric-powder',
    category: 'agro-food',
    name: 'High-Curcumin Organic Turmeric Powder',
    description: 'Pure organic turmeric powder with high curcumin content, sourced from the Erode and Salem regions of India. Processed in ISO-certified units.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d019cb0?auto=format&fit=crop&q=80&w=800',
    features: [
      'Minimum 3.5% - 5% Curcumin content',
      '100% Organic certified (USDA/NOP)',
      'No artificial colors or preservatives',
      'Finely ground and double-polished',
      'Distinctive earthy flavor and deep yellow color'
    ],
    specs: {
      'Curcumin': '5.0% Min',
      'Moisture': '10% Max',
      'Total Ash': '7% Max',
      'Sieve Analysis': '95% through 60 mesh',
      'Acid Insoluble Ash': '1.5% Max'
    },
    exportDetails: {
      moq: '5 Metric Tons',
      origin: 'India (Tamil Nadu/Maharashtra)',
      capacity: '100 Metric Tons per month',
      packaging: '25kg Paper Bags with LDPE liner',
      payment: 'T/T or Irrevocable L/C',
      delivery: '10-15 days from deposit'
    }
  },
  {
    id: 'biodegradable-paper-bags',
    category: 'packaging',
    name: 'Biodegradable Craft Paper Bags',
    description: 'Eco-friendly, heavy-duty craft paper bags suitable for retail, food industry, and consumer goods. Fully customizable with brand logos.',
    image: 'https://images.unsplash.com/photo-1544816153-097305537613?auto=format&fit=crop&q=80&w=800',
    features: [
      '100% Recyclable and compostable',
      'High load-bearing capacity',
      'Custom printing up to 4 colors',
      'Available in various sizes and GSM',
      'Reinforced handles for durability'
    ],
    specs: {
      'Material': 'Virgin Craft Paper',
      'GSM': '80 - 150 GSM',
      'Handle Type': 'Twisted Paper / Flat Handle',
      'Load Capacity': 'Up to 10kg',
      'Print Technology': 'Flexographic Printing'
    },
    exportDetails: {
      moq: '10,000 Pieces',
      origin: 'India (Gujarat)',
      capacity: '1 Million Pieces per month',
      packaging: 'Corrugated cartons of 250/500 units',
      payment: 'T/T (50% advance)',
      delivery: '25-30 days for custom orders'
    }
  },
  {
    id: 'stainless-steel-sheets',
    category: 'industrial-raw-materials',
    name: 'Industrial Grade Stainless Steel Sheets',
    description: 'High-quality cold-rolled and hot-rolled stainless steel sheets (Grade 304/316) for industrial manufacturing and construction.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    features: [
      'Corrosion resistant Grade 304/316',
      'Smooth surface finish (2B/No.4)',
      'High tensile strength',
      'Precisely cut dimensions',
      'Standard industrial certifications'
    ],
    specs: {
      'Grade': 'SS 304 / SS 316',
      'Thickness': '0.3mm - 100mm',
      'Width': '1000mm / 1250mm / 1500mm',
      'Finish': '2B, BA, No.4, HL, Mirror',
      'Standard': 'ASTM A240 / EN 10088-2'
    },
    exportDetails: {
      moq: '5 Metric Tons',
      origin: 'India (Maharashtra)',
      capacity: '200 Metric Tons per month',
      packaging: 'Wooden pallets with steel strapping',
      payment: 'L/C at sight',
      delivery: '30-35 days'
    }
  },
  {
    id: 'industrial-dyes',
    category: 'chemicals',
    name: 'Reactive Dyes for Textile Industry',
    description: 'Premium quality reactive dyes for high-fastness dyeing of cotton and cellulose fibers. Available in a wide spectrum of shades.',
    image: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&q=80&w=800',
    features: [
      'Excellent washing and light fastness',
      'High exhaustion and fixation rates',
      'Consistent shade reproducibility',
      'Eco-friendly and low salt requirements',
      'Compatible with various dyeing methods'
    ],
    specs: {
      'Type': 'Reactive / Acid / Disperse',
      'Strength': '100% / 150% / Crude',
      'Form': 'Fine Powder / Liquid',
      'Solubility': 'Excellent',
      'pH Stability': 'Wide range'
    },
    exportDetails: {
      moq: '500 kg',
      origin: 'India (Gujarat)',
      capacity: '50 Metric Tons per month',
      packaging: '25kg HDPE Drums / Iron Drums',
      payment: 'T/T or L/C',
      delivery: '15-20 days'
    }
  },
  {
    id: 'smart-led-tv',
    category: 'consumer-products',
    name: '4K Ultra HD Smart LED Television',
    description: 'Next-generation smart TVs featuring vibrant 4K displays, integrated apps, and sleek frameless designs for the global consumer market.',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800',
    features: [
      '4K Ultra HD (3840 x 2160) Resolution',
      'Android TV / WebOS Integration',
      'Frameless bezel-less design',
      'Multiple HDMI and USB ports',
      'Built-in Voice Control and Casting'
    ],
    specs: {
      'Sizes': '32", 43", 55", 65"',
      'Display': 'LED / QLED',
      'Refresh Rate': '60Hz / 120Hz',
      'Audio': 'Dolby Digital Plus',
      'Power': '100-240V AC'
    },
    exportDetails: {
      moq: '100 Units',
      origin: 'India (Noida/Chennai)',
      capacity: '10,000 Units per month',
      packaging: 'Padded export cartons with foam inserts',
      payment: 'T/T (30% advance, 70% against BL)',
      delivery: '45 days'
    }
  },
  {
    id: 'hand-loomed-rug',
    category: 'handicrafts',
    name: 'Traditional Hand-Loomed Woolen Rug',
    description: 'Authentic hand-knotted and hand-loomed rugs featuring traditional Indian patterns. Made from premium New Zealand wool and sustainable dyes.',
    image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f505?auto=format&fit=crop&q=80&w=800',
    features: [
      '100% Hand-made by skilled artisans',
      'Premium long-staple wool',
      'Traditional and contemporary designs',
      'Eco-friendly vegetable dyes',
      'Durable and easy to maintain'
    ],
    specs: {
      'Material': '80% Wool, 20% Cotton',
      'Construction': 'Hand-Tufted / Hand-Knotted',
      'Knot Density': 'Various (Standard to Premium)',
      'Thickness': '10mm - 15mm',
      'Custom Sizes': 'Available on request'
    },
    exportDetails: {
      moq: '50 Square Meters',
      origin: 'India (Bhadohi/Varanasi)',
      capacity: '2,000 Sqm per month',
      packaging: 'Rolled in waterproof HDPE sheets',
      payment: 'T/T (50% advance)',
      delivery: '45-60 days for custom orders'
    }
  }
];
