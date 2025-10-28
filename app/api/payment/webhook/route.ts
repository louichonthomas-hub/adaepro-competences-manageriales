
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Cette route gère les webhooks des différents providers de paiement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const provider = request.nextUrl.searchParams.get('provider');

    // Vérifier la signature du webhook selon le provider
    // TODO: Implémenter la vérification de signature pour chaque provider

    let transactionId = '';
    let status = '';
    let candidateEmail = '';

    if (provider === 'stripe') {
      // Traiter le webhook Stripe
      transactionId = body.data?.object?.id || '';
      status = body.data?.object?.payment_status || '';
      candidateEmail = body.data?.object?.customer_email || '';
    } else if (provider === 'paypal') {
      // Traiter le webhook PayPal
      transactionId = body.id || '';
      status = body.status || '';
      candidateEmail = body.payer?.email_address || '';
    } else if (provider === 'weeroo') {
      // Traiter le webhook Weeroo
      transactionId = body.transactionId || '';
      status = body.status || '';
      candidateEmail = body.customer?.email || '';
    }

    // Mettre à jour la transaction
    await prisma.paymentTransaction.updateMany({
      where: { transactionId },
      data: { status, metadata: body },
    });

    // Si le paiement est réussi, mettre à jour le candidat
    if (status === 'completed' || status === 'succeeded' || status === 'COMPLETED') {
      const candidate = await prisma.candidate.findUnique({
        where: { email: candidateEmail },
      });

      if (candidate) {
        await prisma.candidate.update({
          where: { id: candidate.id },
          data: {
            hasPaid: true,
            paymentMethod: provider,
            paymentId: transactionId,
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
