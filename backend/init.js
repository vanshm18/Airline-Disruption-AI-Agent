import "dotenv/config";
import mongoose from "mongoose";

import Customer from "./models/customer.js";
import Booking from "./models/booking.js";

const customers = [
  {
    name: "Priya Nair",
    loyaltyTier: "Gold",
    bookingReference: "SK4821X",
    contact: {
      email: "priya.nair@example.com",
      phone: "+91-98xxxxxxx1",
    },
    travelHistory: {
      flightsLast12Months: 6,
      priorComplaints: 1,
      complaintDetails:
        "Delayed baggage, resolved with voucher",
    },
  },

  {
    name: "Arvind Kulkarni",
    loyaltyTier: "Silver",
    bookingReference: "TR1190B",
    contact: {
      email: "arvind.kulkarni@example.com",
      phone: "+91-98xxxxxxx2",
    },
    travelHistory: {
      flightsLast12Months: 3,
      priorComplaints: 0,
    },
  },

  {
    name: "Meher Kaur",
    loyaltyTier: "Platinum",
    bookingReference: "WL7742",
    contact: {
      email: "meher.kaur@example.com",
      phone: "+91-98xxxxxxx3",
    },
    travelHistory: {
      flightsLast12Months: 10,
      priorComplaints: 1,
      complaintDetails:
        "Overbooking, resolved with a tier-status upgrade",
    },
  },
];

const bookings = [
  {
    customerName: "Priya Nair",
    pnr: "SK4821X",
    flight: "SK-204",
    route: "Delhi → Goa",
    date: "2026-09-23",
    scheduledDeparture: "18:40",
    status: "Cancelled",
    reason: "operational reasons",

    returnFlight: {
        flight: "SK-204",
        route: "Goa -> Delhi",
        date: "2026-09-25",
        scheduledDeparture: "16:20",
        status:"Unaffected",
    },
  },

  {
    customerName: "Arvind Kulkarni",
    pnr: "TR1190B",
    flight: "SK-118",
    route: "Mumbai → Bengaluru",
    date: "2026-09-23",
    scheduledDeparture: "07:10",
    status: "Delayed",
    delayHours: 4,
  },

  {
    customerName: "Meher Kaur",
    pnr: "WL7742",
    flight: "SK-305",
    route: "Delhi → Hyderabad",
    date: "2026-09-23",
    scheduledDeparture: "14:00",
    status: "Delayed",
    delayHours: 6,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");

    await Customer.deleteMany({});
    await Booking.deleteMany({});

    await Customer.insertMany(customers);
    await Booking.insertMany(bookings);

    console.log("Database seeded successfully");

    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();