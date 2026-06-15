import Subscription from "../models/Subscription.js";
import Order from "../models/Order.js";

/**
 * Scans all active subscriptions and generates monthly delivery orders if due.
 * This function can be called via a cron job, a manual admin trigger, or a background interval.
 */
export const checkAndGenerateSubscriptionOrders = async () => {
  const now = new Date();
  
  // Find active subscriptions where nextDeliveryDate <= now
  const activeSubs = await Subscription.find({
    status: "active",
    nextDeliveryDate: { $lte: now }
  });
  
  console.log(`[Subscription Engine] Found ${activeSubs.length} subscriptions pending monthly order generation.`);
  
  const generatedOrders = [];
  
  for (const sub of activeSubs) {
    const nextCount = sub.currentDeliveryCount + 1;
    
    // Safety check: if we somehow exceeded the duration
    if (nextCount > sub.months) {
      sub.status = "completed";
      await sub.save();
      continue;
    }
    
    // Format order number (e.g. HF-SUB-123456-M2)
    const orderNumber = `HF-${sub.subscriptionNumber}-M${nextCount}`;
    
    // Check if this monthly child order was already generated
    const existingOrder = await Order.findOne({ orderNumber });
    if (existingOrder) {
      console.log(`[Subscription Engine] Order ${orderNumber} already exists. Updating subscription dates to next cycle.`);
      
      // Fast forward subscription state
      sub.currentDeliveryCount = nextCount;
      sub.lastDeliveryDate = sub.nextDeliveryDate;
      
      if (nextCount >= sub.months) {
        sub.status = "completed";
      } else {
        const nextDate = new Date(sub.nextDeliveryDate);
        nextDate.setMonth(nextDate.getMonth() + 1);
        sub.nextDeliveryDate = nextDate;
      }
      await sub.save();
      continue;
    }
    
    // Calculate monthly item price share or display as 0 (prepaid)
    // We set total and subtotal to 0 for monthly delivery to prevent inflating total sales statistics,
    // since the customer already paid the complete total upfront in the original parent order.
    const deliveryOrder = new Order({
      orderNumber,
      userUid: sub.userUid,
      items: sub.items,
      shippingAddress: sub.shippingAddress,
      subtotal: 0,
      deliveryFee: 0,
      total: 0,
      paymentMethod: "upi", // Treated as prepaid online payment
      paymentStatus: "paid",
      status: "placed" // Ready in the admin's delivery queue
    });
    
    await deliveryOrder.save();
    generatedOrders.push(deliveryOrder);
    
    // Update subscription tracker
    sub.currentDeliveryCount = nextCount;
    sub.lastDeliveryDate = new Date();
    
    if (nextCount >= sub.months) {
      sub.status = "completed";
      sub.nextDeliveryDate = sub.endDate; // Cap next delivery at endDate
    } else {
      const nextDate = new Date(sub.nextDeliveryDate);
      nextDate.setMonth(nextDate.getMonth() + 1);
      sub.nextDeliveryDate = nextDate;
    }
    
    await sub.save();
    console.log(`[Subscription Engine] Generated order ${orderNumber} for subscription ${sub.subscriptionNumber}`);
  }
  
  return generatedOrders;
};
