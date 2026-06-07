import nodemailer from "nodemailer";

const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(port),
    secure: parseInt(port) === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
};

export const sendOrderEmail = async (order, userEmail) => {
  try {
    const toEmail = userEmail || order.shippingAddress.email || "";
    if (!toEmail) {
      console.warn(`[Email Service] No recipient email found for order ${order.orderNumber}. Skipping dispatch.`);
      return;
    }

    const itemsRows = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <div style="font-weight: 600; color: #111827;">${item.name}</div>
            ${
              item.customization
                ? `<div style="font-size: 11px; color: #6b7280; font-family: monospace; margin-top: 2px;">Custom: ${item.customization}</div>`
                : ""
            }
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #4b5563; text-align: center;">${
            item.weight
          }</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #4b5563; text-align: center;">${
            item.qty
          }</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; text-align: right; font-family: monospace;">₹${
            item.price
          }</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; text-align: right; font-family: monospace; font-weight: 600;">₹${
            item.price * item.qty
          }</td>
        </tr>
      `
      )
      .join("");

    const formatINR = (val) => `₹${val.toLocaleString("en-IN")}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - Hadoti Farms</title>
        <style>
          body {
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #fcfbf7;
            color: #1f2937;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          }
          .header {
            background-color: #8b5e3c;
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            font-size: 28px;
            margin: 0;
            letter-spacing: 2px;
            font-family: serif;
          }
          .header p {
            color: #fafaf9;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 3px;
            margin: 5px 0 0 0;
          }
          .content {
            padding: 30px 20px;
          }
          .greeting {
            font-size: 16px;
            line-height: 24px;
            margin-bottom: 24px;
            color: #374151;
          }
          .meta-box {
            border: 1px solid #e5e7eb;
            background-color: #fafaf9;
            padding: 16px;
            border-radius: 4px;
            margin-bottom: 24px;
          }
          .meta-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 13px;
          }
          .meta-row:last-child {
            margin-bottom: 0;
          }
          .meta-label {
            color: #6b7280;
            font-weight: 500;
          }
          .meta-value {
            color: #111827;
            font-weight: 600;
          }
          .table-container {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
            font-size: 13px;
          }
          .totals-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            margin-top: 16px;
          }
          .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 12px;
          }
          .totals-label {
            color: #4b5563;
          }
          .totals-value {
            color: #111827;
            font-weight: 600;
            font-family: monospace;
          }
          .grand-total-row {
            display: flex;
            justify-content: space-between;
            padding: 12px;
            background-color: #fafaf9;
            border-top: 1px solid #e5e7eb;
            margin-top: 8px;
            font-size: 15px;
          }
          .grand-total-label {
            font-weight: bold;
            color: #8b5e3c;
          }
          .grand-total-value {
            font-weight: bold;
            color: #8b5e3c;
            font-family: monospace;
            font-size: 18px;
          }
          .address-section {
            border-top: 1px dashed #e5e7eb;
            padding-top: 24px;
            margin-top: 24px;
            font-size: 13px;
          }
          .address-title {
            font-size: 11px;
            color: #8b5e3c;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .address-detail {
            line-height: 20px;
            color: #4b5563;
          }
          .footer {
            background-color: #fafaf9;
            border-top: 1px solid #e5e7eb;
            padding: 24px;
            text-align: center;
            font-size: 11px;
            color: #6b7280;
            line-height: 16px;
          }
          .footer a {
            color: #8b5e3c;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Hadoti Farms</h1>
            <p>Order Confirmation</p>
          </div>
          <div class="content">
            <div class="greeting">
              Hello, <strong>${order.shippingAddress.name}</strong>. Thank you for your order. We are preparing to dispatch your organic farm harvest from Kota.
            </div>
            
            <div class="meta-box">
              <div class="meta-row">
                <span class="meta-label">Order Reference</span>
                <span class="meta-value">${order.orderNumber}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Order Date</span>
                <span class="meta-value">${new Date(order.createdAt).toLocaleDateString("en-IN", {
                  dateStyle: "medium",
                })}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Payment Method</span>
                <span class="meta-value" style="text-transform: uppercase;">${order.paymentMethod}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Payment Status</span>
                <span class="meta-value" style="text-transform: uppercase; color: ${
                  order.paymentStatus === "paid" ? "#15803d" : "#b45309"
                };">${order.paymentStatus}</span>
              </div>
            </div>

            <table class="table-container">
              <thead>
                <tr style="background-color: #fafaf9;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; color: #4b5563; font-weight: 600;">Staples</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb; color: #4b5563; font-weight: 600; width: 60px;">Weight</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb; color: #4b5563; font-weight: 600; width: 40px;">Qty</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb; color: #4b5563; font-weight: 600; width: 80px;">Rate</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb; color: #4b5563; font-weight: 600; width: 80px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>

            <div style="border: 1px solid #e5e7eb; border-radius: 4px; padding: 4px 0;">
              <div class="totals-row">
                <span class="totals-label">Subtotal</span>
                <span class="totals-value">${formatINR(order.subtotal)}</span>
              </div>
              <div class="totals-row">
                <span class="totals-label">Delivery Fee</span>
                <span class="totals-value">${
                  order.deliveryFee === 0 ? "FREE" : formatINR(order.deliveryFee)
                }</span>
              </div>
              <div class="grand-total-row">
                <span class="grand-total-label">Grand Total</span>
                <span class="grand-total-value">${formatINR(order.total)}</span>
              </div>
            </div>

            <div class="address-section">
              <div class="address-title">Shipping Address</div>
              <div class="address-detail">
                <strong>${order.shippingAddress.name}</strong><br>
                ${order.shippingAddress.address}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pin}<br>
                Phone: ${order.shippingAddress.phone}
              </div>
            </div>
          </div>
          <div class="footer">
            Grown slow, sun-dried on dynamic straw sheets, and stone-milled in Kota, Rajasthan.<br>
            If you have any questions, reach out to us at <a href="mailto:support@hadotifarms.com">support@hadotifarms.com</a>.<br><br>
            &copy; ${new Date().getFullYear()} Hadoti Farms. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    const transporter = getTransporter();

    if (!transporter) {
      console.warn("==========================================================================");
      console.warn("[Email Service] MOCK MODE ACTIVE (No SMTP Credentials Configured)");
      console.warn(`[Email Service] Mock-sending order email to: ${toEmail}`);
      console.warn(`[Email Service] Subject: Hadoti Farms - Order Confirmation (${order.orderNumber})`);
      console.warn("--------------------------------------------------------------------------");
      console.warn(`[Email Service] Plain text content preview:\n`);
      console.warn(`Hello ${order.shippingAddress.name},`);
      console.warn(`Your order ${order.orderNumber} is confirmed!`);
      console.warn(`Items: ${order.items.map((i) => `${i.name} (${i.weight}) x${i.qty}`).join(", ")}`);
      console.warn(`Total: ₹${order.total}`);
      console.warn(`Shipping to: ${order.shippingAddress.address}, ${order.shippingAddress.city}`);
      console.warn("==========================================================================");
      return;
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || `"Hadoti Farms" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `Hadoti Farms - Order Confirmation (${order.orderNumber})`,
      html: htmlContent,
    };

    if (process.env.NOTIFICATION_EMAIL) {
      mailOptions.bcc = process.env.NOTIFICATION_EMAIL;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Success! Order confirmation email sent to ${toEmail}. Message ID: ${info.messageId}`);
  } catch (error) {
    console.error("[Email Service] Failed to send order confirmation email:", error);
  }
};
