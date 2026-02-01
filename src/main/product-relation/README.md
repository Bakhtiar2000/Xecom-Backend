# Product Relation Module

## Overview

This is a separate, independent module that handles product relationships (related products, cross-sell, up-sell). It's decoupled from the main Product module for better separation of concerns.

## Structure

```
src/main/product-relation/
├── product-relation.module.ts        # Module definition
├── product-relation.controller.ts   # REST endpoints
├── product-relation.service.ts      # Business logic
├── product-relation.repository.ts   # Database operations
└── product-relation.dto.ts          # Data transfer objects
```

## Endpoints

All endpoints are prefixed with `/product` but handle relation-specific operations:

| Method | Endpoint                              | Description                  |
| ------ | ------------------------------------- | ---------------------------- |
| GET    | `/product/:id/relations?type=RELATED` | Get product relations        |
| POST   | `/product/relations`                  | Add single relation          |
| POST   | `/product/relations/bulk`             | Add multiple relations       |
| PUT    | `/product/relations/:id`              | Update relation priority     |
| DELETE | `/product/relations/:id`              | Delete specific relation     |
| DELETE | `/product/:id/relations?type=TYPE`    | Delete all relations of type |

## Dependencies

### Modules

- `AuthModule` - For authentication/authorization

### Services/Repositories

- `ProductRepository` - To validate product existence (from Product module)
- `ProductRelationRepository` - Manages product_relations table

## Relation Types

```typescript
enum ProductRelationType {
  RELATED      // "You may also like"
  CROSS_SELL   // "Recommended for you"
  UP_SELL      // "Upgrade to premium"
}
```

## Usage Example

```typescript
// Add related products
POST /product/relations/bulk
{
  "productId": "laptop-uuid",
  "type": "RELATED",
  "relatedProductIds": ["bag-uuid", "mouse-uuid"],
  "priority": 10
}

// Get all relations
GET /product/laptop-uuid/relations

// Get only cross-sell products
GET /product/laptop-uuid/relations?type=CROSS_SELL

// Update priority
PUT /product/relations/relation-uuid
{
  "priority": 15
}

// Delete all up-sell relations
DELETE /product/laptop-uuid/relations?type=UP_SELL
```

## Integration with Product Module

The Product module includes relations when fetching a product:

```typescript
GET /product/:id
// Returns product with relations array included
{
  "id": "product-uuid",
  "name": "Laptop",
  "relations": [
    {
      "id": "relation-uuid",
      "type": "RELATED",
      "priority": 10,
      "relatedTo": {
        "id": "bag-uuid",
        "name": "Laptop Bag",
        ...
      }
    }
  ]
}
```

## Key Features

✅ **Independent Module** - Fully decoupled from Product module  
✅ **Foreign Key Enforcement** - Cascade deletes when products are removed  
✅ **Priority-Based Ordering** - Control which products show first  
✅ **Bulk Operations** - Efficiently add multiple relations  
✅ **Type Filtering** - Query by relation type  
✅ **Multi-Tenant Support** - Respects tenant isolation

## Database Schema

```prisma
model ProductRelation {
  id          String              @id @default(uuid())
  tenantId    String?
  productId   String
  relatedToId String
  type        ProductRelationType
  priority    Int                 @default(0)
  createdAt   DateTime            @default(now())

  product   Product @relation("ProductRelations", ...)
  relatedTo Product @relation("RelatedProducts", ...)

  @@unique([tenantId, productId, relatedToId, type])
  @@index([productId, type])
  @@index([relatedToId])
}
```

## Architecture Benefits

### Separation of Concerns

- Product module handles product CRUD
- Product-Relation module handles relationships
- Clear boundaries and responsibilities

### Independent Testing

- Test product relations without product complexity
- Mock ProductRepository in tests

### Scalability

- Can be deployed as separate microservice if needed
- Independent versioning
- Easier to maintain

### Reusability

- Can be imported by other modules (e.g., Order module for recommendations)
- Exported service can be used across the application

## Future Enhancements

Potential additions without modifying Product module:

1. **AI Recommendations**
   - Add `algorithm` field (manual, ai, purchase-history)
   - Add `score` field for confidence

2. **A/B Testing**
   - Track which relations convert better
   - Automatic priority adjustment

3. **Analytics**
   - Track click-through rates
   - Conversion tracking

4. **Reason Tracking**
   - Add `reason` field (e.g., "Frequently bought together")
   - Display to users

## Testing

```bash
# Unit tests
npm test product-relation.service

# E2E tests
npm run test:e2e -- product-relation

# Integration tests
npm run test:integration -- product-relation
```

## Notes

- The module shares the `/product` route prefix with Product module for consistent API
- ProductRepository is imported from Product module (not duplicated)
- All relation operations require authentication (ADMIN, SUPER_ADMIN)
- Relations are automatically deleted when products are removed (cascade)
