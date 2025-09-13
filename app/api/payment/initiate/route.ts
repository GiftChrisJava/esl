import { PayChanguClient } from "@/lib/paychangu/client";
import { createClient } from "@/lib/supabase/server";
import { serverOrdersService } from "@/lib/supabase/server-orders";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, amount, currency = "MWK" } = body;

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify order exists and belongs to user
    const order = await serverOrdersService.getOrderById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId !== user.id) {
      return NextResponse.json(
        { error: "Order does not belong to user" },
        { status: 403 }
      );
    }

    // Initialize PayChangu payment
    const paychangu = new PayChanguClient();
    const paymentData = {
      amount: amount,
      currency: currency,
      reference: `ESL-${orderId}`,
      description: `Payment for order ${orderId}`,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel?order=${orderId}`,
      customer: {
        email: user.email!,
        phone: user.phone || undefined,
        name: user.user_metadata?.full_name || undefined,
      },
    };

    const paymentResponse = await paychangu.initiatePayment(paymentData);

    // Log payment initiation details
    console.log(`Payment initiated for order ${orderId}:`, {
      reference: paymentResponse.reference,
      amount,
      currency,
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      payment_url: paymentResponse.payment_url,
      reference: paymentResponse.reference,
    });
  } catch (error) {
    console.error("Payment initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate payment" },
      { status: 500 }
    );
  }
}
