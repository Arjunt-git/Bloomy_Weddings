$photosPath = "c:\Users\arjun\Bloomy_Weddings\assets\real_photos"
$files = Get-ChildItem -Path $photosPath -File | Where-Object { $_.Extension -match '(?i)\.(jpg|jpeg|png)$' }

$portfolioItems = [System.Collections.Generic.List[PSObject]]::new()

# Highlights (Without fake location strings)
$portfolioItems.Add([PSCustomObject]@{
    id = "real-highlight-1"
    title = "Sajis and Sana Nikkah Union"
    category = "wedding"
    image = "assets/bloomy_real_nikkah_ceremony.jpg"
    location = ""
    tag = "Holy Nikkah"
    desc = "Sacred Nikkah ceremony with white niqab veil, red rose bouquet and custom marriage agreement certificate."
})

$portfolioItems.Add([PSCustomObject]@{
    id = "real-highlight-2"
    title = "Radiant Nikkah Couple Portrait"
    category = "wedding"
    image = "assets/bloomy_real_nikkah_couple.jpg"
    location = ""
    tag = "Royal Nikkah"
    desc = "Two souls, one destiny - joyful bride and groom in fine handcrafted silver and pastel wedding attire."
})

$portfolioItems.Add([PSCustomObject]@{
    id = "real-highlight-3"
    title = "Ethereal Powder Blue Bridal Portrait"
    category = "wedding"
    image = "assets/bloomy_real_blue_bride.jpg"
    location = ""
    tag = "Bridal Portrait"
    desc = "Stunning bride graced in powder blue embroidered gown, crystal headband and delicate tulle veil."
})

$portfolioItems.Add([PSCustomObject]@{
    id = "real-highlight-4"
    title = "Seaside Oceanfront Destination Shoot"
    category = "destination"
    image = "assets/bloomy_real_coastal_collage.jpg"
    location = ""
    tag = "Destination Coast"
    desc = "Romantic destination photoshoot framed against ocean waves, palm groves and rocky shores."
})

$portfolioItems.Add([PSCustomObject]@{
    id = "real-highlight-5"
    title = "Sunhat and Dunes Editorial Portrait"
    category = "modeling"
    image = "assets/bloomy_real_coastal_model.jpg"
    location = ""
    tag = "Modeling"
    desc = "Chic fashion editorial portrait with vintage sunhat, round sunglasses and natural earthy tones."
})

$counter = 1
foreach ($file in $files) {
    $fileName = $file.Name
    $relPath = "assets/real_photos/$fileName"
    $mod = $counter % 3

    if ($mod -eq 0) {
        $cat = "wedding"
        $title = "Royal Wedding Shoot ($counter)"
        $tag = "Nikkah Wedding"
    } elseif ($mod -eq 1) {
        $cat = "destination"
        $title = "Coastal Destination Shoot ($counter)"
        $tag = "Destination"
    } else {
        $cat = "modeling"
        $title = "Fashion Editorial Portrait ($counter)"
        $tag = "Modeling"
    }

    $portfolioItems.Add([PSCustomObject]@{
        id = "real-photo-$counter"
        title = $title
        category = $cat
        image = $relPath
        location = ""
        tag = $tag
        desc = "Authentic fine-art photograph from Bloomy Weddings collection."
    })
    $counter++
}

$jsonPortfolio = $portfolioItems | ConvertTo-Json -Depth 5

