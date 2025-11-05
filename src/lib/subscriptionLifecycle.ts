import { supabase } from "./supabase";
import { logAuditEvent } from "./dataGovernance";

export type SubscriptionStatus =
  | "incomplete"
  | "incomplete_expired"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid";

export interface SubscriptionData {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: SubscriptionStatus;
  planId: string;
  planName: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  cancelAt?: Date;
  trialEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export async function syncSubscriptionFromStripe(
  userId: string,
  stripeSubscriptionId: string,
  status: SubscriptionStatus,
  data: {
    customerId: string;
    planId: string;
    planName: string;
    currentPeriodStart: number;
    currentPeriodEnd: number;
    cancelAtPeriodEnd: boolean;
    cancelAt?: number;
    trialEnd?: number;
  }
): Promise<boolean> {
  try {
    const subscriptionData = {
      user_id: userId,
      stripe_customer_id: data.customerId,
      stripe_subscription_id: stripeSubscriptionId,
      status,
      plan_id: data.planId,
      plan_name: data.planName,
      current_period_start: new Date(data.currentPeriodStart * 1000).toISOString(),
      current_period_end: new Date(data.currentPeriodEnd * 1000).toISOString(),
      cancel_at_period_end: data.cancelAtPeriodEnd,
      cancel_at: data.cancelAt ? new Date(data.cancelAt * 1000).toISOString() : null,
      trial_end: data.trialEnd ? new Date(data.trialEnd * 1000).toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("user_subscriptions")
      .upsert(subscriptionData, {
        onConflict: "stripe_subscription_id",
      });

    if (error) {
      console.error("Failed to sync subscription:", error);
      return false;
    }

    await logAuditEvent({
      action: "subscription_synced",
      entity: "subscription",
      entityId: stripeSubscriptionId,
      metadata: { status, planName: data.planName },
    });

    return true;
  } catch (error) {
    console.error("Subscription sync error:", error);
    return false;
  }
}

export async function handleTrialWillEnd(userId: string, daysRemaining: number): Promise<void> {
  await logAuditEvent({
    action: "trial_will_end",
    entity: "subscription",
    entityId: userId,
    metadata: { daysRemaining },
  });
}

export async function handlePaymentFailed(
  userId: string,
  subscriptionId: string,
  attemptCount: number
): Promise<void> {
  const { error } = await supabase
    .from("user_subscriptions")
    .update({
      status: "past_due",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscriptionId);

  if (error) {
    console.error("Failed to mark subscription past_due:", error);
  }

  await logAuditEvent({
    action: "payment_failed",
    entity: "subscription",
    entityId: subscriptionId,
    metadata: { userId, attemptCount },
  });
}

export async function handlePaymentSucceeded(
  userId: string,
  subscriptionId: string,
  amountPaid: number
): Promise<void> {
  const { error } = await supabase
    .from("user_subscriptions")
    .update({
      status: "active",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscriptionId);

  if (error) {
    console.error("Failed to mark subscription active:", error);
  }

  await logAuditEvent({
    action: "payment_succeeded",
    entity: "subscription",
    entityId: subscriptionId,
    metadata: { userId, amountPaid },
  });
}

export async function cancelSubscription(
  userId: string,
  subscriptionId: string,
  immediate: boolean = false
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("user_subscriptions")
      .update({
        cancel_at_period_end: !immediate,
        status: immediate ? "canceled" : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscriptionId)
      .eq("user_id", userId);

    if (error) {
      console.error("Failed to cancel subscription:", error);
      return false;
    }

    await logAuditEvent({
      action: immediate ? "subscription_canceled_immediate" : "subscription_canceled_at_period_end",
      entity: "subscription",
      entityId: subscriptionId,
      metadata: { userId },
    });

    return true;
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return false;
  }
}

export async function reactivateSubscription(
  userId: string,
  subscriptionId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("user_subscriptions")
      .update({
        cancel_at_period_end: false,
        cancel_at: null,
        status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscriptionId)
      .eq("user_id", userId);

    if (error) {
      console.error("Failed to reactivate subscription:", error);
      return false;
    }

    await logAuditEvent({
      action: "subscription_reactivated",
      entity: "subscription",
      entityId: subscriptionId,
      metadata: { userId },
    });

    return true;
  } catch (error) {
    console.error("Reactivate subscription error:", error);
    return false;
  }
}

export async function getUserSubscription(userId: string): Promise<SubscriptionData | null> {
  try {
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      stripeCustomerId: data.stripe_customer_id,
      stripeSubscriptionId: data.stripe_subscription_id,
      status: data.status,
      planId: data.plan_id,
      planName: data.plan_name,
      currentPeriodStart: new Date(data.current_period_start),
      currentPeriodEnd: new Date(data.current_period_end),
      cancelAtPeriodEnd: data.cancel_at_period_end,
      cancelAt: data.cancel_at ? new Date(data.cancel_at) : undefined,
      trialEnd: data.trial_end ? new Date(data.trial_end) : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  } catch (error) {
    console.error("Get user subscription error:", error);
    return null;
  }
}

export function hasActiveSubscription(subscription: SubscriptionData | null): boolean {
  if (!subscription) return false;
  return ["active", "trialing"].includes(subscription.status);
}

export function isSubscriptionPastDue(subscription: SubscriptionData | null): boolean {
  if (!subscription) return false;
  return subscription.status === "past_due";
}

export function getSubscriptionDaysRemaining(subscription: SubscriptionData | null): number {
  if (!subscription) return 0;
  const now = Date.now();
  const end = subscription.currentPeriodEnd.getTime();
  const diff = end - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export async function checkEntitlement(
  userId: string,
  requiredPlan: "core" | "daily" | "max"
): Promise<boolean> {
  const subscription = await getUserSubscription(userId);

  if (!subscription || !hasActiveSubscription(subscription)) {
    return false;
  }

  const planHierarchy: Record<string, number> = {
    core: 1,
    daily: 2,
    max: 3,
  };

  const userPlanLevel = planHierarchy[subscription.planName.toLowerCase()] || 0;
  const requiredPlanLevel = planHierarchy[requiredPlan] || 999;

  return userPlanLevel >= requiredPlanLevel;
}
