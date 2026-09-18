export function evaluateDisruptionPolicy({
  status,
  delayHours = 0,
  disruptionCause = "airline",
  requestedFareDifference = 0,
}) {
  const result = {
    disruption: status,
    eligibleActions: [],
    escalationRequired: false,
    escalationReasons: [],
    compensation: [],
  };

  /*
   * Cancellation
   */
  if (
    status.toLowerCase().includes("cancel") &&
    disruptionCause === "airline"
  ) {
    result.eligibleActions.push(
      "free_rebooking_within_24_hours",
      "full_refund"
    );

    result.compensation.push({
      type: "refund",
      amount: "full",
      paymentMethod: "original_payment_method",
      processingTime: "within 7 business days",
    });
  }

  /*
   * Delay compensation
   */
  if (delayHours > 0) {
    if (delayHours < 3) {
      result.compensation.push({
        type: "meal_voucher",
        amount: "₹500",
      });
    }

    if (delayHours >= 3) {
      result.compensation.push(
        {
          type: "meal_voucher",
        },
        {
          type: "lounge_access",
        }
      );
    }

    if (delayHours > 5) {
      result.compensation.push({
        type: "hotel_accommodation",
        coverage: "delayed_hours_only",
      });
    }
  }

  /*
   * Higher fare rebooking
   */
  if (requestedFareDifference > 0) {
    result.eligibleActions.push("customer_pays_fare_difference");

    if (requestedFareDifference > 1500) {
      result.escalationRequired = true;

      result.escalationReasons.push(
        "Fare difference above ₹1,500 requires supervisor approval."
      );
    }
  }

  return result;
}


export function getLoyaltyBenefits(loyaltyTier) {
  if (loyaltyTier === "Gold" || loyaltyTier === "Platinum") {
    return {
      priorityRebooking: true,
      additionalCompensation: false,
    };
  }

  return {
    priorityRebooking: false,
    additionalCompensation: false,
  };
}

export function detectEscalation({
  message,
  requestedFareDifference = 0,
}) {
  const lower = message.toLowerCase();

  const reasons = [];

  if (
    lower.includes("legal action") ||
    lower.includes("lawsuit") ||
    lower.includes("formal complaint")
  ) {
    reasons.push(
      "Customer mentioned legal action or a formal complaint."
    );
  }

  if (requestedFareDifference > 1500) {
    reasons.push(
      "Fare difference above ₹1,500 requires supervisor approval."
    );
  }

  return {
    required: reasons.length > 0,
    reasons,
  };
}
