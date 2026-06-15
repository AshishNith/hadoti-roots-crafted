import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import Review from "./models/Review.js";

// Load environment variables
dotenv.config();

const indianNames = [
  "Amit Sharma", "Rajesh Patel", "Suresh Kumar", "Ramesh Verma", "Vikram Singh",
  "Sunil Dutt", "Deepak Gupta", "Manoj Joshi", "Sanjay Nair", "Alok Mishra",
  "Ashish Ranjan", "Devendra Yadav", "Nitin Saxena", "Vijay Kulkarni", "Harish Rao",
  "Rahul Mehta", "Sandeep Patil", "Rakesh Dwivedi", "Manish Tiwari", "Gaurav Kapoor",
  "Priya Sharma", "Sunita Patel", "Anjali Verma", "Kiran Singh", "Deepa Gupta",
  "Neha Nair", "Swati Mishra", "Ritu Yadav", "Pooja Kulkarni", "Shweta Rao",
  "Kavita Mehta", "Aarti Joshi", "Divya Patil", "Meenakshi Tiwari", "Shalini Kapoor",
  "Sneha Saxena", "Jyoti Dwivedi", "Preeti Kulkarni", "Rashmi Rao", "Vandana Sharma",
  "Aditya Bhat", "Rohan Deshmukh", "Nikhil Sen", "Karan Johar", "Abhishek Goel",
  "Neha Gupta", "Ritu Phogat", "Shreya Ghoshal", "Tanvi Shah", "Rhea Pillai"
];

const categoryReviews = {
  dals: [
    "The quality of this dal is exceptional. It cooks so fast and tastes exactly like the dal we get in our village.",
    "Pure, clean, and completely stone-ground. No artificial polish. Strongly recommended!",
    "Bahut hi badhiya quality hai. Hand-cleaned and very fresh.",
    "Authentic Rajasthani taste. It retains its texture and doesn't become mushy.",
    "Cleanest dal I have purchased online. No stones or dirt at all.",
    "Aroma is amazing when cooking. You can tell it's sun-dried.",
    "Tastes extremely nutritious and light on stomach. Will buy again.",
    "Hadoti Farms has maintained excellent quality. Panchratan dal is my favorite.",
    "Excellent product. No chemical smell, pure organic dal.",
    "Good packaging, quick delivery, and very delicious dal.",
    "This has become a daily staple in our house. Very healthy.",
    "Reminds me of my childhood. Earthy taste and high quality.",
    "Very clean dal, requires less water to cook and tastes sweet.",
    "Organic and unpolished dals are hard to find. This one is perfect.",
    "Quality is top notch. Delivery was fast too.",
    "Absolutely clean dal, didn't find a single stone. Cooks beautifully.",
    "The natural taste is so good. We can clearly feel the difference from polished ones.",
    "Bundi's soil richness is evident in the taste. Superb!",
    "Light, delicious, and full of protein. Essential for daily meals.",
    "Very happy with this organic option. Authentic flavor."
  ],
  masalas: [
    "The aroma of this masala is outstanding. Just a pinch is enough.",
    "Mathania red chilli powder has a gorgeous color and the heat is perfect, not overwhelming.",
    "Bahut hi swadist aur khushbudaar masala hai. Completely organic.",
    "Freshly ground spice taste. Way better than packaged big brands.",
    "The color of this chilli powder is so vibrant! Love it.",
    "You can tell it is stone-ground. The texture is perfect.",
    "Gives a very nice authentic Rajasthani flavour to my curries.",
    "No artificial colors added. Purity is 100% visible.",
    "Amazing fragrance, makes the food smell delicious.",
    "High quality chilli powder, very happy with the purchase.",
    "Very fresh and authentic spice blend. Highly recommended.",
    "Perfect balance of color and heat. Truly single origin.",
    "Real taste of Mathania. Reminds me of traditional Jodhpur curries.",
    "Extremely fresh, packaging preserves the aroma well.",
    "Best chilli powder I have ever bought. Authentic taste.",
    "The spices are fresh and hand-milled, you can taste the quality.",
    "Wonderful aroma! The curries taste so much better now.",
    "Pure and unadulterated spice, exactly what I was looking for.",
    "Highly aromatic and spicy. Perfect flavor addition to Rajasthani dishes.",
    "The glass jar packaging is excellent, retains the freshness perfectly."
  ],
  grains: [
    "The rotis made from this Sharbati wheat are extremely soft and stay fresh for hours.",
    "Stone-ground flour makes a massive difference. You can feel the bran/fiber.",
    "Bahut hi mulayam roti banti hai. Healthiest flour ever.",
    "Authentic stone-ground taste. No comparison to packaged store-bought atta.",
    "Excellent ragi/jowar flour. Freshly milled and clean.",
    "Perfect texture, not too fine, just how a traditional chikki flour should be.",
    "Roti remains soft even if kept for the next meal.",
    "Love the custom blend option! Customized it to my needs and it's perfect.",
    "Purity you can taste. Makes delicious and nutritious rotis.",
    "Great source of fiber, highly recommended for health-conscious people.",
    "Freshly milled flour smells amazing when kneading.",
    "Tried the Bajra/Jowar atta, absolutely amazing and diabetic-friendly.",
    "No adulteration. Authentic and healthy flour.",
    "My parents loved the traditional taste of this stone-ground atta.",
    "Superb quality, well packaged and clean.",
    "Perfect for making soft phulkas. Healthy and tasty.",
    "High fiber content is great for digestion. The atta is outstanding.",
    "I appreciate the stone-milled process. You get the whole grain goodness.",
    "Best atta in the market right now. Organic and light.",
    "Rotis stay soft even in the lunchbox. Five stars!"
  ],
  ration: [
    "The Monthly Ration Box is very convenient. The collection of grains and dals is perfect.",
    "A complete package of health. Everything in the box was super fresh.",
    "Bahut badhiya ration box hai. It has all my monthly staples.",
    "Saves so much time and guarantees organic, clean products.",
    "The packaging is premium and the products inside are high quality.",
    "Best decision to switch to Hadoti Farms monthly ration. Healthier lifestyle.",
    "Loved the customization option. Great value for money.",
    "Clean, organic, and direct from farmers. Highly satisfying.",
    "Excellent variety and quantity. Lasted the entire month easily.",
    "Very well thought out. Ghee, dals, and atta are superb.",
    "Value for money monthly kit. Fresh and organic items.",
    "Our family is very happy with the quality of everything in the ration box.",
    "Neatly packed, no leaks, and all grains are clean.",
    "Great initiative to support farmers directly while getting premium food.",
    "Saves me the trip to organic stores. Quality is unmatched."
  ],
  hampers: [
    "Perfect corporate gift. The packaging looks incredibly premium and rustic.",
    "Gave this hamper to my family for Diwali and everyone loved it!",
    "Beautiful jute packing and authentic, pure products inside.",
    "A very thoughtful and healthy gifting option. Highly appreciated.",
    "Excellent presentation. The quality of items is premium.",
    "Very neat packaging, timely delivery, and authentic Rajasthani vibe.",
    "Perfect blend of tradition and health. Best gift set.",
    "Highly recommended for festive gifts. Value for money.",
    "Very satisfied with the customer service and packaging quality.",
    "Unique gift set, everyone asked where I got it from.",
    "The products inside are very useful and healthy. Best gift package.",
    "Excellent selection of organic dals and masalas in a beautiful box.",
    "Received this as a gift, and I am now a permanent customer of Hadoti Farms!",
    "Eco-friendly and traditional packaging. Absolutely loved the concept.",
    "Best gift set to present to relatives. High utility and great quality."
  ],
  general: [
    "Highly satisfied with the product. Excellent customer service too.",
    "Product is good but delivery took a couple of days. Overall happy.",
    "Value for money and 100% authentic organic.",
    "Worth every rupee. The difference in taste is clear.",
    "Will definitely order again. Very clean.",
    "Bahut achha product hai. Clean and fresh.",
    "Hadoti Farms has never disappointed. Highly recommended.",
    "Love that it supports local farmers directly. Proud to buy.",
    "Packaging was great and products are top quality.",
    "Organic food at its best. Thank you Hadoti Farms!",
    "Genuine quality, very fresh. Will recommend to friends.",
    "Great pricing for organic and pesticide-free products.",
    "Tastes very natural and chemical-free.",
    "Very clean packaging and premium quality grains.",
    "Happy with my purchase. True rural Indian flavors."
  ]
};

