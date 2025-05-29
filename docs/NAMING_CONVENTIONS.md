# EV-Trader Naming Conventions

This document outlines the naming conventions used throughout the EV-Trader project to ensure consistency and prevent confusion.

## Table of Contents
- [Database Schema](#database-schema)
- [API Routes](#api-routes)
- [Frontend Components](#frontend-components)
- [TypeScript Interfaces](#typescript-interfaces)
- [File and Directory Structure](#file-and-directory-structure)
- [Environment Variables](#environment-variables)
- [Common Patterns](#common-patterns)

## Database Schema

### Table Names
- **Format**: `snake_case` (lowercase with underscores)
- **Examples**: `vehicles`, `user_verifications`, `vehicle_images`, `listing_plans`

### Column Names
- **Format**: `snake_case` (lowercase with underscores)
- **Examples**: 
  - `user_id`
  - `seller_id`
  - `created_at`
  - `updated_at`
  - `approval_status`
  - `battery_capacity`
  - `range_km`
  - `charging_time_standard`
  - `charging_time_fast`
  - `exterior_color`
  - `interior_color`
  - `body_type`
  - `is_featured`
  - `view_count`
  - `inquiry_count`

### Foreign Key Naming
- **Format**: `{referenced_table}_id`
- **Examples**: `user_id`, `vehicle_id`, `listing_plan_id`

### Boolean Columns
- **Format**: `is_{description}` or `has_{description}`
- **Examples**: `is_admin`, `is_featured`, `is_primary`, `has_warranty`

### Status/Enum Columns
- **Format**: `{context}_status` or descriptive name
- **Examples**: `approval_status`, `verification_status`, `payment_status`

## API Routes

### Route Structure
- **Format**: `/api/{resource}` or `/api/{resource}/{action}`
- **Examples**:
  - `/api/vehicles`
  - `/api/vehicles/create`
  - `/api/vehicles/my-listings`
  - `/api/admin/verifications`
  - `/api/admin/users`

### Query Parameters
- **Format**: `camelCase`
- **Examples**: `minPrice`, `maxPrice`, `minYear`, `maxYear`, `userId`

### Request/Response Bodies
- **Format**: `camelCase` for JSON properties
- **Examples**:
```json
{
  "userId": "user_123",
  "vehicleData": {
    "make": "Tesla",
    "model": "Model 3",
    "batteryCapacity": 75,
    "chargingTime": {
      "standard": 8,
      "fastCharge": 30
    }
  }
}
```

## Frontend Components

### Component Names
- **Format**: `PascalCase`
- **Examples**: `VehicleCard`, `VehicleListingForm`, `AdminDashboard`, `UserProfile`

### Component Props
- **Format**: `camelCase`
- **Examples**: `vehicleData`, `onSubmit`, `isLoading`, `showDetails`

### State Variables
- **Format**: `camelCase`
- **Examples**: `vehicles`, `loading`, `error`, `filteredVehicles`, `sortOption`

### Event Handlers
- **Format**: `handle{Action}`
- **Examples**: `handleSubmit`, `handleFilterChange`, `handleSortChange`, `handleDelete`

## TypeScript Interfaces

### Interface Names
- **Format**: `PascalCase`
- **Examples**: `Vehicle`, `VehicleData`, `UserProfile`, `AdminStats`

### Interface Properties
- **Format**: `camelCase`
- **Examples**:
```typescript
interface Vehicle {
  id: string;
  sellerId: string;
  sellerType: SellerType;
  evSpecifications: EVSpecifications;
  createdAt: Date;
  updatedAt: Date;
}
```

### Type Aliases
- **Format**: `PascalCase`
- **Examples**: `VehicleStatus`, `SellerType`, `UserType`

### Enum Values
- **Format**: `lowercase` with hyphens or underscores
- **Examples**: `'available' | 'pending' | 'sold'`, `'individual' | 'dealership'`

## File and Directory Structure

### File Names
- **Pages**: `kebab-case` (lowercase with hyphens)
  - Examples: `vehicles.tsx`, `user-profile.tsx`, `admin-dashboard.tsx`
- **Components**: `PascalCase`
  - Examples: `VehicleCard.tsx`, `AdminSidebar.tsx`, `UserMenu.tsx`
- **API Routes**: `route.ts` in appropriately named directories
  - Examples: `vehicles/route.ts`, `admin/users/route.ts`

### Directory Names
- **Format**: `kebab-case` (lowercase with hyphens)
- **Examples**: `vehicle-listing`, `user-management`, `admin-panel`

### Hook Files
- **Format**: `use{HookName}.ts`
- **Examples**: `useAuth.ts`, `useVehicles.ts`, `useSupabase.ts`

### Utility Files
- **Format**: `kebab-case`
- **Examples**: `email-helpers.ts`, `date-utils.ts`, `validation-schemas.ts`

## Environment Variables

### Format
- **Format**: `SCREAMING_SNAKE_CASE`
- **Examples**: 
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SMTP_HOST`
  - `SMTP_PORT`

### Prefixes
- **Public Variables**: `NEXT_PUBLIC_`
- **Database**: `SUPABASE_` or `DATABASE_`
- **Email**: `SMTP_` or `EMAIL_`
- **Payment**: `STRIPE_`
- **Authentication**: `CLERK_` or `AUTH_`

## Common Patterns

### Data Conversion Functions
- **Database to Frontend**: `convertToVehicle(data: VehicleData): Vehicle`
- **Frontend to Database**: `convertToVehicleData(vehicle: Vehicle): VehicleData`

### API Response Patterns
```typescript
// Success Response
{
  data: T[],
  pagination?: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}

// Error Response
{
  error: string,
  details?: string
}
```

### Loading States
- **Boolean**: `loading`, `isLoading`, `submitting`, `isSubmitting`
- **String**: `'idle' | 'loading' | 'success' | 'error'`

### Error Handling
- **State**: `error: string | null`
- **Functions**: `setError(message: string)`

## Database-to-Frontend Field Mapping

When converting from database schema to frontend interfaces, use these mappings:

| Database Field | Frontend Property | Notes |
|----------------|-------------------|-------|
| `user_id` | `userId` | Convert snake_case to camelCase |
| `seller_id` | `sellerId` | Convert snake_case to camelCase |
| `created_at` | `createdAt` | Convert to Date object |
| `updated_at` | `updatedAt` | Convert to Date object |
| `battery_capacity` | `batteryCapacity` | Convert snake_case to camelCase |
| `range_km` | `range` | Simplify property name |
| `charging_time_standard` | `chargingTime.standard` | Nest related properties |
| `charging_time_fast` | `chargingTime.fastCharge` | Nest and rename for clarity |
| `exterior_color` | `exteriorColor` | Convert snake_case to camelCase |
| `interior_color` | `interiorColor` | Convert snake_case to camelCase |
| `body_type` | `bodyType` | Convert snake_case to camelCase |
| `is_featured` | `isFeatured` | Convert snake_case to camelCase |
| `view_count` | `viewCount` | Convert snake_case to camelCase |
| `inquiry_count` | `inquiryCount` | Convert snake_case to camelCase |
| `approval_status` | `status` | Simplify property name |

## Best Practices

1. **Consistency**: Always use the same naming pattern within the same context
2. **Clarity**: Choose descriptive names that clearly indicate purpose
3. **Avoid Abbreviations**: Use full words unless the abbreviation is universally understood
4. **Database First**: Design database schema with clear, descriptive names
5. **Type Safety**: Use TypeScript interfaces to enforce naming consistency
6. **Documentation**: Update this document when adding new naming patterns

## Common Mistakes to Avoid

1. **Mixed Case in Database**: Don't use `camelCase` in database column names
2. **Inconsistent Pluralization**: Be consistent with singular/plural forms
3. **Unclear Abbreviations**: Avoid `usr_id` when `user_id` is clearer
4. **Missing Prefixes**: Always prefix boolean columns with `is_` or `has_`
5. **Inconsistent Status Fields**: Use consistent patterns like `{context}_status`

## Tools and Validation

- **ESLint**: Configure rules to enforce naming conventions
- **TypeScript**: Use strict typing to catch naming inconsistencies
- **Database Migrations**: Review column names before applying migrations
- **Code Reviews**: Check for naming convention adherence

---

**Last Updated**: 2025-01-26
**Version**: 1.0
**Maintainer**: EV-Trader Development Team