$jsHeader = @"
/**
 * Bloomy Weddings Data Store - Classic Edition
 * Real Portfolio Gallery with Authentic Photographs
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
      title: "Royal Wedding & Nikkah Photography",
      category: "wedding",
      tagline: "Fine-art portraiture & timeless candid stories preserved for generations.",
      image: "assets/bloomy_real_nikkah_couple.jpg",
      badge: "ROYAL NIKKAH",
      highlights: [
        "Holy Nikkah & Traditional Wedding Coverage",
        "Fine-Art Royal Bride & Groom Portraiture",
        "Haldi, Mehendi, Oppana & Grand Reception",
        "Custom Handcrafted Heirloom Albums",
        "Cinematic 4K Heritage Wedding Films"
      ],
      description: "Your wedding is an enduring chapter of romance and tradition. Our classic photography style honors regal aesthetics, natural light, and genuine raw emotions to create timeless masterpieces."
    },
    {
      id: "destination-photography",
      title: "Destination Photography",
      category: "destination",
      tagline: "Majestic lovers framed in romantic coastlines & scenic landscapes.",
      image: "assets/bloomy_real_coastal_collage.jpg",
      badge: "DESTINATION COAST",
      highlights: [
        "Beach Coastline, Rocky Shores & Cliff Shoots",
        "Ethereal Sunset Couple Portraits",
        "Full Destination Travel Coverage",
        "Aerial Drone Cinematography",
        "Pre-Wedding Outdoor Storytelling"
      ],
      description: "From serene ocean shores and rocky cliffs to misty hills and historic venues, we capture your love story in breathtaking classic compositions across the world."
    },
    {
      id: "modeling-portfolio",
      title: "Modeling & Portraiture",
      category: "modeling",
      tagline: "Classic outdoor editorial portraits & fashion lookbooks.",
      image: "assets/bloomy_real_coastal_model.jpg",
      badge: "EDITORIAL CLASSIC",
      highlights: [
        "Natural Light & Classic Outdoor Editorial",
        "Model Comp Cards & Agency Lookbooks",
        "Fine-Art Monochromatic & Vintage Tones",
        "Creative Direction & Pose Guidance",
        "High-Resolution Print Retouching"
      ],
      description: "Crafting iconic editorial portraits with classic lighting, timeless styling, and artistic depth for fashion models and lifestyle lookbooks."
    }
  ],

  portfolio: 
"@

$jsFooter = @"
,

  pricingAddons: [
    { id: "drone", name: "Drone Aerial 4K Heritage Footage", price: 15000, desc: "Sweeping aerial cinema of venue grounds & coastal shores" },
    { id: "teaser", name: "Classic 3-Min Film Teaser + Full Movie", price: 25000, desc: "Movie-quality story film with classic acoustic scoring" },
    { id: "album", name: "Handcrafted Heirloom Leather Flush Album (40 pgs)", price: 18000, desc: "Classic velvet box, gold gilded leaf edge pages" },
    { id: "prewedding", name: "Pre-Wedding Heritage Photoshoot", price: 20000, desc: "Half-day romantic shoot with 2 classic outfit changes" },
    { id: "ledcrane", name: "Live Display & Jib Crane Setup", price: 22000, desc: "Live high-definition venue feed and smooth crane shots" }
  ],

  testimonials: [
    {
      id: "t1",
      names: "Sajis & Sana",
      type: "Nikkah Wedding Ceremony",
      rating: 5,
      avatar: "assets/bloomy_real_nikkah_couple.jpg",
      quote: "Bloomy Weddings captured our Nikkah ceremony with such sanctity, beauty, and warmth. Every frame of our ceremony feels sacred and timeless!"
    },
    {
      id: "t2",
      names: "Ananya & Rohan",
      type: "Destination Coastal Wedding",
      rating: 5,
      avatar: "assets/bloomy_real_blue_bride.jpg",
      quote: "The elegance and color tones of Bloomy Weddings are unmatched. The photos of our coastal shoot look straight out of a high-fashion classic magazine!"
    },
    {
      id: "t3",
      names: "Fathima S. (Fashion Model)",
      type: "Editorial Lookbook",
      rating: 5,
      avatar: "assets/bloomy_real_coastal_model.jpg",
      quote: "Extremely professional creative direction. The outdoor coastal portraits they shot for my portfolio are breathtaking!"
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
      a: "Simply click the WhatsApp button (+91 70251 98952) to chat directly with us or submit the enquiry form!"
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
"@

$finalJs = $jsHeader + $jsonPortfolio + $jsFooter
[System.IO.File]::WriteAllText("c:\Users\arjun\Bloomy_Weddings\data.js", $finalJs, [System.Text.Encoding]::UTF8)
Write-Host "REMOVED_FAKE_LOCATIONS_FROM_PORTFOLIO"
