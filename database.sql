-- ================================================================
-- OMEGA ATTIRE – SUPABASE SQL SETUP SCRIPT
-- ================================================================
-- Run this ENTIRE script in:
-- Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- ================================================================


-- ── STEP 1: CREATE REVIEWS TABLE ─────────────────────────────

CREATE TABLE IF NOT EXISTS reviews (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name         TEXT        NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
  city         TEXT        NOT NULL CHECK (char_length(city) >= 2 AND char_length(city) <= 100),
  rating       SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  product      TEXT        NOT NULL,
  review_text  TEXT        NOT NULL CHECK (char_length(review_text) >= 20 AND char_length(review_text) <= 2000),
  images       TEXT[]      NOT NULL DEFAULT '{}',
  status       TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  verified     BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ── STEP 2: AUTO-UPDATE updated_at TRIGGER ───────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ── STEP 3: INDEXES FOR PERFORMANCE ─────────────────────────

CREATE INDEX IF NOT EXISTS idx_reviews_status     ON reviews (status);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating     ON reviews (rating);


-- ── STEP 4: ENABLE ROW LEVEL SECURITY ───────────────────────

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;


-- ── STEP 5: RLS POLICIES ────────────────────────────────────

-- Public can only READ approved reviews
CREATE POLICY "public_read_approved"
  ON reviews
  FOR SELECT
  TO anon
  USING (status = 'approved');

-- Public can INSERT new reviews (they start as 'pending')
CREATE POLICY "public_insert_reviews"
  ON reviews
  FOR INSERT
  TO anon
  WITH CHECK (status = 'pending');

-- Authenticated users (admin) can do everything
CREATE POLICY "admin_full_access"
  ON reviews
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);


-- ── STEP 6: STATS VIEW (for homepage counters) ──────────────

CREATE OR REPLACE VIEW review_stats AS
SELECT
  COUNT(*)                                          AS total_reviews,
  ROUND(AVG(rating)::NUMERIC, 1)                   AS average_rating,
  COUNT(*) FILTER (WHERE rating = 5)               AS five_star,
  COUNT(*) FILTER (WHERE rating = 4)               AS four_star,
  COUNT(*) FILTER (WHERE rating = 3)               AS three_star,
  COUNT(*) FILTER (WHERE rating = 2)               AS two_star,
  COUNT(*) FILTER (WHERE rating = 1)               AS one_star,
  ROUND(
    COUNT(*) FILTER (WHERE rating >= 4) * 100.0
    / NULLIF(COUNT(*), 0), 0
  )                                                AS satisfaction_pct
FROM reviews
WHERE status = 'approved';

-- Allow anon to read the stats view
GRANT SELECT ON review_stats TO anon;


-- ── STEP 7: ADMIN STATS VIEW (all reviews including pending) ──

CREATE OR REPLACE VIEW admin_stats AS
SELECT
  COUNT(*)                                             AS total,
  COUNT(*) FILTER (WHERE status = 'pending')          AS pending,
  COUNT(*) FILTER (WHERE status = 'approved')         AS approved,
  COUNT(*) FILTER (WHERE status = 'rejected')         AS rejected,
  ROUND(AVG(rating) FILTER (WHERE status='approved')::NUMERIC, 1) AS avg_rating
FROM reviews;

-- Only authenticated can read admin stats
GRANT SELECT ON admin_stats TO authenticated;


-- ── DONE ─────────────────────────────────────────────────────
-- Expected output: no errors, tables and views created.
-- Next step: Set up Storage bucket (see SETUP_GUIDE.md)
