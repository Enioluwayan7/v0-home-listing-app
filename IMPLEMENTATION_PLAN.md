# HennyHomes Landlord Features Implementation Plan

## Current Database Schema
- ✅ profiles
- ✅ properties
- ✅ property_images
- ✅ messages

---

## New Tables Required

### 1. **applications** (Tenant Applications)
```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  landlord_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Application Details
  status TEXT NOT NULL DEFAULT 'submitted', -- submitted, reviewed, approved, rejected, withdrawn
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- Financial Info
  annual_income NUMERIC,
  employment_status TEXT, -- employed, self-employed, student, retired, other
  employer_name TEXT,
  
  -- Rental History
  previous_address TEXT,
  previous_landlord_contact TEXT,
  rental_history_years INTEGER,
  
  -- References
  reference_name TEXT,
  reference_contact TEXT,
  
  -- Documents
  id_document_url TEXT, -- uploaded to Blob storage
  income_verification_url TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES profiles(id),
  rejection_reason TEXT
);

-- RLS Policies
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants can view own applications" ON applications FOR SELECT USING (auth.uid() = tenant_id);
CREATE POLICY "Landlords can view applications for own properties" ON applications FOR SELECT USING (auth.uid() = landlord_id);
CREATE POLICY "Tenants can create applications" ON applications FOR INSERT WITH CHECK (auth.uid() = tenant_id);
CREATE POLICY "Landlords can update applications for own properties" ON applications FOR UPDATE USING (auth.uid() = landlord_id);
```

### 2. **inquiries** (Track Inquiry Status)
```sql
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  landlord_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  status TEXT NOT NULL DEFAULT 'new', -- new, viewed, responded, converted_to_application
  inquiry_type TEXT, -- general, viewing_request, price_negotiation, other
  message TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  viewed_at TIMESTAMP WITH TIME ZONE,
  responded_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own inquiries" ON inquiries FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = landlord_id);
CREATE POLICY "Users can create inquiries" ON inquiries FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Landlords can update inquiry status" ON inquiries FOR UPDATE USING (auth.uid() = landlord_id);
```

### 3. **property_videos** (Videos & Virtual Tours)
```sql
CREATE TABLE property_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  video_url TEXT NOT NULL, -- stored in Blob
  thumbnail_url TEXT,
  
  video_type TEXT NOT NULL DEFAULT 'walkthrough', -- walkthrough, virtual_tour, neighborhood, other
  duration_seconds INTEGER,
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE property_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view videos for published properties" ON property_videos FOR SELECT USING (
  EXISTS (SELECT 1 FROM properties WHERE properties.id = property_videos.property_id AND properties.status = 'available')
);
CREATE POLICY "Property owners can manage videos" ON property_videos FOR ALL USING (
  EXISTS (SELECT 1 FROM properties WHERE properties.id = property_videos.property_id AND properties.owner_id = auth.uid())
);
```

### 4. **property_analytics** (Track Performance)
```sql
CREATE TABLE property_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  
  -- Daily metrics
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  application_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  
  -- Derived metrics
  average_response_time_hours NUMERIC,
  inquiry_to_application_rate NUMERIC,
  
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(property_id, date)
);

ALTER TABLE property_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Landlords can view own property analytics" ON property_analytics FOR SELECT USING (
  EXISTS (SELECT 1 FROM properties WHERE properties.id = property_analytics.property_id AND properties.owner_id = auth.uid())
);
```

### 5. **property_verification** (Verify Ownership)
```sql
CREATE TABLE property_verification (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  landlord_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  
  -- Documents
  id_document_url TEXT, -- ID card, driver's license
  property_deed_url TEXT, -- Property ownership document
  utility_bill_url TEXT, -- Recent utility bill showing address
  
  -- Metadata
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES profiles(id),
  rejection_reason TEXT,
  verified_badge_enabled BOOLEAN DEFAULT FALSE
);

ALTER TABLE property_verification ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own verification" ON property_verification FOR SELECT USING (auth.uid() = landlord_id);
CREATE POLICY "Landlords can submit verification" ON property_verification FOR INSERT WITH CHECK (auth.uid() = landlord_id);
```

### 6. **property_pricing_tiers** (Free/Premium Listings)
```sql
CREATE TABLE property_pricing_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  
  tier TEXT NOT NULL DEFAULT 'free', -- free, premium_basic, premium_plus
  status TEXT NOT NULL DEFAULT 'active', -- active, expired, cancelled
  
  features_enabled JSONB DEFAULT '{}', -- e.g., {"videos": true, "analytics": true}
  
  price NUMERIC DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE property_pricing_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Landlords can manage own tier" ON property_pricing_tiers FOR ALL USING (
  EXISTS (SELECT 1 FROM properties WHERE properties.id = property_pricing_tiers.property_id AND properties.owner_id = auth.uid())
);
```

---

## Feature Implementation Phases

