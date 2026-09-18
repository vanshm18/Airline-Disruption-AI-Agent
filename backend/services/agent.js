import Customer from "../models/customer.js";
import Booking from "../models/booking.js";
import Conversation from "../models/conversation.js";

import {
  evaluateDisruptionPolicy,
  getLoyaltyBenefits,
  detectEscalation,
} from "./policy.js";

import { generateAgentResponse } from "./llm.js";

export async function processCustomerMessage({
  pnr,
  message,
}) {
  /*
   * 1. Find customer
   */
  const customer = await Customer.findOne({
    bookingReference: pnr,
  }).lean();

  if (!customer) {
    throw new Error("Customer not found");
  }

  /*
   * 2. Find booking
   */
  const booking = await Booking.findOne({
    pnr,
  }).lean();

  if (!booking) {
    throw new Error("Booking not found");
  }

  /*
   * 3. Existing conversation
   */
  let conversation = await Conversation.findOne({
    pnr,
  }).lean();

  /*
   * 4. Calculate policy
   */
  const policy = evaluateDisruptionPolicy({
    status: booking.status,
    delayHours: booking.delayHours || 0,
    disruptionCause: "airline",
  });

  /*
   * 5. Loyalty
   */
  const loyalty = getLoyaltyBenefits(
    customer.loyaltyTier
  );

  policy.loyalty = loyalty;

  /*
   * 6. Detect escalation
   */
  const escalation = detectEscalation({
    message,
  });

  if (escalation.required) {
    policy.escalationRequired = true;
    policy.escalationReasons.push(
      ...escalation.reasons
    );
  }

  /*
   * 7. Generate natural-language response
   */
  const response = await generateAgentResponse({
    customer,
    booking,
    policy,
    conversation: conversation?.messages || [],
    customerMessage: message,
  });

  /*
   * 8. Persist conversation
   */
  if (!conversation) {
    conversation = await Conversation.create({
      customerId: customer._id,
      pnr,
      messages: [
        {
          role: "user",
          content: message,
        },
        {
          role: "assistant",
          content: response,
        },
      ],
    });
  } else {
    await Conversation.updateOne(
      { _id: conversation._id },
      {
        $push: {
          messages: [
            {
              role: "user",
              content: message,
            },
            {
              role: "assistant",
              content: response,
            },
          ],
        },
      }
    );
  }

  return {
    customer,
    booking,
    policy,
    escalation: {
      required: policy.escalationRequired,
      reasons: policy.escalationReasons,
    },
    response,
  };
}