const seedReviews = async () => {
  try {
    await connectDB();

    console.log("Fetching products from database...");
    const products = await Product.find({});
    
    if (products.length === 0) {
      console.log("❌ No products found in the database. Please seed products first!");
      process.exit(1);
    }

    console.log(`Found ${products.length} products. Clearing existing reviews...`);
    await Review.deleteMany({});
    console.log("Existing reviews cleared.");

    const allReviewsToInsert = [];
    const now = Date.now();

    for (const product of products) {
      // Determine a random count between 20 and 35 (inclusive)
      const reviewCount = Math.floor(Math.random() * (35 - 20 + 1)) + 20;
      console.log(`Generating ${reviewCount} reviews for: ${product.name} (${product.slug})...`);

      // Shuffle names to avoid duplicates within a single product's reviews if possible
      const shuffledNames = [...indianNames].sort(() => 0.5 - Math.random());
      
      const category = product.category || "general";
      const specificComments = categoryReviews[category] || categoryReviews.general;
      const genericComments = categoryReviews.general;

      for (let i = 0; i < reviewCount; i++) {
        // Choose a name
        const userName = shuffledNames[i % shuffledNames.length];
        
        // Generate a random rating:
        // ~65% chance of 5 stars
        // ~25% chance of 4 stars
        // ~8% chance of 3 stars
        // ~2% chance of 2 stars
        const r = Math.random();
        let rating = 5;
        if (r > 0.65 && r <= 0.90) {
          rating = 4;
        } else if (r > 0.90 && r <= 0.98) {
          rating = 3;
        } else if (r > 0.98) {
          rating = 2;
        }

        // Choose a comment: mix category-specific (70%) and generic (30%)
        let comment = "";
        if (Math.random() < 0.70) {
          comment = specificComments[Math.floor(Math.random() * specificComments.length)];
        } else {
          comment = genericComments[Math.floor(Math.random() * genericComments.length)];
        }

        // Generate a random date in the last 90 days
        const randomDaysAgo = Math.random() * 90;
        const createdAt = new Date(now - randomDaysAgo * 24 * 60 * 60 * 1000);
        
        // Mock user UID
        const userUid = Math.random() < 0.30 ? "legacy" : `user_mock_${Math.random().toString(36).substring(2, 12)}`;

        allReviewsToInsert.push({
          productSlug: product.slug,
          userUid,
          userName,
          rating,
          comment,
          createdAt,
          updatedAt: createdAt
        });
      }
    }

    console.log(`Inserting ${allReviewsToInsert.length} total reviews into the database...`);
    await Review.insertMany(allReviewsToInsert);

    console.log("🎉 Successfully seeded random reviews (20 to 35 per product)!");
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding reviews error: ${error.message}`);
    process.exit(1);
  }
};

seedReviews();
