import { supabase } from './supabase';
import { sendEmail } from './emailProvider';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier_level: number;
  monthly_price_cents: number;
  annual_price_cents: number;
  can_generate_reports: boolean;
  max_reports_per_month: number | null;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'trial' | 'active' | 'past_due' | 'canceled' | 'expired';
  billing_period: 'monthly' | 'annual';
  current_period_start: string;
  current_period_end: string;
  trial_start: string | null;
  trial_end: string | null;
  is_trial: boolean;
  cancel_at_period_end: boolean;
}

export async function createSubscription(
  userId: string,
  planId: string,
  billingPeriod: 'monthly' | 'annual'
): Promise<{ success: boolean; subscription?: UserSubscription; error?: string }> {
  try {
    const plan = await getSubscriptionPlan(planId);
    if (!plan) {
      return { success: false, error: 'Plan not found' };
    }

    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(trialEnd.getDate() + 5);

    const periodEnd = new Date(trialEnd);
    if (billingPeriod === 'monthly') {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    // Use upsert function to handle existing subscriptions
    const { data: subscriptionId, error: upsertError } = await supabase
      .rpc('upsert_user_subscription', {
        p_user_id: userId,
        p_plan_id: planId,
        p_billing_period: billingPeriod,
        p_status: 'trial',
        p_current_period_start: now.toISOString(),
        p_current_period_end: periodEnd.toISOString()
      });

    if (upsertError) throw upsertError;

    // Fetch the created/updated subscription
    const { data: subscription, error: fetchError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .single();

    if (fetchError) throw fetchError;

    await sendSubscriptionWelcomeEmail(userId, plan, subscription);

    return { success: true, subscription };
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return { success: false, error: error.message };
  }
}

export async function getSubscriptionPlan(planId: string): Promise<SubscriptionPlan | null> {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching plan:', error);
    return null;
  }
}

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  try {
    // Get the most recent active subscription
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['active', 'trial', 'past_due'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    return null;
  }
}

export async function createInvoice(
  userId: string,
  subscriptionId: string,
  amount: number,
  planName: string,
  billingPeriod: string,
  periodStart: Date,
  periodEnd: Date
): Promise<{ success: boolean; invoice?: any; error?: string }> {
  try {
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const dueDate = new Date(periodEnd);
    dueDate.setDate(dueDate.getDate() - 7);

    const { data: invoice, error } = await supabase
      .from('subscription_invoices')
      .insert({
        user_id: userId,
        subscription_id: subscriptionId,
        invoice_number: invoiceNumber,
        amount: amount,
        currency: 'USD',
        status: 'pending',
        plan_name: planName,
        billing_period: billingPeriod,
        billing_period_start: periodStart.toISOString(),
        billing_period_end: periodEnd.toISOString(),
        due_date: dueDate.toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, invoice };
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    return { success: false, error: error.message };
  }
}

export async function processPayment(
  userId: string,
  invoiceId: string,
  amount: number,
  paymentMethod: 'card' | 'paypal' | 'bank_transfer'
): Promise<{ success: boolean; transaction?: any; error?: string }> {
  try {
    const { data: transaction, error } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: userId,
        invoice_id: invoiceId,
        transaction_type: 'subscription',
        amount: amount,
        currency: 'USD',
        status: 'completed',
        payment_method: paymentMethod,
        payment_gateway: 'stripe',
        gateway_transaction_id: `txn_${Date.now()}`
      })
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from('subscription_invoices')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString()
      })
      .eq('id', invoiceId);

    await sendPaymentConfirmationEmail(userId, transaction);

    return { success: true, transaction };
  } catch (error: any) {
    console.error('Error processing payment:', error);
    return { success: false, error: error.message };
  }
}

export async function cancelSubscription(
  userId: string,
  cancelAtPeriodEnd: boolean = true
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = {
      cancel_at_period_end: cancelAtPeriodEnd,
      canceled_at: new Date().toISOString()
    };

    if (!cancelAtPeriodEnd) {
      updateData.status = 'canceled';
    }

    const { error } = await supabase
      .from('user_subscriptions')
      .update(updateData)
      .eq('user_id', userId);

    if (error) throw error;

    await sendSubscriptionCanceledEmail(userId, cancelAtPeriodEnd);

    return { success: true };
  } catch (error: any) {
    console.error('Error canceling subscription:', error);
    return { success: false, error: error.message };
  }
}

async function sendSubscriptionWelcomeEmail(userId: string, plan: SubscriptionPlan, subscription: any) {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user?.email) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', userId)
      .single();

    const firstName = profile?.first_name || 'there';
    const trialEndDate = new Date(subscription.trial_end);

    await sendEmail({
      to: user.user.email,
      templateId: 'subscription_welcome',
      variables: {
        first_name: firstName,
        plan_name: plan.name,
        trial_end_date: trialEndDate.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }),
        billing_amount: subscription.billing_period === 'monthly'
          ? `$${plan.monthly_price_cents / 100}`
          : `$${plan.annual_price_cents / 100}`,
        billing_period: subscription.billing_period
      }
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}

async function sendPaymentConfirmationEmail(userId: string, transaction: any) {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user?.email) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name')
      .eq('id', userId)
      .single();

    await sendEmail({
      to: user.user.email,
      templateId: 'payment_success',
      variables: {
        first_name: profile?.first_name || 'there',
        amount: `$${transaction.amount / 100}`,
        transaction_id: transaction.gateway_transaction_id,
        payment_date: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })
      }
    });
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
  }
}

async function sendSubscriptionCanceledEmail(userId: string, cancelAtPeriodEnd: boolean) {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user?.email) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name')
      .eq('id', userId)
      .single();

    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('current_period_end')
      .eq('user_id', userId)
      .single();

    await sendEmail({
      to: user.user.email,
      templateId: cancelAtPeriodEnd ? 'subscription_canceled_end_period' : 'subscription_canceled_immediate',
      variables: {
        first_name: profile?.first_name || 'there',
        end_date: subscription?.current_period_end
          ? new Date(subscription.current_period_end).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })
          : 'N/A'
      }
    });
  } catch (error) {
    console.error('Error sending cancelation email:', error);
  }
}
