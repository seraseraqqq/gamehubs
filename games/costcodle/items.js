/**
 * Costcodle Item Catalog
 * Curated real-world Costco products, prices, and specifications.
 */

const COSTCO_ITEMS = [
  {
    id: 1,
    name: "Kirkland Signature Rotisserie Chicken",
    category: "Fresh Deli",
    specs: "Whole 3 lb Seasoned Bird, Hot & Ready",
    price: 4.99,
    hint: "Costco's legendary loss-leader that has never changed price!",
    icon: "🍗"
  },
  {
    id: 2,
    name: "Food Court All-Beef Hot Dog & 20oz Drink",
    category: "Food Court",
    specs: "1/4 lb Beef Dog + 20oz Refillable Soda",
    price: 1.50,
    hint: "Untouched price since 1985. The founder threatened to fire anyone who raised it!",
    icon: "🌭"
  },
  {
    id: 3,
    name: "Kirkland Signature 93-inch Giant Plush Bear",
    category: "Toys & Seasonal",
    specs: "Nearly 8 Feet Tall, Weighs ~50 lbs",
    price: 299.99,
    hint: "Takes up the entire backseat of an SUV!",
    icon: "🧸"
  },
  {
    id: 4,
    name: "Kirkland Signature Butter Croissants",
    category: "Bakery",
    specs: "12-Count Freshly Baked with Pure Butter",
    price: 5.99,
    hint: "Flaky French pastry baked daily in the warehouse bakery.",
    icon: "🥐"
  },
  {
    id: 5,
    name: "Kirkland Signature Create-a-Size Paper Towels",
    category: "Household",
    specs: "12 Huge Rolls, 2-Ply, 160 Sheets per Roll",
    price: 22.99,
    hint: "The quintessential giant yellow plastic-wrapped Costco haul item.",
    icon: "🧻"
  },
  {
    id: 6,
    name: "Food Court Whole 18-inch Pizza",
    category: "Food Court",
    specs: "Cheese or Pepperoni, 18-Inch Diameter",
    price: 9.95,
    hint: "Feeds an entire party for less than ten bucks.",
    icon: "🍕"
  },
  {
    id: 7,
    name: "Kirkland Signature Golf Balls Performance+",
    category: "Sporting Goods",
    specs: "24-Pack, 3-Piece Urethane Cover Balls",
    price: 27.99,
    hint: "Famously tested to compete with $50 Titleist Pro V1s.",
    icon: "⛳"
  },
  {
    id: 8,
    name: "Kirkland Signature Whole Roasted Cashews",
    category: "Pantry & Snacks",
    specs: "2.5 lb Jar, Salted Fancy Grade",
    price: 14.99,
    hint: "A staple in the giant square plastic snack tubs.",
    icon: "🥜"
  },
  {
    id: 9,
    name: "Nutella Hazelnut Spread Twin Pack",
    category: "Pantry",
    specs: "Two 33.5 oz Jars (67 oz Total)",
    price: 14.49,
    hint: "Over 4 pounds of chocolate hazelnut goodness.",
    icon: "🍫"
  },
  {
    id: 10,
    name: "Dyson V15 Detect Extra Cordless Vacuum",
    category: "Appliances",
    specs: "Laser Dust Reveal, High-Torque Cleaner Head",
    price: 599.99,
    hint: "Premium laser-guided cord-free clean.",
    icon: "🧹"
  },
  {
    id: 11,
    name: "Food Court Chicken Bake",
    category: "Food Court",
    specs: "Hand-Rolled Dough, Chicken Breast, Bacon & Caesar",
    price: 3.99,
    hint: "The warm, cheesy, handheld cult favorite.",
    icon: "🥖"
  },
  {
    id: 12,
    name: "Kirkland Signature Thick Cut Bacon",
    category: "Meat & Poultry",
    specs: "3 lbs, Applewood Smoked, Two 1.5 lb Pouches",
    price: 13.99,
    hint: "Heavy duty breakfast staple in vacuum sealed twin-packs.",
    icon: "🥓"
  },
  {
    id: 13,
    name: "Rao's Homemade Marinara Sauce",
    category: "Pantry",
    specs: "Two 28 oz Jars (56 oz Total)",
    price: 11.89,
    hint: "The high-end Italian restaurant sauce in bulk discount.",
    icon: "🥫"
  },
  {
    id: 14,
    name: "Apple AirPods Pro 2nd Gen with USB-C",
    category: "Electronics",
    specs: "MagSafe Charging Case, Active Noise Cancellation",
    price: 189.99,
    hint: "Always priced slightly under Apple retail with Costco warranty.",
    icon: "🎧"
  },
  {
    id: 15,
    name: "Kirkland Signature Purified Drinking Water",
    category: "Beverages",
    specs: "40 Bottles (16.9 fl oz each), Mineral Enhanced",
    price: 4.39,
    hint: "The ultimate heavy cart-bottom anchor for under 5 dollars.",
    icon: "💧"
  },
  {
    id: 16,
    name: "Food Court Double Chocolate Chunk Cookie",
    category: "Food Court",
    specs: "Warm, Jumbo-Sized Cookie with Bittersweet Chunks",
    price: 2.49,
    hint: "Replaced the churro in late 2023 at over 750 calories!",
    icon: "🍪"
  },
  {
    id: 17,
    name: "Ninja Speedi Rapid Cooker & Air Fryer",
    category: "Appliances",
    specs: "6-Quart Capacity, 12-in-1 Smart Cook Functions",
    price: 129.99,
    hint: "Cooks an entire 3-part meal in 15 minutes.",
    icon: "🍳"
  },
  {
    id: 18,
    name: "Kirkland Signature Organic Extra Virgin Olive Oil",
    category: "Pantry",
    specs: "2-Liter Jug (67.6 fl oz), Cold Extracted Italian",
    price: 21.99,
    hint: "Renowned by top chefs for purity and testing standards.",
    icon: "🫒"
  },
  {
    id: 19,
    name: "KitchenAid 6-Quart Bowl-Lift Stand Mixer",
    category: "Appliances",
    specs: "Professional Series, Includes 3 Attachments & Pour Shield",
    price: 319.99,
    hint: "Heavy commercial-grade baker's dream centerpiece.",
    icon: "🍰"
  },
  {
    id: 20,
    name: "Kirkland Signature Bath Tissue 30 Rolls",
    category: "Household",
    specs: "30 Rolls, 2-Ply, 380 Sheets per Roll",
    price: 23.49,
    hint: "Costco's single highest grossing product line in history.",
    icon: "🧻"
  },
  {
    id: 21,
    name: "Squishmallows 16-inch Jumbo Plush",
    category: "Toys",
    specs: "Ultra-Soft 16\" Collectible Character Pillow",
    price: 12.99,
    hint: "Retails for $25 at specialty toy shops.",
    icon: "🦄"
  },
  {
    id: 22,
    name: "Kirkland Signature Ground Beef 88/12",
    category: "Meat & Poultry",
    specs: "~5 lb Chub Pack, 88% Lean / 12% Fat",
    price: 24.99,
    hint: "Massive log of ground beef for freezer meal prepping.",
    icon: "🥩"
  },
  {
    id: 23,
    name: "Kirkland Signature Parmigiano Reggiano Wedge",
    category: "Cheese & Dairy",
    specs: "Aged 24 Months, ~1.5 lb Imported Italian Cut",
    price: 18.50,
    hint: "Authentic stamped rind imported straight from Parma.",
    icon: "🧀"
  },
  {
    id: 24,
    name: "Food Court Ice Cream Sundae",
    category: "Food Court",
    specs: "Vanilla Soft Serve Cup with Strawberry or Choc Topping",
    price: 2.49,
    hint: "Giant swirl of ice cream for under 3 dollars.",
    icon: "🍨"
  },
  {
    id: 25,
    name: "Sonos Era 100 Smart Speaker 2-Pack",
    category: "Electronics",
    specs: "Pair of Stereo Smart Speakers with Wi-Fi & Bluetooth",
    price: 379.99,
    hint: "High-end multi-room home sound system.",
    icon: "🔊"
  },
  {
    id: 26,
    name: "Kirkland Signature Stretch-Tite Plastic Wrap",
    category: "Household",
    specs: "Two Pack (750 sq ft each = 1500 sq ft Total)",
    price: 15.99,
    hint: "Comes with the famous slide-cutter box that lasts 5 years.",
    icon: "📦"
  },
  {
    id: 27,
    name: "Kirkland Signature Organic Pure Maple Syrup",
    category: "Pantry",
    specs: "1 Liter (33.8 fl oz) Jug, Grade A Amber",
    price: 14.99,
    hint: "100% pure maple tapped from North American maple trees.",
    icon: "🥞"
  },
  {
    id: 28,
    name: "Kirkland Signature Solid White Albacore Tuna",
    category: "Pantry",
    specs: "8 Cans (7 oz each) in Water",
    price: 18.99,
    hint: "Solid steak-cut white tuna pack.",
    icon: "🐟"
  },
  {
    id: 29,
    name: "LEGO Star Wars Millennium Falcon Starship",
    category: "Toys",
    specs: "1351 Pieces, Includes 7 Minifigures",
    price: 139.99,
    hint: "Iconic galaxy starship for LEGO collectors.",
    icon: "🚀"
  },
  {
    id: 30,
    name: "Kirkland Signature Ultra Clean Liquid Detergent",
    category: "Household",
    specs: "194 fl oz Dispenser Jug (146 Loads)",
    price: 21.49,
    hint: "Massive blue laundry jug with the push-button spout.",
    icon: "🧺"
  },
  {
    id: 31,
    name: "Kirkland Signature Chocolate Chip Cookies 24ct",
    category: "Bakery",
    specs: "24 Giant Soft-Baked Cookies in Clear Clamshell",
    price: 9.99,
    hint: "Bakery fresh, loaded with chocolate chips.",
    icon: "🍪"
  },
  {
    id: 32,
    name: "Kirkland Signature Wild Alaskan Sockeye Salmon",
    category: "Frozen Seafood",
    specs: "3 lb Bag, Individually Vacuum-Packed Fillets",
    price: 36.99,
    hint: "Vibrant wild red salmon caught in icy Alaskan waters.",
    icon: "🍣"
  },
  {
    id: 33,
    name: "Weber Spirit II E-310 3-Burner Gas Grill",
    category: "Outdoor Living",
    specs: "30,000 BTU Porcelain-Enameled Cast-Iron Grates",
    price: 499.99,
    hint: "Substantial patio BBQ centerpiece.",
    icon: "🔥"
  },
  {
    id: 34,
    name: "Kirkland Signature Organic Peanut Butter",
    category: "Pantry",
    specs: "Two 28 oz Jars, Only Valencia Peanuts & Salt",
    price: 11.99,
    hint: "Pure no-stir organic twin jar favorite.",
    icon: "🥜"
  },
  {
    id: 35,
    name: "Kirkland Signature All-American Chocolate Cake",
    category: "Bakery",
    specs: "7 lb 4-Layer Giant Fudge Cake with Chocolate Shavings",
    price: 17.99,
    hint: "A legendary seven-pound monolith of chocolate indulgence.",
    icon: "🎂"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { COSTCO_ITEMS };
}
