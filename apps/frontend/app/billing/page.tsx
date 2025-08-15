import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import BillingClient from "././BillingClient";
import { apiFetch } from "@lib/api";

export default async function BillingPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/");

  // Mint a short-lived backend JWT (audience must match your Clerk template)
  const token = await getToken({ template: "backend" });

  console.log(token);

  const billingRes = await apiFetch("/billing", token);

  if (!billingRes.ok) {
    const text = await billingRes.text();
    console.error("Backend error:", billingRes.status, text);
    throw new Error(`Backend failed: ${billingRes.status}`);
  }

  const billing = await billingRes.json();

  console.log("billing:", billing);

  return (
    <BillingClient
      plan={billing.plan}
      price={billing.planPrice.amount}
      currency={billing.planPrice.currency}
      paymentInterval={billing.planPrice.interval}
      nextBilllingDate={billing.currentPeriodEnd}
      customerName={billing.customerName}
      customerEmail={billing.customerEmail}
      cardBrand={billing.card.brand}
      last4={billing.card.last4}
      expMonth={billing.card.expMonth}
      expYear={billing.card.expYear}
      billingHistory={billing.billingHistory}
    />
  );
}
