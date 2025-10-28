
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidateId, provider, amount, currency } = body;

    if (!candidateId || !provider) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // NOTE: En production, vous devrez implémenter les vraies intégrations Stripe, PayPal et Weeroo
    // Pour l'instant, nous simulons un paiement réussi pour le développement
    
    // Simuler la création d'une transaction
    const transactionId = `sim_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // Dans un vrai système, vous créeriez une session de paiement et retourneriez l'URL
    // Pour Stripe:
    // const session = await stripe.checkout.sessions.create({ ... });
    // return NextResponse.json({ url: session.url });
    
    // Pour PayPal:
    // const order = await paypal.orders.create({ ... });
    // return NextResponse.json({ url: order.links.find(link => link.rel === 'approve').href });
    
    // Pour Weeroo:
    // const payment = await weeroo.createPayment({ ... });
    // return NextResponse.json({ url: payment.paymentUrl });

    // Pour le développement, simuler directement un paiement réussi
    await prisma.paymentTransaction.create({
      data: {
        candidateEmail: (await prisma.candidate.findUnique({ where: { id: candidateId } }))?.email || '',
        amount: amount || 49,
        currency: currency || 'EUR',
        provider,
        transactionId,
        status: 'completed',
        metadata: {},
      },
    });

    // Mettre à jour le statut de paiement du candidat
    await prisma.candidate.update({
      where: { id: candidateId },
      data: {
        hasPaid: true,
        paymentMethod: provider,
        paymentId: transactionId,
        paymentAmount: amount || 49,
      },
    });

    // En développement, rediriger directement vers le test
    return NextResponse.json({ 
      url: `/test?candidateId=${candidateId}`,
      message: 'Paiement simulé avec succès (mode développement)'
    });

  } catch (error) {
    console.error('Payment session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    );
  }
}
