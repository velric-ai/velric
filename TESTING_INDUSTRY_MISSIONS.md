# Quick Test Guide - Industry-Based Mission Generation

## Problem Fixed ✅

Your application now:

1. **Respects industry selection** - Marketing users get marketing missions, not coding missions
2. **Avoids repetition** - Each user gets diverse, unique missions
3. **Uses survey data** - Missions are personalized based on the full survey response

## How to Test Locally

### Step 1: Verify Survey Response in Database

First, check that you have a survey response stored:

```sql
SELECT 
  user_id, 
  full_name, 
  industry, 
  mission_focus,
  education_level,
  created_at
FROM survey_responses
ORDER BY created_at DESC
LIMIT 5;
```

Expected output example:
```
user_id          | full_name    | industry   | mission_focus | education_level
-----------------|-----------   |------------|---------------|------------------
"user-123"       | "Jane Doe"   | "Marketing"| "Content..."  | "Bachelor"
"user-456"       | "Bob Smith"  | "Sales"    | "Revenue..."  | "Bachelor"
```

### Step 2: Test Marketing Mission Generation

```bash
curl -X POST http://localhost:3000/api/survey-based-missions \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-123", "count": 3}'
```

**Expected Response:**
- ✅ Missions with titles like "Design Marketing Campaign", "Create Customer Retention Program"
- ✅ NOT "Build E-commerce Platform" or other coding missions
- ✅ Field values like "Marketing Strategy", "Marketing Analytics"
- ✅ Skills like "Content Strategy", "Social Media Marketing", "Data Analytics"

### Step 3: Test Sales Mission Generation

```bash
curl -X POST http://localhost:3000/api/survey-based-missions \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-456", "count": 3}'
```

**Expected Response:**
- ✅ Missions about CRM, pipeline management, territory strategy
- ✅ Field values like "Sales Operations", "Sales Strategy"
- ✅ Skills like "CRM Management", "Sales Process Design", "Pipeline Analysis"

### Step 4: Test Deduplication

Run the same request twice:

```bash
# First call
curl -X POST http://localhost:3000/api/survey-based-missions \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-123", "count": 2}'

# Second call (immediately after)
curl -X POST http://localhost:3000/api/survey-based-missions \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-123", "count": 2}'
```

**Expected Behavior:**
- ✅ First call returns 2 missions
- ✅ Second call returns 2 DIFFERENT missions (not duplicates)
- ✅ Check console logs should show "[Survey-Based Missions] Skipping duplicate mission..."

### Step 5: Check Stored Missions

Verify missions were stored and associated with the user:

```sql
SELECT 
  id,
  title,
  field,
  industry,
  generated_for_user_id,
  is_ai_generated,
  created_at
FROM missions
WHERE generated_for_user_id = 'user-123'
AND is_ai_generated = true
ORDER BY created_at DESC
LIMIT 10;
```

Expected:
```
id              | title                                    | field              | generated_for_user_id | is_ai_generated
----------------|----------------------------------------|-------------------|----------------------|----------------
"mission-1"     | "Design Marketing Campaign Strategy"    | "Marketing Strategy" | "user-123"          | true
"mission-2"     | "Develop Customer Retention Program"    | "Marketing Analytics"| "user-123"          | true
"mission-3"     | "Build Territory Management Strategy"   | "Sales Strategy"    | "user-456"          | true
```

## Test Different Industries

### For Finance Industry

```bash
# First, ensure a finance user survey exists in database
curl -X POST http://localhost:3000/api/survey-based-missions \
  -H "Content-Type: application/json" \
  -d '{"userId": "finance-user-id", "count": 3}'
```

Expected missions:
- "Build Financial Forecasting Model"
- "Implement Cost Reduction Program"
- NOT "Build a Banking App"

### For Healthcare Industry

```bash
curl -X POST http://localhost:3000/api/survey-based-missions \
  -H "Content-Type: application/json" \
  -d '{"userId": "healthcare-user-id", "count": 2}'
```

