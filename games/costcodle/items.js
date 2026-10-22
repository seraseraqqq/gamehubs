/**
 * Costcodle Real Product Catalog
 * Sourced directly from authentic Costco warehouse items with real photograph images.
 */

const COSTCO_ITEMS = [
  {
    "id": 1,
    "name": "Kirkland Signature Rotisserie Chicken",
    "price": 4.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kirkland-signature-rotisserie-chicken-300x300.jpg"
  },
  {
    "id": 2,
    "name": "Kirkland Signature Butter Croissants,12 ct",
    "price": 4.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kirkland-signature-butter-croissants12-ct-300x300.jpg"
  },
  {
    "id": 3,
    "name": "Kirkland Signature Chicken Salad Made with Rotisserie Chicken",
    "price": 11.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kirkland-signature-chicken-salad-made-with-rotisserie-chicken-300x300.jpg"
  },
  {
    "id": 4,
    "name": "Yummy Dino Buddies Chicken Nuggets, 5 lbs",
    "price": 11.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/yummy-dino-buddies-chicken-nuggets-5-lbs-300x300.jpg"
  },
  {
    "id": 5,
    "name": "Kirkland Signature Wild Chilean Sea Bass, 1.5 lb",
    "price": 23.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kirkland-signature-wild-chilean-sea-bass-1-5-lb-300x300.jpg"
  },
  {
    "id": 6,
    "name": "Bark Thins Dark Chocolate Almond, 20 oz",
    "price": 9.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/bark-thins-dark-chocolate-almond-20-oz-300x300.jpg"
  },
  {
    "id": 7,
    "name": "Ore-Ida Pepperoni Bagel Bites, 72 ct",
    "price": 8.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/ore-ida-pepperoni-bagel-bites-72-ct-300x300.jpg"
  },
  {
    "id": 8,
    "name": "Kirkland Signature Extra Lean Sliced Ham, 3 lb",
    "price": 7.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kirkland-signature-extra-lean-sliced-ham-3-lb-300x300.jpg"
  },
  {
    "id": 9,
    "name": "Kevin’s Natural Foods Peppercorn Steak Tips, 32 oz.",
    "price": 18.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kevins-natural-foods-peppercorn-steak-tips-32-oz-1-300x300.jpg"
  },
  {
    "id": 10,
    "name": "Phillips Jumbo Lump Crab Meat, 16 oz",
    "price": 46.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/phillips-jumbo-lump-crab-meat-16-oz-300x300.jpg"
  },
  {
    "id": 11,
    "name": "Dave’s Killer Bread Organic Good Seed, Thin-Sliced, 2 x 24 oz",
    "price": 7.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/daves-killer-bread-organic-good-seed-thin-sliced-2-x-24-oz-300x300.jpg"
  },
  {
    "id": 12,
    "name": "Raw Tail-On Shrimp 21-25 ct, 2 lbs",
    "price": 16.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/raw-tail-on-shrimp-21-25-ct-2-lbs-300x300.jpg"
  },
  {
    "id": 13,
    "name": "Glico Pocky Chocolate Biscuit Sticks, 12 x 1.41 oz",
    "price": 8.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/glico-pocky-chocolate-biscuit-sticks-12-x-1-41-oz-1-300x300.jpg"
  },
  {
    "id": 14,
    "name": "Coca-Cola de Mexican Glass Bottles, Made with Pure Cane Sugar, 24 x 16.9 oz",
    "price": 26.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/coca-cola-de-mexican-glass-bottles-made-with-pure-cane-sugar-24-x-16-9-oz-300x300.jpg"
  },
  {
    "id": 15,
    "name": "Kirkland Signature Organic Pasture Raised USDA Grade A Eggs, 24 ct",
    "price": 6.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kirkland-signature-organic-pasture-raised-usda-grade-a-eggs-24-ct-300x300.jpg"
  },
  {
    "id": 16,
    "name": "Lance Toasty Peanut Butter Cracker Sandwich, 2 X 20 ct",
    "price": 6.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/lance-toasty-peanut-butter-cracker-sandwich-2-x-20-ct-300x300.jpg"
  },
  {
    "id": 17,
    "name": "Bolthouse Farms Organic Carrot Juice, 3 x 32 fl oz",
    "price": 7.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/bolthouse-farms-organic-carrot-juice-3-x-32-fl-oz-300x300.jpg"
  },
  {
    "id": 18,
    "name": "Tassos Extra Virgin Olive Oil, Organic PDO, 1L",
    "price": 10.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/tassos-extra-virgin-olive-oil-organic-pdo-1l-300x300.jpg"
  },
  {
    "id": 19,
    "name": "Great Harvest Bread Co. Pumpkin Spice Bread, 32 oz",
    "price": 7.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/great-harvest-bread-co-pumpkin-spice-bread-32-oz-2-300x300.jpg"
  },
  {
    "id": 20,
    "name": "Organic Valley Stringles String Cheese, 24 oz",
    "price": 7.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/organic-valley-stringles-string-cheese-24-oz-300x300.jpg"
  },
  {
    "id": 21,
    "name": "Agio Anderson 7-piece Fire Outdoor Patio Dining Set",
    "price": 1799.99,
    "image": "https://images.costco-static.com/ImageDelivery/imageService?profileId=12026540&itemId=2127653-847&recipeName=680"
  },
  {
    "id": 22,
    "name": "Old Bay Seasoning, 24 oz",
    "price": 8.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/old-bay-seasoning-24-oz-300x300.jpg"
  },
  {
    "id": 23,
    "name": "Cello Shaved Parmigiano Reggiano, 16 oz",
    "price": 15.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/cello-shaved-parmigiano-reggiano-16-oz-300x300.jpg"
  },
  {
    "id": 24,
    "name": "Caribbean Food Delights Curry Chicken Patties, 50 oz",
    "price": 9.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/caribbean-food-delights-curry-chicken-patties-50-oz-300x300.jpg"
  },
  {
    "id": 25,
    "name": "Diet Coke 24 x 12 oz",
    "price": 10.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/diet-coke-24-x-12-oz-1-300x300.jpg"
  },
  {
    "id": 26,
    "name": "Arrowhead 100% Mountain Spring Water, 15 x 1 L",
    "price": 5.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/arrowhead-100-mountain-spring-water-15-x-1-l-300x300.jpg"
  },
  {
    "id": 27,
    "name": "Wild Four Organic Vanilla Maple Syrup 25.4 Oz",
    "price": 14.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/wild-four-organic-vanilla-maple-syrup-25-4-oz-300x300.jpg"
  },
  {
    "id": 28,
    "name": "Oroweat Sandwich Thins, 18 ct",
    "price": 9.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/oroweat-sandwich-thins-18-ct-300x300.jpg"
  },
  {
    "id": 29,
    "name": "McCormick Gourmet Zesty Lemon Pepper, 26 oz",
    "price": 7.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/mccormick-gourmet-zesty-lemon-pepper-26-oz-300x300.jpg"
  },
  {
    "id": 30,
    "name": "Nutella Hazelnut Spread, 6.6 lb",
    "price": 18.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/nutella-hazelnut-spread-6-6-lb-300x300.jpg"
  },
  {
    "id": 31,
    "name": "Dietz & Watson Uncured Lite Ham, 32 oz",
    "price": 11.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/dietz-watson-uncured-lite-ham-32-oz-1-300x300.jpg"
  },
  {
    "id": 32,
    "name": "Great River Organic Milling All Purpose Flour, 10 lbs",
    "price": 6.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/great-river-organic-milling-all-purpose-flour-10-lbs-1-300x300.jpg"
  },
  {
    "id": 33,
    "name": "Frigo Cheese Heads Original Mozzarella String Cheese, 60 ct",
    "price": 10.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/frigo-cheese-heads-original-mozzarella-string-cheese-60-ct-300x300.jpg"
  },
  {
    "id": 34,
    "name": "Chef-mate Country Sausage Gravy, 105 oz",
    "price": 7.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/chef-mate-country-sausage-gravy-105-oz-300x300.jpg"
  },
  {
    "id": 35,
    "name": "Kirkland Signature 1% Milk",
    "price": 2.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kirkland-signature-1-milk-1-300x300.jpg"
  },
  {
    "id": 36,
    "name": "La Fortaleza Tortilla Chips, 2 x 3 lb",
    "price": 5.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/la-fortaleza-tortilla-chips-2-x-3-lb-300x300.jpg"
  },
  {
    "id": 37,
    "name": "Poppers Jalapeno Cream Cheese Poppers, 52 oz",
    "price": 8.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/poppers-jalapeno-cream-cheese-poppers-52-oz-300x300.jpg"
  },
  {
    "id": 38,
    "name": "Kirkland Signature Organic Animal Crackers, 64 oz",
    "price": 10.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kirkland-signature-organic-animal-crackers-64-oz-300x300.jpg"
  },
  {
    "id": 39,
    "name": "Utz Pub Mix, 44 oz",
    "price": 6.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/utz-pub-mix-44-oz-300x300.jpg"
  },
  {
    "id": 40,
    "name": "Kirkland Signature Ground Coffee Medium Roast, 40 oz",
    "price": 12.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kirkland-signature-ground-coffee-medium-roast-40-oz-300x300.jpg"
  },
  {
    "id": 41,
    "name": "Kirkland Signature USDA Choice Standing Rib Roast Bone In (Half)",
    "price": 11.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kirkland-signature-usda-choice-standing-rib-roast-bone-in-half-300x300.jpg"
  },
  {
    "id": 42,
    "name": "Nature Valley Sweet & Salty Nut, 48 X 1.2 oz",
    "price": 12.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/nature-valley-sweet-salty-nut-48-x-1-2-oz-300x300.jpg"
  },
  {
    "id": 43,
    "name": "Posada Steak & Cheese Burrito, 18 x 5 oz",
    "price": 13.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/posada-steak-cheese-burrito-18-x-5-oz-300x300.jpg"
  },
  {
    "id": 44,
    "name": "Zephyrhills 100% Natural Spring Water Sport Pack, 24 X 23.7 oz",
    "price": 5.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/zephyrhills-100-natural-spring-water-sport-pack-24-x-23-7-oz-300x300.jpg"
  },
  {
    "id": 45,
    "name": "Falls Brand Thick Sliced Bacon, 4 Lb",
    "price": 19.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/falls-brand-thick-sliced-bacon-4-lb-2-300x300.jpg"
  },
  {
    "id": 46,
    "name": "Live More Organic Antioxidant Berry Blend, 6 X 8 oz",
    "price": 9.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/live-more-organic-antioxidant-berry-blend-6-x-8-oz-300x300.jpg"
  },
  {
    "id": 47,
    "name": "Tostitos Scoops Party Size, 22 oz",
    "price": 4.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/tostitos-scoops-party-size-22-oz-300x300.jpg"
  },
  {
    "id": 48,
    "name": "Kiolbassa Smoked Meats Roasted Garlic Smoked Sausage",
    "price": 16.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kiolbassa-smoked-meats-roasted-garlic-smoked-sausage-2-300x300.jpg"
  },
  {
    "id": 49,
    "name": "Paesana Non Pareil Capers, 32 oz",
    "price": 5.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/paesana-non-pareil-capers-32-oz-300x300.jpg"
  },
  {
    "id": 50,
    "name": "Cocktail Cucumber, Greenhouse Grown, 1.5 lbs",
    "price": 5.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/cocktail-cucumber-greenhouse-grown-1-5-lbs-300x300.jpg"
  },
  {
    "id": 51,
    "name": "Kirkland Signature Wild Alaskan Cod, Individually Wrapped, 2 lb",
    "price": 19.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kirkland-signature-wild-alaskan-cod-individually-wrapped-2-lb-300x300.jpg"
  },
  {
    "id": 52,
    "name": "Columbus Sliced Herb Roasted Turkey Breast, 2 x 1 lb",
    "price": 15.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/columbus-sliced-herb-roasted-turkey-breast-2-x-1-lb-300x300.jpg"
  },
  {
    "id": 53,
    "name": "Kirkland Signature Salted Butter, 4 x 1 lb",
    "price": 8.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kirkland-signature-salted-butter-4-x-1-lb-300x300.jpg"
  },
  {
    "id": 54,
    "name": "Sweets Chocolate Cinnamon Bears, 2.65 lbs",
    "price": 7.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/sweets-chocolate-cinnamon-bears-2-65-lbs-300x300.jpg"
  },
  {
    "id": 55,
    "name": "Northwest Fist Co. Atlantic Salmon, 48 oz",
    "price": 18.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/northwest-fist-co-atlantic-salmon-48-oz-300x300.jpg"
  },
  {
    "id": 56,
    "name": "Organic Annies Mac & Cheese Variety, 12 x 6 oz",
    "price": 12.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/organic-annies-mac-cheese-variety-12-x-6-oz-300x300.jpg"
  },
  {
    "id": 57,
    "name": "Brownberry Mix & Match, Pick Any 2 Loaves, 2 x 24 oz.",
    "price": 4.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/brownberry-mix-match-pick-any-2-loaves-2-x-24-oz-300x300.jpg"
  },
  {
    "id": 58,
    "name": "Kirkland Signature Variety Snacking Nut, 30 ct",
    "price": 15.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kirkland-signature-variety-snacking-nut-30-ct-300x300.jpg"
  },
  {
    "id": 59,
    "name": "Roti Fresh Original Organic Chapati, 36 ct",
    "price": 7.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/roti-fresh-original-organic-chapati-36-ct-300x300.jpg"
  },
  {
    "id": 60,
    "name": "Olde Thompson Parsley 2.5 Oz (0.156 Lbs)",
    "price": 2.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/olde-thompson-parsley-2-5-oz-0-156-lbs-300x300.jpg"
  },
  {
    "id": 61,
    "name": "Star Sliced Jalapenos, 2 x 32 oz",
    "price": 4.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/star-sliced-jalapenos-2-x-32-oz-300x300.jpg"
  },
  {
    "id": 62,
    "name": "Blue Moose Organic Queso Blanco Cashew Dip, 24 oz",
    "price": 6.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/blue-moose-organic-queso-blanco-cashew-dip-24-oz-300x300.jpg"
  },
  {
    "id": 63,
    "name": "Skittles Tropical Bulk Full Size Chewy Candy, 2.17 oz, 36 ct",
    "price": 26.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/skittles-tropical-bulk-full-size-chewy-candy-2-17-oz-36-ct-300x300.jpg"
  },
  {
    "id": 64,
    "name": "Hempler’s Uncured Zero Sugar Bacon 2/1.5 Lb",
    "price": 15.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/hemplers-uncured-zero-sugar-bacon-2-1-5-lb-1-300x300.jpg"
  },
  {
    "id": 65,
    "name": "Creminelli Sopressata Snack Tray, 3 x 2.2oz",
    "price": 9.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/creminelli-sopressata-snack-tray-3-x-2-2oz-300x300.jpg"
  },
  {
    "id": 66,
    "name": "Halm’s Enterprise Hawaiian Style BBQ Sauce, 64 oz",
    "price": 12.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/halms-enterprise-hawaiian-style-bbq-sauce-64-oz-300x300.jpg"
  },
  {
    "id": 67,
    "name": "Orca Bay Flounder Fillets, 3 lbs",
    "price": 14.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/orca-bay-flounder-fillets-3-lbs-300x300.jpg"
  },
  {
    "id": 68,
    "name": "Belfiore Crumbled Feta, 2 x 12 oz",
    "price": 6.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/belfiore-crumbled-feta-2-x-12-oz-300x300.jpg"
  },
  {
    "id": 69,
    "name": "Ivar’s Clam Chowder with Bacon, 2/24 oz",
    "price": 9.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/ivars-clam-chowder-with-bacon-2-24-oz-2-300x300.jpg"
  },
  {
    "id": 70,
    "name": "Gala Apples, 4 lbs",
    "price": 5.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/gala-apples-4-lbs-1-300x300.jpg"
  },
  {
    "id": 71,
    "name": "Organic Roast Ruta Maya Espresso, 2.2 lbs",
    "price": 14.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/organic-roast-ruta-maya-espresso-2-2-lbs-300x300.jpg"
  },
  {
    "id": 72,
    "name": "Hillshire Farm Lunch Meat Variety Pack, 3 x 1 lb",
    "price": 12.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/hillshire-farm-lunch-meat-variety-pack-3-x-1-lb-300x300.jpg"
  },
  {
    "id": 73,
    "name": "Good Foods Organic Chunky Guacamole, 3 x 10 oz",
    "price": 10.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/good-foods-organic-chunky-guacamole-3-x-10-oz-1-300x300.jpg"
  },
  {
    "id": 74,
    "name": "High Liner Tortilla Crusted Tilapia, 32 oz",
    "price": 13.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/high-liner-tortilla-crusted-tilapia-32-oz-1-300x300.jpg"
  },
  {
    "id": 75,
    "name": "Cattle Drive Beef Chili With Bean, 8 x 15 oz",
    "price": 10.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/cattle-drive-beef-chili-with-bean-8-x-15-oz-300x300.jpg"
  },
  {
    "id": 76,
    "name": "Kirkland Signature Macadamia Caramel Milk Chocolate, 32 oz",
    "price": 14.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kirkland-signature-macadamia-caramel-milk-chocolate-32-oz-300x300.jpg"
  },
  {
    "id": 77,
    "name": "King Arthur Gluten Free Flour Measure For Measure, 5 lbs",
    "price": 7.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/king-arthur-gluten-free-flour-measure-for-measure-5-lbs-2-300x300.jpg"
  },
  {
    "id": 78,
    "name": "Shark Performance UltraLight Corded Stick Vacuum with DuoClean",
    "price": 199.99,
    "image": "https://images.costco-static.com/ImageDelivery/imageService?profileId=12026540&itemId=5940049-847&recipeName=680"
  },
  {
    "id": 79,
    "name": "Brazi Bites Brazilian Cheese Bread, 36 oz",
    "price": 11.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/brazi-bites-brazilian-cheese-bread-36-oz-300x300.jpg"
  },
  {
    "id": 80,
    "name": "Keurig K-Supreme Plus Special Edition Single Serve Coffee Maker, with 18 K-Cup Pods",
    "price": 139.99,
    "image": "https://images.costco-static.com/ImageDelivery/imageService?profileId=12026540&itemId=4881975-847&recipeName=680"
  },
  {
    "id": 81,
    "name": "Two Good Greek Yogurt, 12 x 5.3 oz",
    "price": 10.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/two-good-greek-yogurt-12-x-5-3-oz-300x300.jpg"
  },
  {
    "id": 82,
    "name": "Lindsay Naturals Large Black Pitted Olives, 6 X 6 oz",
    "price": 7.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/lindsay-naturals-large-black-pitted-olives-6-x-6-oz-300x300.jpg"
  },
  {
    "id": 83,
    "name": "Societe Roquefort Baragnaudes, 7 oz",
    "price": 6.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/societe-roquefort-baragnaudes-7-oz-300x300.jpg"
  },
  {
    "id": 84,
    "name": "Samsung 85\" Class - CU7000D Series - 4K UHD LED LCD TV",
    "price": 899.99,
    "image": "https://images.costco-static.com/ImageDelivery/imageService?profileId=12026540&itemId=9085007-847&recipeName=680"
  },
  {
    "id": 85,
    "name": "Bom Bombs Break-Apart Decorated Cocoa Bombs,16 x 21.44 oz",
    "price": 17.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/bom-bombs-break-apart-decorated-cocoa-bombs16-x-21-44-oz-300x300.jpg"
  },
  {
    "id": 86,
    "name": "Kirkland Signature Paper Towels, 2-Ply, 160 Sheets, 12 Individually Wrapped Rolls",
    "price": 22.99,
    "image": "https://images.costco-static.com/ImageDelivery/imageService?profileId=12026540&itemId=512599-847&recipeName=680"
  },
  {
    "id": 87,
    "name": "Goldfish Baked Snack Crackers, Cheddar, 66 oz",
    "price": 14.99,
    "image": "https://images.costco-static.com/ImageDelivery/imageService?profileId=12026540&itemId=1542070-847&recipeName=680"
  },
  {
    "id": 88,
    "name": "Perrier Slim Can Lime, 35 x 8.45 fl oz",
    "price": 16.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/perrier-slim-can-lime-35-x-8-45-fl-oz-300x300.jpg"
  },
  {
    "id": 89,
    "name": "Kirkland Signature Almonds, Milk Chocolate, 3 lb",
    "price": 16.99,
    "image": "https://images.costco-static.com/ImageDelivery/imageService?profileId=12026540&itemId=376052-847&recipeName=680"
  },
  {
    "id": 90,
    "name": "Kirkland Signature Organic Broccoli Florets, 4 x 1 lb",
    "price": 6.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kirkland-signature-organic-broccoli-florets-4-x-1-lb-300x300.jpg"
  },
  {
    "id": 91,
    "name": "Alaska Sausage Co. Hot Alaskan Sausage with Reindeer Meat, 3 lbs",
    "price": 18.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/20220922-150905-300x300.jpg"
  },
  {
    "id": 92,
    "name": "Crofter’s Organic Triple Berry Just Fruit Spread, 28 oz",
    "price": 6.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/crofters-organic-triple-berry-just-fruit-spread-28-oz-300x300.jpg"
  },
  {
    "id": 93,
    "name": "Hostess Cupcakes & Twinkies, 32 ct",
    "price": 6.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/hostess-cupcakes-twinkies-32-ct-300x300.jpg"
  },
  {
    "id": 94,
    "name": "Kirkland Signature Shredded Mozzarella, 2 X 2.5 lb",
    "price": 12.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kirkland-signature-shredded-mozzarella-2-x-2-5-lb-300x300.jpg"
  },
  {
    "id": 95,
    "name": "Garlic Gold Organic, 2 x 6.4 oz",
    "price": 12.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/garlic-gold-organic-2-x-6-4-oz-2-300x300.jpg"
  },
  {
    "id": 96,
    "name": "Lance Toastchee Toasty, 36 ct",
    "price": 7.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/lance-toastchee-toasty-36-ct-300x300.jpg"
  },
  {
    "id": 97,
    "name": "Heinz Organic Ketchup, 2 x 44 oz",
    "price": 8.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/heinz-organic-ketchup-2-x-44-oz-1-300x300.jpg"
  },
  {
    "id": 98,
    "name": "Organic Blackberries, 12 oz",
    "price": 9.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/organic-blackberries-12-oz-300x300.jpg"
  },
  {
    "id": 99,
    "name": "Duracell Coppertop Alkaline AA Batteries, 40-count",
    "price": 20.99,
    "image": "https://images.costco-static.com/ImageDelivery/imageService?profileId=12026540&itemId=1625149-847&recipeName=680"
  },
  {
    "id": 100,
    "name": "Disney Holiday Village with Lights and Music",
    "price": 129.99,
    "image": "https://images.costco-static.com/ImageDelivery/imageService?profileId=12026539&itemId=1601337-894&recipeName=680"
  },
  {
    "id": 101,
    "name": "Swedish Fish Red, 24 x 2 oz",
    "price": 14.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/swedish-fish-red-24-x-2-oz-300x300.jpg"
  },
  {
    "id": 102,
    "name": "Kirkland Signature French Brie, 1.32 lb",
    "price": 8.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kirkland-signature-french-brie-1-32-lb-300x300.jpg"
  },
  {
    "id": 103,
    "name": "Kirkland Signature Organic Strawberry Spread, 42 oz",
    "price": 7.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kirkland-signature-organic-strawberry-spread-42-oz-300x300.jpg"
  },
  {
    "id": 104,
    "name": "Apple Watch Series 9 (GPS)",
    "price": 389.99,
    "image": "https://images.costco-static.com/ImageDelivery/imageService?profileId=12026540&itemId=4000062400-847&recipeName=680&swatchId=midnight"
  },
  {
    "id": 105,
    "name": "Dujardin Organic Mango Chunks, 5 lbs",
    "price": 9.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/dujardin-organic-mango-chunks-5-lbs-1-300x300.jpg"
  },
  {
    "id": 106,
    "name": "Kirkland Signature Mild Cheddar, 2 lb",
    "price": 4.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kirkland-signature-mild-cheddar-2-lb-300x300.jpg"
  },
  {
    "id": 107,
    "name": "Made In Nature Organic Dates, 40 oz",
    "price": 7.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/made-in-nature-organic-dates-40-oz-300x300.jpg"
  },
  {
    "id": 108,
    "name": "Ninja Foodi 7-in-1 DualZone FlexBasket Air Fryer with 11-qt MegaZone",
    "price": 139.99,
    "image": "https://images.costco-static.com/ImageDelivery/imageService?profileId=12026540&itemId=4488088-847&recipeName=680"
  },
  {
    "id": 109,
    "name": "Kirkland Signature Shrimp Tray with Cocktail Sauce & Lemon",
    "price": 13.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kirkland-signature-shrimp-tray-with-cocktail-sauce-lemon-300x300.jpg"
  },
  {
    "id": 110,
    "name": "SkinnyPop Popcorn, 28 x .65 oz",
    "price": 12.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/skinnypop-popcorn-28-x-65-oz-300x300.jpg"
  },
  {
    "id": 111,
    "name": "Galbani Whole Milk String Cheese, 60 X 1 oz",
    "price": 10.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/galbani-whole-milk-string-cheese-60-x-1-oz-1-300x300.jpg"
  },
  {
    "id": 112,
    "name": "Belgioioso Sliced Mild Provolone, 2 lb",
    "price": 8.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/belgioioso-sliced-mild-provolone-2-lb-300x300.jpg"
  },
  {
    "id": 113,
    "name": "Kirkland Signature Organic Raw Kombucha, 8 x 16 fl oz",
    "price": 12.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kirkland-signature-organic-raw-kombucha-8-x-16-fl-oz-300x300.jpg"
  },
  {
    "id": 114,
    "name": "Thomasville Tisdale Fabric Sectional with Storage Ottoman",
    "price": 1699.99,
    "image": "https://images.costco-static.com/ImageDelivery/imageService?profileId=12026540&itemId=4000045422-847&recipeName=680&swatchId=gray"
  },
  {
    "id": 115,
    "name": "Jones Chicken Sausage Links, 3 lbs",
    "price": 13.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/jones-chicken-sausage-links-3-lbs-1-300x300.jpg"
  },
  {
    "id": 116,
    "name": "Pirate's Booty Aged White Cheddar 40 / 5 oz bags",
    "price": 10.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/pirates-booty-aged-white-cheddar-40-5-oz-bags-300x300.jpg"
  },
  {
    "id": 117,
    "name": "CORE 6-Person Lighted Dome Tent",
    "price": 114.99,
    "image": "https://images.costco-static.com/ImageDelivery/imageService?profileId=12026540&itemId=2622061-847&recipeName=680"
  },
  {
    "id": 118,
    "name": "Kirkland Signature Sliced Peaches, 4 x 24 oz",
    "price": 8.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kirkland-signature-sliced-peaches-4-x-24-oz-300x300.jpg"
  },
  {
    "id": 119,
    "name": "Mini Seedless Watermelon, 2 ct",
    "price": 8.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/mini-seedless-watermelon-2-ct-300x300.jpg"
  },
  {
    "id": 120,
    "name": "Tuscany Assorted Cookie Pies, 25 oz",
    "price": 10.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/tuscany-assorted-cookie-pies-25-oz-300x300.jpg"
  },
  {
    "id": 121,
    "name": "Grape Tomatoes, Greenhouse Grown, 2 lbs",
    "price": 6.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/grape-tomatoes-greenhouse-grown-2-lbs-1-300x300.jpg"
  },
  {
    "id": 122,
    "name": "Home and Body Botanical + Herbal Hand Soap, Glass Bottles, 8-pack",
    "price": 37.99,
    "image": "https://images.costco-static.com/ImageDelivery/imageService?profileId=12026540&itemId=1758782-847&recipeName=680"
  },
  {
    "id": 123,
    "name": "Pura Vida Roasted Veg Melange, 4 lbs",
    "price": 14.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/pura-vida-roasted-veg-melange-4-lbs-300x300.jpg"
  },
  {
    "id": 124,
    "name": "Kirkland Signature Extra-Large Absorbent Pads, 30 in L X 23 in W, 100-count",
    "price": 20.99,
    "image": "https://images.costco-static.com/ImageDelivery/imageService?profileId=12026540&itemId=956696-inc&recipeName=680"
  },
  {
    "id": 125,
    "name": "La Boulangere Chocolate Crepes, 20 ct",
    "price": 6.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/la-boulangere-chocolate-crepes-20-ct-300x300.jpg"
  },
  {
    "id": 126,
    "name": "Ito En Black Milk Tea, 12 X 11.8 oz",
    "price": 13.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/ito-en-black-milk-tea-12-x-11-8-oz-2-300x300.jpg"
  },
  {
    "id": 127,
    "name": "LG XBoom Go XG5 Portable Wireless Speaker",
    "price": 79.99,
    "image": "https://images.costco-static.com/ImageDelivery/imageService?profileId=12026540&itemId=1782756-847&recipeName=680"
  },
  {
    "id": 128,
    "name": "Ghirardelli Chocolate Sauce, 87.3 oz",
    "price": 11.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/ghirardelli-chocolate-sauce-87-3-oz-300x300.jpg"
  },
  {
    "id": 129,
    "name": "Kirkland Signature Platinum Performance UltraShine Dishwasher Detergent Pacs, 115-count",
    "price": 13.99,
    "image": "https://images.costco-static.com/ImageDelivery/imageService?profileId=12026540&itemId=1452518-847&recipeName=680"
  },
  {
    "id": 130,
    "name": "Love Organic Beets, 42.3 oz",
    "price": 7.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/love-organic-beets-42-3-oz-300x300.jpg"
  },
  {
    "id": 131,
    "name": "Tree Top Apple Sauce, 4 x 47.25 oz",
    "price": 8.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/tree-top-apple-sauce-4-x-47-25-oz-300x300.jpg"
  },
  {
    "id": 132,
    "name": "M&M’s Bulk Chocolate Candy, Peanut Butter, 1.63 oz, 24 ct",
    "price": 16.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/mms-bulk-chocolate-candy-peanut-butter-1-63-oz-24-ct-300x300.jpg"
  },
  {
    "id": 133,
    "name": "Lay’s Potato Chips Vendor Pack, 50 x 1 oz",
    "price": 14.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/lays-potato-chips-vendor-pack-50-x-1-oz-300x300.jpg"
  },
  {
    "id": 134,
    "name": "YardLine Play Systems Turbo Racer Playset",
    "price": 1499.99,
    "image": "https://images.costco-static.com/ImageDelivery/imageService?profileId=12026540&itemId=100535029-847&recipeName=680"
  },
  {
    "id": 135,
    "name": "Cion Bakery Honey Castella, 12 ct",
    "price": 12.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/cion-bakery-honey-castella-12-ct-300x300.jpg"
  },
  {
    "id": 136,
    "name": "Tyson Foods Panko Breaded Chicken Tenders, 5 lbs",
    "price": 19.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/tyson-foods-panko-breaded-chicken-tenders-5-lbs-300x300.jpg"
  },
  {
    "id": 137,
    "name": "Kirkland Signature Organic Plain Soy Milk",
    "price": 12.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/kirkland-signature-organic-plain-soy-milk-300x300.jpg"
  },
  {
    "id": 138,
    "name": "S&W Tomato Puree Premium Tomatoes, 106 oz",
    "price": 3.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/sw-tomato-puree-premium-tomatoes-106-oz-300x300.jpg"
  },
  {
    "id": 139,
    "name": "Foster Farms Ground Turkey, 4 x 1.67 lbs",
    "price": 18.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/foster-farms-ground-turkey-4-x-1-67-lbs-1-300x300.jpg"
  },
  {
    "id": 140,
    "name": "Nong Shim Shin Big Bowl, 12 x 4.02 oz",
    "price": 14.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/nong-shim-shin-big-bowl-12-x-4-02-oz-300x300.jpg"
  },
  {
    "id": 141,
    "name": "Avocado Hass Variety, 6 ct",
    "price": 7.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/avocado-hass-variety-6-ct-300x300.jpg"
  },
  {
    "id": 142,
    "name": "Fresh Gourmet Roasted Garlic Focaccia Croutons, 32 oz",
    "price": 5.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/fresh-gourmet-roasted-garlic-focaccia-croutons-32-oz-1-300x300.jpg"
  },
  {
    "id": 143,
    "name": "Ivar’s Rustic Zuppa Toscana, 2 X 24 oz",
    "price": 9.49,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/ivars-rustic-zuppa-toscana-2-x-24-oz-1-300x300.jpg"
  },
  {
    "id": 144,
    "name": "Nutribullet Pro Single Serve Blender Matte",
    "price": 79.99,
    "image": "https://images.costco-static.com/ImageDelivery/imageService?profileId=12026540&itemId=4000206006-847&recipeName=680"
  },
  {
    "id": 145,
    "name": "Abuelita Tortilla Chips, 32 oz",
    "price": 3.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/20220922-145816-300x300.jpg"
  },
  {
    "id": 146,
    "name": "Hawaiian Eateries Potato & Mac Salad, 3 lbs",
    "price": 6.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/hawaiian-eateries-potato-mac-salad-3-lbs-1-300x300.jpg"
  },
  {
    "id": 147,
    "name": "Heinz All Natural Distilled White Vinegar, 1.32 gal",
    "price": 2.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/heinz-all-natural-distilled-white-vinegar-1-32-gal-1-300x300.jpg"
  },
  {
    "id": 148,
    "name": "Michel De France Cocktail Blinis 30Ct 8.99oz (0.561lbs)",
    "price": 2.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/michel-de-france-cocktail-blinis-30ct-8-99oz-0-561lbs-300x300.jpg"
  },
  {
    "id": 149,
    "name": "Fromager D’ Affinois Imported From France, 16 oz",
    "price": 10.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/fromager-d-affinois-imported-from-france-16-oz-1-300x300.jpg"
  },
  {
    "id": 150,
    "name": "Enjoy Premium Coffee Arare 18/19 Gram Bags",
    "price": 8.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/enjoy-premium-coffee-arare-18-19-gram-bags-1-300x300.jpg"
  },
  {
    "id": 151,
    "name": "Hadley Date Gardens Deglet Noor Organic Whole Pitted Dates, 2.5 lb",
    "price": 7.99,
    "image": "https://costcofdb.com/wp-content/uploads/2022/01/hadley-date-gardens-deglet-noor-organic-whole-pitted-dates-2-5-lb-1-300x300.jpg"
  },
  {
    "id": 152,
    "name": "Crest Complete + Scope Advanced Active Foam Toothpaste, 8.2 oz, 5-pack",
    "price": 15.99,
    "image": "https://images.costco-static.com/ImageDelivery/imageService?profileId=12026540&itemId=1504495-847&recipeName=680"
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { COSTCO_ITEMS };
}