### Phase 1: Core Inquiries & Applications (Weeks 1-2)
**Impact: HIGH | Effort: MEDIUM**

#### 1.1 Manage Inquiries Dashboard
- [ ] List all inquiries for landlord properties
- [ ] Mark inquiries as viewed/responded
- [ ] Inline messaging for each inquiry
- [ ] Status filtering and sorting
- [ ] Notification when new inquiry received

#### 1.2 Tenant Applications
- [ ] Application form on property detail page
- [ ] Application submission storage
- [ ] Landlord application review dashboard
- [ ] Accept/reject applications with feedback
- [ ] Application status tracking for tenants

**Components Needed:**
```
/components
  ├── inquiry-card.tsx
  ├── inquiry-list.tsx
  ├── application-form.tsx
  ├── application-card.tsx
  └── application-list.tsx

/app/dashboard
  ├── inquiries/
  │   ├── page.tsx
  │   └── [id]/page.tsx
  └── applications/
      ├── page.tsx
      └── [id]/page.tsx
```

**Database Tables:** `inquiries`, `applications`

---

### Phase 2: Property Verification & Ownership (Weeks 3-4)
**Impact: MEDIUM | Effort: LOW-MEDIUM**

#### 2.1 Verification Upload
- [ ] Multi-document upload (ID, deed, utility bill)
- [ ] File validation and previews
- [ ] Submission workflow

#### 2.2 Admin Verification Panel
- [ ] List pending verifications
- [ ] Document review
- [ ] Approve/reject with feedback
- [ ] Issue verification badge

#### 2.3 Display Verified Badge
- [ ] Show badge on landlord profile
- [ ] Show badge on property listings
- [ ] Search filter by verified landlords

**Components Needed:**
```
/components
  ├── verification-upload.tsx
  ├── verified-badge.tsx
  └── document-preview.tsx

/app/dashboard
  └── verification/
      ├── page.tsx
      └── submit/page.tsx

/app/admin
  └── verifications/page.tsx
```

**Database Tables:** `property_verification`

---

### Phase 3: Video Uploads & Virtual Tours (Weeks 5-6)
**Impact: HIGH | Effort: MEDIUM-HIGH**

#### 3.1 Video Upload System
- [ ] Drag-and-drop video upload interface
- [ ] Video storage in Blob
- [ ] Thumbnail generation
- [ ] Progress tracking
- [ ] Multiple videos per property

#### 3.2 Video Player
- [ ] Video playback component
- [ ] Playlist for multiple videos
- [ ] Quality selection

#### 3.3 Virtual Tour Integration
- [ ] 3D tour embed support (optional: Matterport)
- [ ] Tour preview
- [ ] Tour instructions

**Components Needed:**
```
/components
  ├── video-upload.tsx
  ├── video-player.tsx
  ├── video-gallery.tsx
  ├── virtual-tour-embed.tsx
  └── tour-instructions.tsx

/app/dashboard/properties/[id]
  ├── media/page.tsx
  └── upload-video/page.tsx
```

**Database Tables:** `property_videos`

---

### Phase 4: Listing Performance Analytics (Weeks 7-8)
**Impact: HIGH | Effort: MEDIUM**

#### 4.1 Analytics Tracking
- [ ] Track property views
- [ ] Track inquiries and applications
- [ ] Track favorite/saves
- [ ] Aggregate daily metrics

#### 4.2 Analytics Dashboard
- [ ] View count trends (weekly/monthly)
- [ ] Inquiry-to-application conversion rate
- [ ] Engagement metrics
- [ ] Comparison with similar properties
- [ ] Export reports

#### 4.3 Recommendations Engine
- [ ] Suggest improvements based on low engagement
- [ ] Recommend optimal pricing
- [ ] Identify trending features

**Components Needed:**
```
/components
  ├── analytics-overview.tsx
  ├── analytics-charts.tsx
  ├── performance-metrics.tsx
  └── recommendations-panel.tsx

/app/dashboard
  └── analytics/
      ├── page.tsx
      └── [property_id]/page.tsx
```

**Database Tables:** `property_analytics`

---

### Phase 5: Pricing Tiers & Premium Features (Weeks 9-10)
**Impact: MEDIUM | Effort: MEDIUM-HIGH**

#### 5.1 Free vs Premium Tiers
```
FREE TIER:
- Up to 3 properties
- Basic listing with images
- Standard inquiries
- 30-day listing duration

PREMIUM BASIC ($4.99/month per property):
- Enhanced analytics
- Video uploads (up to 5 videos)
- Priority support

PREMIUM PLUS ($9.99/month per property):
- All Premium Basic features
- Virtual tour embed
- Advanced analytics & insights
- Verification badge support
```

#### 5.2 Tier Management
- [ ] Upgrade/downgrade UI
- [ ] Payment processing (Stripe integration)
- [ ] Feature toggle system
- [ ] Usage tracking