Expected missions:
- "Design Patient Care Coordination System"
- NOT "Implement HIPAA Encryption System" (too technical)

### For Education Industry

```bash
curl -X POST http://localhost:3000/api/survey-based-missions \
  -H "Content-Type: application/json" \
  -d '{"userId": "education-user-id", "count": 2}'
```

Expected missions:
- "Develop Competency-Based Learning Curriculum"
- NOT "Build an LMS Web Application"

## Troubleshooting Tests

### Test: Survey Data Not Found

```bash
curl -X POST http://localhost:3000/api/survey-based-missions \
  -H "Content-Type: application/json" \
  -d '{"userId": "non-existent-user", "count": 3}'
```

Expected response:
```json
{
  "success": false,
  "error": "User survey data not found. Please complete the survey first.",
  "missions": []
}
```

### Test: Database Connection Issue

If you get a 500 error, check:

```bash
# 1. Check Supabase connection
# 2. Verify survey_responses table exists
# 3. Check server logs for specific error

# Look for error patterns like:
# - "PGRST116" = Record not found
# - "PGRST205" = Table doesn't exist
# - "42P01" = Relation doesn't exist
```

### Test: OpenAI API Fallback

If OpenAI API fails, system should fallback to template-based generation:

```bash
# Set OPENAI_API_KEY to invalid value to test fallback
export OPENAI_API_KEY="sk-invalid"

curl -X POST http://localhost:3000/api/survey-based-missions \
  -H "Content-Type: application/json" \
  -d '{"userId": "test-user", "count": 2}'
```

Expected:
- ✅ Missions still generated (using fallback templates)
- ✅ Still industry-appropriate
- ✅ Console shows: "[Survey-Based Missions] Error generating mission...", then fallback used

## Integration Tests

### Test: Full User Flow

```bash
# 1. Create a test user in Supabase Auth
# 2. Submit survey form with industry="Marketing"
# 3. Call missions endpoint
# 4. Verify marketing missions returned
# 5. Call endpoint again
# 6. Verify different missions returned (no duplication)
```

### Test: Multiple Industries Same Database

```sql
-- Verify system handles multiple industries correctly
SELECT industry, COUNT(*) as mission_count
FROM missions
WHERE is_ai_generated = true
GROUP BY industry;

-- Expected output:
-- industry   | mission_count
-- ----------|---------------
-- Marketing | 3
-- Sales     | 3  
-- Finance   | 2
```

## Console Log Indicators

Watch for these console messages to verify system working:

**Good Signs:**
```
[Survey-Based Missions] Fetched survey data: userId, fullName, industry
[Survey-Based Missions] Using [Industry]-specific missions
[Survey-Based Missions] Generated [N] unique missions
[Survey-Based Missions] Stored mission: [Title]
```

**Warning Signs:**
```
[Survey-Based Missions] Error fetching survey data
[Survey-Based Missions] Skipping duplicate mission
[Survey-Based Missions] Failed to store mission
```

## Performance Expectations

- **Survey data fetch**: < 100ms
- **Mission generation**: 10-30 seconds (depends on OpenAI API)
- **Database storage**: < 500ms per mission
- **Deduplication check**: < 50ms

## Success Criteria

Your implementation is working correctly when:

✅ Marketing user gets marketing missions (not coding)  
✅ Sales user gets sales missions (not coding)  
✅ Each industry gets industry-appropriate missions  
✅ No duplicate missions for the same user  
✅ Missions contain industry-specific skills and metrics  
✅ System falls back to templates if OpenAI unavailable  
✅ Database stores missions with correct associations  

## Next Steps After Testing

1. **Update frontend** to use `/api/survey-based-missions`
2. **Add user feedback collection** on mission relevance
3. **Monitor mission diversity** - ensure no patterns of repetition
4. **Add more industry templates** based on user feedback
5. **Create admin dashboard** to view generated missions by industry

