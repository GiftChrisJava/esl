import { PayChanguSecurity } from "@/lib/paychangu/security";
import { serverOrdersService } from "@/lib/supabase/server-orders";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const security = new PayChanguSecurity();

    // Get the signature from headers
    const signature =
      request.headers.get("X-Signature") || request.headers.get("x-signature");

    if (!signature) {
      console.error("Missing signature in webhook");
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const body = await request.json();

    // Verify webhook signature
    if (!security.verifyWebhookSignature(body, signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const { status, reference, transaction_id, amount, currency } = body;

    console.log("PayChangu webhook received:", {
      status,
      reference,
      transaction_id,
      amount,
      currency,
    });

    // Extract order ID from reference
    const orderId = reference?.replace("ESL-", "");

    if (!orderId) {
      console.error("Invalid reference format:", reference);
      return NextResponse.json({ error: "Invalid reference" }, { status: 400 });
    }

    // Update order payment status using the server orders service
    if (status === "successful") {
      try {
        await serverOrdersService.updateOrderStatus(
          orderId,
          "confirmed",
          "completed"
        );
        console.log(`Order ${orderId} marked as paid`);
      } catch (error) {
        console.error(
          "Failed to process successful payment for order:",
          orderId,
          error
        );
      }
    } else {
      try {
        await serverOrdersService.updateOrderStatus(
          orderId,
          "cancelled",
          "failed"
        );
        console.log(`Order ${orderId} marked as failed`);
      } catch (error) {
        console.error(
          "Failed to update order status for order:",
          orderId,
          error
        );
      }
    }

    // Log payment details for tracking
    console.log(
      `Payment ${status} for order ${orderId} - Amount: ${currency} ${amount}`
    );

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "PayChangu webhook endpoint is active",
    timestamp: new Date().toISOString(),
  });
}