#### 5.3 Feature Restrictions
- [ ] Enforce tier limits
- [ ] Upsell prompts when limits reached

**Components Needed:**
```
/components
  ├── pricing-comparison.tsx
  ├── upgrade-prompt.tsx
  └── feature-unavailable-modal.tsx

/app/dashboard
  └── settings/
      ├── subscription/page.tsx
      └── upgrade/page.tsx
```

**Database Tables:** `property_pricing_tiers`

---

## UI/UX Flow Diagrams

### Inquiry Management Flow
```
Property Page
    ↓
Send Inquiry Button
    ↓
Inquiry Form (modal/page)
    ↓
Inquiry Stored (DB)
    ↓
Landlord Dashboard → Inquiries Tab
    ↓
View Inquiry + Respond Inline
    ↓
Tenant Gets Notification
```

### Application Flow
```
Property Page
    ↓
Apply Now Button
    ↓
Application Form (multi-step)
  - Personal Info
  - Financial Info
  - Document Upload
  - References
    ↓
Application Submitted
    ↓
Landlord Dashboard → Applications Tab
    ↓
Review Application
    ↓
Accept/Reject
    ↓
Tenant Receives Decision
```

### Video Upload Flow
```
Dashboard → Property Management
    ↓
Edit Property → Media Tab
    ↓
Drag & Drop Video Upload
    ↓
Processing (backend)
    ↓
Video Listed in Gallery
    ↓
Property Detail Page Shows Videos
```

---

## Technical Stack

| Component | Technology |
|-----------|------------|
| Database | Supabase PostgreSQL |
| Storage | Vercel Blob (videos, documents) |
| Authentication | Supabase Auth (already set up) |
| Forms | React Hook Form + Zod validation |
| File Upload | react-dropzone + Blob API |
| Video Player | react-player or HLS.js |
| Charts | Recharts (for analytics) |
| Notifications | Toast notifications (Sonner) |
| Payments (Phase 5) | Stripe integration |

---

## API Endpoints Needed

### Inquiries
```
POST   /api/inquiries              - Create new inquiry
GET    /api/inquiries              - List user's inquiries
GET    /api/inquiries/:id          - Get inquiry details
PATCH  /api/inquiries/:id/status   - Update inquiry status
PATCH  /api/inquiries/:id/response - Add response message
```

### Applications
```
POST   /api/applications              - Submit application
GET    /api/applications              - List applications (landlord/tenant)
GET    /api/applications/:id          - Get application details
PATCH  /api/applications/:id/status   - Update application status
POST   /api/applications/:id/review   - Review and approve/reject
```

### Videos
```
POST   /api/property-videos/upload      - Upload video
GET    /api/property-videos/:propertyId - List property videos
DELETE /api/property-videos/:id         - Delete video
PATCH  /api/property-videos/:id/order   - Reorder videos
```

### Analytics
```
GET    /api/analytics/:propertyId           - Get property analytics
GET    /api/analytics/:propertyId/daily     - Daily metrics
GET    /api/analytics/:propertyId/trends    - Trend analysis
POST   /api/analytics/track-event           - Track view/interaction
```

### Verification
```
POST   /api/verification/submit           - Submit verification docs
GET    /api/verification/status/:landlordId - Check verification status
PATCH  /api/verification/upload/:docType    - Re-upload specific document
```

---

## Database Relationships Diagram

```
profiles
├── owns ──→ properties
│          ├── has ──→ property_images
│          ├── receives ──→ inquiries
│          ├── receives ──→ applications
│          ├── has ──→ property_videos
│          ├── has ──→ property_analytics
│          └── has ──→ property_verification
│
├── sends ──→ inquiries
├── submits ──→ applications
└── submits ──→ property_verification
```

---

## Success Metrics

| Feature | KPI |
|---------|-----|
| Inquiries | Response time < 2 hours |
| Applications | 80% of landlords use feature |
| Videos | Avg 30% more inquiries with videos |
| Analytics | 60% of landlords check daily |
| Verification | 70% of listings verified |
| Premium Tier | 20% adoption rate |

---

## Estimated Timeline

- **Phase 1 (Inquiries & Applications):** 2 weeks
- **Phase 2 (Verification):** 1.5 weeks
- **Phase 3 (Videos):** 2 weeks
- **Phase 4 (Analytics):** 1.5 weeks
- **Phase 5 (Premium):** 2 weeks

**Total: ~9-10 weeks** (can be parallelized for faster delivery)

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Video storage costs | Implement compression, size limits, tier restrictions |
| Database performance | Add indexes on frequently queried columns |
| File upload failures | Implement retry logic and progress recovery |
| Fraud in applications | Email verification, phone verification, manual review |
| Spam inquiries | Rate limiting, spam detection, user reputation system |

---

## Next Steps

1. Review this plan with stakeholders
2. Prioritize which features to build first
3. Create database migration scripts
4. Set up API route structure
5. Begin Phase 1 implementation
