import { processCustomerMessage } from "../services/agent.js";

export async function chatWithAgent(req, res) {
  try {
    const { pnr, message } = req.body;

    if (!pnr || !message) {
      return res.status(400).json({
        success: false,
        message: "pnr and message are required",
      });
    }

    const result = await processCustomerMessage({
      pnr,
      message,
    });

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
