## View Website

Go to www.velric.ai

## Features

### Generate Missions Page (`/generate`)

- **Personalized Mission Generation**: AI-powered mission recommendations based on user interests
- **Interactive Interest Survey**: Multi-select form with React Hook Form + Zod validation
- **Responsive Mission Grid**: Animated cards displaying mission details, difficulty, and skills
- **Loading States**: Smooth loading animations with simulated API delays
- **Regeneration**: Users can regenerate missions or start over with different interests

### Components Added

- `MissionCard.tsx`: Displays individual mission information with hover animations
- `SubmissionForm.tsx`: Interest selection form with validation and loading states
- `LoadingSpinner.tsx`: Reusable loading component with Framer Motion animations
- `Button.tsx`: Consistent button component with multiple variants

### Utilities

- `lib/missionHelpers.ts`: Mock mission data, filtering logic, and utility functions

## Getting Started

```bash
npm run dev
```
