import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PayChanguSecurity } from '@/lib/paychangu/security';
import { serverOrdersService } from '@/lib/supabase/server-orders';
import type { PaymentStatus, OrderStatus } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const security = new PayChanguSecurity();
    
    // Get the signature from headers
    const signature = request.headers.get('X-Signature') || request.headers.get('x-signature');
    
    if (!signature) {
      console.error('Missing signature in webhook');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const body = await request.json();
    
    // Verify webhook signature
    const isValidSignature = security.verifyWebhookSignature(body, signature);
    if (!isValidSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const {
      status,
      reference,
      transaction_id,
      amount,
      currency
    } = body;

    console.log('Payment webhook received:', { status, reference, transaction_id });

    // Extract order ID from reference (format: ESL-ORDER_ID)
    const orderId = reference?.replace('ESL-', '');
    
    if (!orderId) {
      console.error('Invalid reference format:', reference);
      return NextResponse.json({ error: 'Invalid reference' }, { status: 400 });
    }

    // Find the payment transaction by reference
    const { data: transaction, error: findError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('paychangu_reference', reference)
      .single();

    if (findError || !transaction) {
      console.error('Payment transaction not found:', findError);
      return NextResponse.json(
        { error: 'Payment transaction not found' },
        { status: 404 }
      );
    }

    // Update payment transaction
    const { error: updateError } = await supabase
      .from('payment_transactions')
      .update({
        paychangu_transaction_id: transaction_id,
        status: (status === 'successful' ? 'completed' : 'failed') as PaymentStatus,
        gateway_response: body,
        completed_at: new Date().toISOString()
      })
      .eq('paychangu_reference', reference);

    if (updateError) {
      console.error('Failed to update payment transaction:', updateError);
      return NextResponse.json(
        { error: 'Failed to update payment transaction' },
        { status: 500 }
      );
    }

    // Update order status
    const { error: orderUpdateError } = await supabase
      .from('orders')
      .update({
        payment_status: (status === 'successful' ? 'completed' : 'failed') as PaymentStatus,
        status: (status === 'successful' ? 'confirmed' : 'failed') as OrderStatus
      })
      .eq('id', transaction.order_id);

    if (orderUpdateError) {
      console.error('Failed to update order status:', orderUpdateError);
    }    if (updateError) {
      console.error('Error updating payment transaction:', updateError);
    }

    // Update order status
    if (status === 'successful') {
      const success = await serverOrdersService.updateOrderStatus(
        orderId,
        'delivered', // Supabase enum
        'completed'
      );
      
      if (!success) {
        console.error('Failed to update order status for order:', orderId);
      } else {
        console.log(`Order ${orderId} marked as completed`);
      }
    } else {
      const success = await serverOrdersService.updateOrderStatus(
        orderId,
        'cancelled', // Supabase enum
        'failed'
      );
      
      if (!success) {
        console.error('Failed to update order status for order:', orderId);
      } else {
        console.log(`Order ${orderId} marked as failed`);
      }
    }

    // TODO: Add analytics tracking when analytics_events table is available
    // Record analytics event for payment status
    console.log(`Payment ${status} for order ${orderId} - Amount: ${currency} ${amount}`);

    return NextResponse.json({ 
      success: true,
      message: 'Webhook processed successfully' 
    });

  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment callback' },
      { status: 500 }
    );
  }
}

// Handle GET requests for verification
export async function GET() {
  return NextResponse.json({ 
    message: 'PayChangu webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}