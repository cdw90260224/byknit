-- 판매자 원화(KRW) 정산 잔액 원장
-- credit_transactions / update_profile_credits() 트리거와 동일한 패턴으로 구성

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS seller_balance_krw numeric DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.settlement_transactions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  seller_id uuid REFERENCES public.profiles(id) NOT NULL,
  order_id uuid REFERENCES public.orders(id),
  amount numeric NOT NULL, -- 판매 적립은 양수, 출금/조정은 음수
  type text NOT NULL CHECK (type IN ('sale', 'withdrawal', 'adjustment')),
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.settlement_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Sellers can view own settlement transactions." ON public.settlement_transactions;
CREATE POLICY "Sellers can view own settlement transactions."
  ON public.settlement_transactions FOR SELECT USING (auth.uid() = seller_id);

CREATE INDEX IF NOT EXISTS idx_settlement_transactions_seller_id ON public.settlement_transactions(seller_id);

-- 정산 트랜잭션 삽입 시 profiles.seller_balance_krw 자동 갱신
CREATE OR REPLACE FUNCTION public.update_seller_balance()
RETURNS trigger AS $$
BEGIN
  UPDATE public.profiles
  SET seller_balance_krw = COALESCE(seller_balance_krw, 0) + NEW.amount
  WHERE id = NEW.seller_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_settlement_transaction_created ON public.settlement_transactions;
CREATE TRIGGER on_settlement_transaction_created
  AFTER INSERT ON public.settlement_transactions
  FOR EACH ROW EXECUTE PROCEDURE public.update_seller_balance();
