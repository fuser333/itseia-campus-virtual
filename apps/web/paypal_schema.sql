-- ============================================
-- ITSEIA Academy — PayPal Integration Schema
-- Run in Supabase SQL Editor
-- ============================================

-- 1. PAYPAL_TRANSACTIONS table (tracks PayPal order lifecycle)
CREATE TABLE IF NOT EXISTS public.paypal_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  paypal_order_id TEXT NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'captured', 'failed', 'refunded')),
  capture_id TEXT,
  payer_email TEXT,
  captured_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_paypal_tx_user ON public.paypal_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_paypal_tx_order ON public.paypal_transactions(paypal_order_id);
CREATE INDEX IF NOT EXISTS idx_paypal_tx_status ON public.paypal_transactions(status);

-- RLS
ALTER TABLE public.paypal_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users can view own paypal transactions" ON public.paypal_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view/manage all transactions
CREATE POLICY "Admins can manage paypal transactions" ON public.paypal_transactions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'finanzas'))
  );

-- 2. Add 'paypal' as a valid payment method in the payments table
-- Drop the old constraint and create a new one that includes 'paypal'
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_method_check;
ALTER TABLE public.payments ADD CONSTRAINT payments_method_check
  CHECK (method IN ('transfer', 'stripe', 'cash', 'paypal'));

COMMENT ON TABLE public.paypal_transactions IS 'PayPal order tracking - maps PayPal orders to users and programs';
