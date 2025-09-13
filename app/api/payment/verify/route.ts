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
    const { reference, orderId } = body;

    if (!reference || !orderId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify order belongs to user
    const order = await serverOrdersService.getOrderById(orderId);
    if (!order || order.userId !== user.id) {
      return NextResponse.json(
        { error: "Order not found or access denied" },
        { status: 404 }
      );
    }

    // Verify payment with PayChangu
    const paychangu = new PayChanguClient();
    const verification = await paychangu.verifyPayment(reference);

    // Log verification results
    console.log(
      `Payment verification for reference ${reference}:`,
      verification
    );

    return NextResponse.json({
      ...verification,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
