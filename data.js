/**
 * Bloomy Weddings Data Store - Classic Edition
 * Services, Portfolio Gallery, Package Estimator, Testimonials & FAQs
 */

const BLOOMY_DATA = {
  brand: {
    name: "BLOOMY WEDDINGS",
    tagline: "Fine-Art Heritage & Timeless Romance Photography",
    phone: "+917025198952",
    displayPhone: "+91 70251 98952",
    whatsappLink: "https://wa.me/917025198952?text=Hi%20Bloomy%20Weddings%2C%20I%20would%20like%20to%20enquire%20about%20your%20classic%20photography%20services!",
    instagram: "https://www.instagram.com/bloomy_weddings/",
    threads: "https://www.threads.com/@bloomy_weddings",
    threadsAlt: "https://www.threads.net/@bloomy_weddings",
    email: "enquire@bloomyweddings.com",
    location: "Kerala, India & Royal Destinations Worldwide",
    experienceYears: "12+",
    couplesCaptured: "600+",
    destinationsCovered: "50+"
  },

  services: [
    {
      id: "wedding-photography",
      title: "Royal Wedding Photography",
      category: "wedding",
      tagline: "Fine-art portraiture & timeless candid stories preserved for generations.",
      image: "assets/classic_wedding.jpg",
      badge: "CLASSIC HERITAGE",
      highlights: [
        "Traditional & Candid Storytelling",
        "Fine-Art Royal Portraiture",
        "Haldi, Mehendi & Grand Reception",
        "Custom Handcrafted Heirloom Albums",
        "Cinematic 4K Heritage Films"
      ],
      description: "Your wedding is an enduring chapter of romance and tradition. Our classic photography style honors regal aesthetics, natural light, and genuine raw emotions to create timeless masterpieces."
    },
    {
      id: "destination-photography",
      title: "Destination Photography",
      category: "destination",
      tagline: "Majestic lovers framed in romantic palaces & coastal landscapes.",
      image: "assets/destination_service.jpg",
      badge: "ROYAL DESTINATIONS",
      highlights: [
        "Palace, Fort & Beach Coastline Shoots",
        "Ethereal Sunset Couple Portraits",
        "Full Destination Travel Coverage",
        "Aerial Drone Cinematography",
        "Pre-Wedding Storytelling Sessions"
      ],
      description: "From historic forts in Rajasthan to misty backwaters and tropical shores, we capture your love story in breathtaking classic compositions across the world."
    },
    {
      id: "modeling-portfolio",
      title: "Modeling & Portraiture",
      category: "modeling",
      tagline: "Classic editorial portraits & high-fashion lookbooks.",
      image: "assets/modeling_service.jpg",
      badge: "EDITORIAL CLASSIC",
      highlights: [
        "Classic Rembrandt & Vogue Studio Lighting",
        "Model Comp Cards & Agency Lookbooks",
        "Fine-Art Monochromatic Black & White",
        "Creative Direction & Pose Guidance",
        "High-Resolution Print Retouching"
      ],
      description: "Crafting iconic editorial portraits with classic lighting, timeless styling, and artistic depth for aspiring and professional fashion models."
    },
    {
      id: "birthday-parties",
      title: "Birthday Party & Galas",
      category: "birthday",
      tagline: "Warm family celebrations & unforgettable milestone moments.",
      image: "assets/birthday_service.jpg",
      badge: "MILESTONES",
      highlights: [
        "Milestone Galas (1st, 18th, 50th+)",
        "Candle Lighting & Cake Ceremonies",
        "Classic Family Group Portraits",
        "Joyful Guest & Children Candids",
        "High-Resolution Memory Keepsakes"
      ],
      description: "Preserve the laughter, warmth, and magic of your milestone birthdays with classic event photography designed to be treasured for decades."
    }
  ],

  portfolio: [
    {
      id: "gal-classic-1",
      title: "Royal Heritage Palace Wedding",
      category: "wedding",
      image: "assets/classic_wedding.jpg",
      location: "Udaipur Palace, Rajasthan",
      tag: "Classic Wedding",
      desc: "Timeless portraiture of bride and groom in vintage royal palace corridors."
    },
    {
      id: "gal-1",
      title: "Sunset Backwater Romance",
      category: "wedding",
      image: "assets/hero_wedding.jpg",
      location: "Kumarakom, Kerala",
      tag: "Wedding",
      desc: "Enchanting golden hour wedding shoot overlooking serene waters."
    },
    {
      id: "gal-3",
      title: "Coastal Cliffside Destination",
      category: "destination",
      image: "assets/destination_service.jpg",
      location: "Varkala Coast, India",
      tag: "Destination",
      desc: "Classic lovers framed along picturesque ocean cliffs."
    },
    {
      id: "gal-4",
      title: "Classic Editorial Portrait",
      category: "modeling",
      image: "assets/modeling_service.jpg",
      location: "Bloomy Studio",
      tag: "Modeling",
      desc: "Sophisticated studio portraiture with timeless Rembrandt lighting."
    },
    {
      id: "gal-5",
      title: "Traditional Haldi Celebration",
      category: "wedding",
      image: "assets/haldi_gallery.jpg",
      location: "Calicut, Kerala",
      tag: "Wedding",
      desc: "Vibrant Haldi ceremony filled with marigold blooms and pure joy."
    },
    {
      id: "gal-6",
      title: "Mist & Mountain Pre-Wedding",
      category: "destination",
      image: "assets/destination_sunset.jpg",
      location: "Munnar Hills, Kerala",
      tag: "Destination",
      desc: "Ethereal pre-wedding shoot amidst rolling misty hills."
    },
    {
      id: "gal-7",
      title: "Milestone Birthday Gala",
      category: "birthday",
      image: "assets/birthday_service.jpg",
      location: "Kochi, Kerala",
      tag: "Birthday",
      desc: "Golden birthday celebration surrounded by warm fairy lights."
    }
  ],

  pricingAddons: [
    { id: "drone", name: "Drone Aerial 4K Heritage Footage", price: 15000, desc: "Sweeping aerial cinema of palace/venue grounds" },
    { id: "teaser", name: "Classic 3-Min Film Teaser + Full Movie", price: 25000, desc: "Movie-quality story film with classic acoustic scoring" },
    { id: "album", name: "Handcrafted Heirloom Leather Flush Album (40 pgs)", price: 18000, desc: "Classic velvet box, gold gilded leaf edge pages" },
    { id: "prewedding", name: "Pre-Wedding Heritage Photoshoot", price: 20000, desc: "Half-day romantic shoot with 2 classic outfit changes" },
    { id: "ledcrane", name: "Live Display & Jib Crane Setup", price: 22000, desc: "Live high-definition venue feed and smooth crane shots" }
  ],

  testimonials: [
    {
      id: "t1",
      names: "Ananya & Rohan",
      type: "Destination Palace Wedding",
      rating: 5,
      avatar: "assets/classic_wedding.jpg",
      quote: "Bloomy Weddings gave our wedding photos a regal, classic royal feel that looks like a painting. We couldn't be happier with our handcrafted heirloom album!"
    },
    {
      id: "t2",
      names: "Dr. Siddharth & Meera",
      type: "Traditional Kerala Wedding",
      rating: 5,
      avatar: "assets/wedding_service.jpg",
      quote: "The elegance and timeless color grading of Bloomy Weddings is second to none. They captured every emotional moment with immense grace."
    },
    {
      id: "t3",
      names: "Nisha V. (Fashion Model)",
      type: "Editorial Portfolio",
      rating: 5,
      avatar: "assets/modeling_service.jpg",
      quote: "Classic, artistic, and deeply professional. The studio portraits Bloomy Weddings created are the standout highlight of my portfolio."
    }
  ],

  faqs: [
    {
      q: "What defines Bloomy Weddings' Classic Photography style?",
      a: "Our Classic style emphasizes natural skin tones, timeless color grading, painterly lighting, and elegant composition that never goes out of fashion."
    },
    {
      q: "How far in advance should we reserve our date?",
      a: "We recommend booking 3 to 6 months in advance for wedding dates to ensure availability for our lead creative director."
    },
    {
      q: "Do you travel for outstation & destination weddings?",
      a: "Yes! We travel across India (Goa, Rajasthan, Kerala, Coorg, etc.) and international destinations worldwide."
    },
    {
      q: "How can we get an instant quote or book a consultation?",
      a: "Use our interactive Package Estimator on this page, or click the WhatsApp button (+91 70251 98952) to chat directly with us!"
    }
  ]
};

function getCustomPortfolio() {
  const stored = localStorage.getItem("bloomy_custom_portfolio");
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { console.error(e); }
  }
  return BLOOMY_DATA.portfolio;
}

function saveCustomPortfolio(portfolioArray) {
  localStorage.setItem("bloomy_custom_portfolio", JSON.stringify(portfolioArray));
}
