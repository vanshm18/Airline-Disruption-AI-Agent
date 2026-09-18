import { useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api";

const customers = [
  {
    name: "Priya Nair",
    pnr: "SK4821X",
    tier: "Gold",
  },
  {
    name: "Arvind Kulkarni",
    pnr: "TR1190B",
    tier: "Silver",
  },
  {
    name: "Meher Kaur",
    pnr: "WL7742",
    tier: "Platinum",
  },
];

function App() {
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [agentResult, setAgentResult] = useState(null);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/agent/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pnr: selectedCustomer.pnr,
          message: userMessage,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Something went wrong");
      }

      setAgentResult(data.data);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.data.response,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I couldn't process your request. ${error.message}`,
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function selectCustomer(customer) {
    setSelectedCustomer(customer);
    setMessages([]);
    setAgentResult(null);
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-logo">A</div>

          <div>
            <h1>Resolution Agent</h1>
            <p>Airline disruption support</p>
          </div>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          Agent online
        </div>
      </header>

      <main className="layout">
        <aside className="sidebar">
          <div className="sidebar-heading">
            <h2>Customers</h2>
            <span>{customers.length}</span>
          </div>

          <div className="customer-list">
            {customers.map((customer) => (
              <button
                key={customer.pnr}
                className={`customer-card ${
                  selectedCustomer.pnr === customer.pnr
                    ? "active"
                    : ""
                }`}
                onClick={() => selectCustomer(customer)}
              >
                <div className="avatar">
                  {customer.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}
                </div>

                <div className="customer-info">
                  <strong>{customer.name}</strong>
                  <span>{customer.pnr}</span>
                </div>

                <span
                  className={`tier ${customer.tier.toLowerCase()}`}
                >
                  {customer.tier}
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="chat-panel">
          <div className="chat-header">
            <div>
              <h2>{selectedCustomer.name}</h2>

              <p>
                PNR: {selectedCustomer.pnr} ·{" "}
                {selectedCustomer.tier} tier
              </p>
            </div>

            <div className="booking-status">
              Booking loaded
            </div>
          </div>

          <div className="messages">
            {messages.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">✈</div>

                <h2>How can I help?</h2>

                <p>
                  Ask about the customer's flight disruption,
                  refund, rebooking, compensation, or hotel
                  eligibility.
                </p>

                <div className="suggestions">
                  <button
                    onClick={() =>
                      setInput(
                        "My flight was cancelled. What are my options?"
                      )
                    }
                  >
                    Flight cancellation
                  </button>

                  <button
                    onClick={() =>
                      setInput(
                        "What compensation am I eligible for?"
                      )
                    }
                  >
                    Compensation
                  </button>

                  <button
                    onClick={() =>
                      setInput(
                        "Can I get a hotel because of the delay?"
                      )
                    }
                  >
                    Hotel accommodation
                  </button>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`message-row ${message.role}`}
              >
                <div
                  className={`message ${
                    message.error ? "error" : ""
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message-row assistant">
                <div className="message loading-message">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          <div className="composer">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about the customer's disruption..."
              rows={1}
              disabled={loading}
            />

            <button
              className="send-button"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </div>
        </section>

        <aside className="details-panel">
          <h2>Resolution details</h2>

          {!agentResult ? (
            <div className="details-empty">
              <p>
                Policy decisions will appear here after the
                customer sends a message.
              </p>
            </div>
          ) : (
            <>
              <div className="detail-section">
                <h3>Flight</h3>

                <div className="detail-card">
                  <div className="detail-row">
                    <span>Flight</span>
                    <strong>
                      {agentResult.booking?.flight || "—"}
                    </strong>
                  </div>

                  <div className="detail-row">
                    <span>Route</span>
                    <strong>
                      {agentResult.booking?.route || "—"}
                    </strong>
                  </div>

                  <div className="detail-row">
                    <span>Status</span>
                    <strong className="flight-status">
                      {agentResult.booking?.status || "—"}
                    </strong>
                  </div>

                  {agentResult.booking?.delayHours && (
                    <div className="detail-row">
                      <span>Delay</span>
                      <strong>
                        {agentResult.booking.delayHours}h
                      </strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h3>Eligible actions</h3>

                <div className="action-list">
                  {agentResult.policy?.compensation?.length >
                  0 ? (
                    agentResult.policy.compensation.map(
                      (item, index) => (
                        <div
                          className="action-item allowed"
                          key={index}
                        >
                          <span className="action-icon">✓</span>

                          <span>
                            {formatAction(item)}
                          </span>
                        </div>
                      )
                    )
                  ) : (
                    <p className="muted">
                      No compensation identified.
                    </p>
                  )}
                </div>
              </div>

              {agentResult.escalation?.required && (
                <div className="escalation-box">
                  <div className="escalation-title">
                    <span>!</span>
                    Human escalation required
                  </div>

                  {agentResult.escalation.reasons.map(
                    (reason, index) => (
                      <p key={index}>{reason}</p>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </aside>
      </main>
    </div>
  );
}

function formatAction(item) {
  if (item.type === "meal_voucher") {
    return item.amount
      ? `Meal voucher (${item.amount})`
      : "Meal voucher";
  }

  if (item.type === "lounge_access") {
    return "Lounge access";
  }

  if (item.type === "hotel_accommodation") {
    return "Hotel accommodation for delayed hours";
  }

  if (item.type === "refund") {
    return "Full refund";
  }

  return item.type?.replaceAll("_", " ") || "Eligible action";
}

export default App;