# E-Commerce Order Management API - Postman Collection

## Base Configuration

### Environment Variables
```json
{
  "baseUrl": "http://localhost:3000",
  "authToken": "",
  "tenantId": "",
  "customerId": "",
  "userId": "",
  "orderId": "",
  "productId": "",
  "variantId": "",
  "cartId": "",
  "paymentId": "",
  "shipmentId": "",
  "returnId": ""
}
```

### Common Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {{authToken}}"
}
```

---

## 1. ORDERS

### 1.1 Create Order
**POST** `/order/create`

**Access:** CUSTOMER (authenticated)

**Description:** Creates a new order from cart items with automatic inventory deduction and payment initialization.

**Request Body:**
```json
{
  "addressId": "550e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "variantId": "660e8400-e29b-41d4-a716-446655440001",
      "quantity": 2
    },
    {
      "variantId": "660e8400-e29b-41d4-a716-446655440002",
      "quantity": 1
    }
  ],
  "shippingMethod": "standard",
  "couponCode": "SAVE10",
  "notes": "Please deliver between 9 AM - 5 PM" 
}
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": "770e8400-e29b-41d4-a716-446655440003",
      "orderNumber": "ORD-1737820800-A1B2C3",
      "tenantId": "880e8400-e29b-41d4-a716-446655440004",
      "customerId": "990e8400-e29b-41d4-a716-446655440005",
      "addressId": "550e8400-e29b-41d4-a716-446655440000",
      "status": "PENDING",
      "paymentStatus": "PENDING",
      "subtotal": 299.97,
      "taxAmount": 29.99,
      "shippingCost": 15.00,
      "discount": 29.99,
      "total": 314.97,
      "currency": "USD",
      "shippingMethod": "standard",
      "notes": "Please deliver between 9 AM - 5 PM",
      "couponCode": "SAVE10",
      "placedAt": "2026-01-25T10:30:00.000Z",
      "orderItems": [
        {
          "id": "aa0e8400-e29b-41d4-a716-446655440006",
          "productId": "bb0e8400-e29b-41d4-a716-446655440007",
          "variantId": "660e8400-e29b-41d4-a716-446655440001",
          "quantity": 2,
          "unitPrice": 99.99,
          "totalPrice": 199.98,
          "product": {
            "name": "Premium Wireless Headphones",
            "slug": "premium-wireless-headphones"
          },
          "variant": {
            "sku": "PWH-BLK-001",
            "attributes": [
              {
                "attributeValue": {
                  "value": "Black",
                  "attribute": { "name": "Color" }
                }
              }
            ]
          }
        }
      ]
    },
    "payment": {
      "id": "cc0e8400-e29b-41d4-a716-446655440008",
      "redirectUrl": "https://sandbox.sslcommerz.com/gwprocess/v4/gw.php?Q=REDIRECT&SESSIONKEY=ABC123XYZ"
    }
  }
}
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "success": false,
  "message": "Insufficient stock for one or more items",
  "errors": [
    {
      "variantId": "660e8400-e29b-41d4-a716-446655440001",
      "requested": 5,
      "available": 3,
      "message": "Only 3 units available in stock"
    }
  ]
}
```

---

### 1.2 Get All Orders (Admin)
**GET** `/order`

**Access:** ADMIN, SUPER_ADMIN, STAFF

**Query Parameters:**
```
page=1
limit=10
sortBy=placedAt
sortOrder=desc
status=PENDING,CONFIRMED
paymentStatus=PAID
customerId=990e8400-e29b-41d4-a716-446655440005
tenantId=880e8400-e29b-41d4-a716-446655440004
dateFrom=2026-01-01
dateTo=2026-01-31
orderNumber=ORD-1737820800-A1B2C3
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Orders retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 156
  },
  "data": {
    "orders": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440003",
        "orderNumber": "ORD-1737820800-A1B2C3",
        "status": "CONFIRMED",
        "paymentStatus": "PAID",
        "total": 314.97,
        "currency": "USD",
        "placedAt": "2026-01-25T10:30:00.000Z",
        "customer": {
          "id": "990e8400-e29b-41d4-a716-446655440005",
          "user": {
            "name": "John Doe",
            "email": "john.doe@example.com"
          }
        },
        "orderItems": [
          {
            "quantity": 2,
            "unitPrice": 99.99,
            "product": {
              "name": "Premium Wireless Headphones"
            }
          }
        ]
      }
    ]
  }
}
```

---

### 1.3 Get My Orders (Customer)
**GET** `/order/my-orders`

**Access:** CUSTOMER (authenticated)

**Query Parameters:**
```
page=1
limit=10
status=DELIVERED
dateFrom=2026-01-01
dateTo=2026-01-31
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Your orders retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 23
  },
  "data": {
    "orders": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440003",
        "orderNumber": "ORD-1737820800-A1B2C3",
        "status": "DELIVERED",
        "paymentStatus": "PAID",
        "subtotal": 299.97,
        "taxAmount": 29.99,
        "shippingCost": 15.00,
        "discount": 29.99,
        "total": 314.97,
        "currency": "USD",
        "placedAt": "2026-01-25T10:30:00.000Z",
        "deliveredAt": "2026-01-28T14:20:00.000Z",
        "trackingNumber": "1Z999AA10123456784",
        "orderItems": [
          {
            "id": "aa0e8400-e29b-41d4-a716-446655440006",
            "quantity": 2,
            "unitPrice": 99.99,
            "totalPrice": 199.98,
            "product": {
              "name": "Premium Wireless Headphones",
              "slug": "premium-wireless-headphones",
              "images": [
                {
                  "imageUrl": "https://cdn.example.com/headphones.jpg",
                  "isFeatured": true
                }
              ]
            }
          }
        ]
      }
    ]
  }
}
```

---

### 1.4 Get Order Details
**GET** `/order/:id`

**Access:** CUSTOMER (own orders), ADMIN, STAFF (all orders)

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Order details retrieved successfully",
  "data": {
    "order": {
      "id": "770e8400-e29b-41d4-a716-446655440003",
      "orderNumber": "ORD-1737820800-A1B2C3",
      "tenantId": "880e8400-e29b-41d4-a716-446655440004",
      "status": "DELIVERED",
      "paymentStatus": "PAID",
      "paymentMethod": "CREDIT_CARD",
      "subtotal": 299.97,
      "taxAmount": 29.99,
      "shippingCost": 15.00,
      "discount": 29.99,
      "total": 314.97,
      "currency": "USD",
      "notes": "Please deliver between 9 AM - 5 PM",
      "internalNotes": "VIP customer - priority handling",
      "couponCode": "SAVE10",
      "shippingMethod": "standard",
      "trackingNumber": "1Z999AA10123456784",
      "estimatedDelivery": "2026-01-28T23:59:59.000Z",
      "deliveredAt": "2026-01-28T14:20:00.000Z",
      "placedAt": "2026-01-25T10:30:00.000Z",
      "updatedAt": "2026-01-28T14:20:00.000Z",
      "customer": {
        "id": "990e8400-e29b-41d4-a716-446655440005",
        "customerType": "PREMIUM",
        "user": {
          "name": "John Doe",
          "email": "john.doe@example.com",
          "phoneNumber": "+1234567890"
        }
      },
      "address": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "street": "123 Main Street, Apt 4B",
        "postalCode": "10001",
        "thana": {
          "name": "Downtown",
          "district": {
            "name": "Manhattan",
            "division": {
              "name": "New York",
              "country": {
                "name": "United States",
                "code": "US"
              }
            }
          }
        }
      },
      "orderItems": [
        {
          "id": "aa0e8400-e29b-41d4-a716-446655440006",
          "quantity": 2,
          "unitPrice": 99.99,
          "totalPrice": 199.98,
          "product": {
            "id": "bb0e8400-e29b-41d4-a716-446655440007",
            "name": "Premium Wireless Headphones",
            "slug": "premium-wireless-headphones",
            "images": [
              {
                "imageUrl": "https://cdn.example.com/headphones.jpg"
              }
            ]
          },
          "variant": {
            "id": "660e8400-e29b-41d4-a716-446655440001",
            "sku": "PWH-BLK-001",
            "price": 99.99,
            "stockQuantity": 48
          }
        }
      ],
      "payments": [
        {
          "id": "cc0e8400-e29b-41d4-a716-446655440008",
          "paymentMethod": "CREDIT_CARD",
          "provider": "sslcommerz",
          "providerTransactionId": "SSL123456789",
          "amount": 314.97,
          "currency": "USD",
          "status": "PAID",
          "createdAt": "2026-01-25T10:31:00.000Z"
        }
      ],
      "shipments": [
        {
          "id": "dd0e8400-e29b-41d4-a716-446655440009",
          "carrier": "UPS",
          "trackingNumber": "1Z999AA10123456784",
          "shippingMethod": "standard",
          "status": "DELIVERED",
          "shippedAt": "2026-01-26T09:15:00.000Z",
          "estimatedDelivery": "2026-01-28T23:59:59.000Z",
          "deliveredAt": "2026-01-28T14:20:00.000Z",
          "cost": 15.00
        }
      ],
      "returns": []
    }
  }
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "success": false,
  "message": "Order not found"
}
```

---

### 1.5 Update Order Status
**PATCH** `/order/:id/status`

**Access:** ADMIN, SUPER_ADMIN, STAFF

**Request Body:**
```json
{
  "status": "PROCESSING",
  "internalNotes": "Items picked and ready for packing"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "order": {
      "id": "770e8400-e29b-41d4-a716-446655440003",
      "orderNumber": "ORD-1737820800-A1B2C3",
      "status": "PROCESSING",
      "internalNotes": "Items picked and ready for packing",
      "updatedAt": "2026-01-25T15:45:00.000Z"
    }
  }
}
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "success": false,
  "message": "Invalid status transition from DELIVERED to PENDING"
}
```

---

### 1.6 Cancel Order
**POST** `/order/:id/cancel`

**Access:** CUSTOMER (before shipped), ADMIN, STAFF (always)

**Request Body (Customer):**
```json
{
  "reason": "Changed my mind",
  "requestedBy": "customer"
}
```

**Request Body (Admin/Staff):**
```json
{
  "reason": "Item out of stock - unable to fulfill",
  "requestedBy": "admin"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "order": {
      "id": "770e8400-e29b-41d4-a716-446655440003",
      "orderNumber": "ORD-1737820800-A1B2C3",
      "status": "CANCELLED",
      "internalNotes": "Cancelled by customer: Changed my mind",
      "updatedAt": "2026-01-25T11:00:00.000Z"
    },
    "refund": {
      "id": "ee0e8400-e29b-41d4-a716-446655440010",
      "amount": 314.97,
      "status": "PENDING",
      "message": "Refund will be processed within 5-7 business days"
    }
  }
}
```

**Error Response (403):**
```json
{
  "statusCode": 403,
  "success": false,
  "message": "Cannot cancel order - already shipped. Please request a return instead."
}
```

---

### 1.7 Get Order Tracking
**GET** `/order/:id/tracking`

**Access:** CUSTOMER (own orders), ADMIN, STAFF

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Tracking information retrieved successfully",
  "data": {
    "order": {
      "id": "770e8400-e29b-41d4-a716-446655440003",
      "orderNumber": "ORD-1737820800-A1B2C3",
      "status": "SHIPPED",
      "trackingNumber": "1Z999AA10123456784",
      "estimatedDelivery": "2026-01-28T23:59:59.000Z"
    },
    "shipment": {
      "id": "dd0e8400-e29b-41d4-a716-446655440009",
      "carrier": "UPS",
      "trackingNumber": "1Z999AA10123456784",
      "shippingMethod": "standard",
      "status": "IN_TRANSIT",
      "shippedAt": "2026-01-26T09:15:00.000Z",
      "estimatedDelivery": "2026-01-28T23:59:59.000Z",
      "trackingUrl": "https://www.ups.com/track?tracknum=1Z999AA10123456784"
    }
  }
}
```

---

### 1.8 Get Order Statistics
**GET** `/order/stats`

**Access:** ADMIN, SUPER_ADMIN

**Query Parameters:**
```
dateFrom=2026-01-01
dateTo=2026-01-31
tenantId=880e8400-e29b-41d4-a716-446655440004
groupBy=day
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Order statistics retrieved successfully",
  "data": {
    "summary": {
      "totalOrders": 1247,
      "totalRevenue": 124780.50,
      "averageOrderValue": 100.06,
      "ordersByStatus": {
        "PENDING": 45,
        "CONFIRMED": 120,
        "PROCESSING": 89,
        "SHIPPED": 156,
        "DELIVERED": 802,
        "CANCELLED": 35
      },
      "paymentStatusBreakdown": {
        "PAID": 1167,
        "PENDING": 45,
        "FAILED": 15,
        "REFUNDED": 20
      },
      "paymentMethodDistribution": {
        "CREDIT_CARD": 678,
        "DEBIT_CARD": 234,
        "CASH_ON_DELIVERY": 156,
        "BANK_TRANSFER": 89,
        "WALLET": 90
      }
    },
    "revenueByPeriod": [
      {
        "date": "2026-01-25",
        "orders": 52,
        "revenue": 5240.78,
        "avgOrderValue": 100.78
      },
      {
        "date": "2026-01-24",
        "orders": 48,
        "revenue": 4890.32,
        "avgOrderValue": 101.88
      }
    ],
    "topCustomers": [
      {
        "customerId": "990e8400-e29b-41d4-a716-446655440005",
        "customerName": "John Doe",
        "orderCount": 24,
        "totalSpent": 3456.78
      }
    ]
  }
}
```

---

### 1.9 Export Orders
**GET** `/order/export`

**Access:** ADMIN, SUPER_ADMIN

**Query Parameters:**
```
dateFrom=2026-01-01
dateTo=2026-01-31
status=DELIVERED
format=csv
tenantId=880e8400-e29b-41d4-a716-446655440004
```

**Success Response (200):**
```csv
Order Number,Customer Name,Customer Email,Status,Payment Status,Total,Currency,Placed At,Delivered At
ORD-1737820800-A1B2C3,John Doe,john.doe@example.com,DELIVERED,PAID,314.97,USD,2026-01-25 10:30:00,2026-01-28 14:20:00
ORD-1737821000-D4E5F6,Jane Smith,jane.smith@example.com,DELIVERED,PAID,567.89,USD,2026-01-25 11:15:00,2026-01-29 09:45:00
```

---

## 2. CART

### 2.1 Get Cart
**GET** `/cart`

**Access:** CUSTOMER (authenticated)

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Cart retrieved successfully",
  "data": {
    "cart": {
      "id": "ff0e8400-e29b-41d4-a716-446655440011",
      "customerId": "990e8400-e29b-41d4-a716-446655440005",
      "createdAt": "2026-01-24T08:30:00.000Z",
      "items": [
        {
          "id": "110e8400-e29b-41d4-a716-446655440012",
          "cartId": "ff0e8400-e29b-41d4-a716-446655440011",
          "variantId": "660e8400-e29b-41d4-a716-446655440001",
          "quantity": 2,
          "createdAt": "2026-01-24T08:30:00.000Z",
          "variant": {
            "id": "660e8400-e29b-41d4-a716-446655440001",
            "sku": "PWH-BLK-001",
            "price": 99.99,
            "stockQuantity": 50,
            "product": {
              "id": "bb0e8400-e29b-41d4-a716-446655440007",
              "name": "Premium Wireless Headphones",
              "slug": "premium-wireless-headphones",
              "status": "ACTIVE",
              "images": [
                {
                  "imageUrl": "https://cdn.example.com/headphones.jpg",
                  "isFeatured": true
                }
              ]
            },
            "attributes": [
              {
                "attributeValue": {
                  "value": "Black",
                  "attribute": { "name": "Color" }
                }
              }
            ]
          },
          "itemSubtotal": 199.98
        },
        {
          "id": "220e8400-e29b-41d4-a716-446655440013",
          "cartId": "ff0e8400-e29b-41d4-a716-446655440011",
          "variantId": "660e8400-e29b-41d4-a716-446655440002",
          "quantity": 1,
          "createdAt": "2026-01-25T09:15:00.000Z",
          "variant": {
            "id": "660e8400-e29b-41d4-a716-446655440002",
            "sku": "SWT-M-BLU-001",
            "price": 49.99,
            "stockQuantity": 150,
            "product": {
              "id": "330e8400-e29b-41d4-a716-446655440014",
              "name": "Cotton T-Shirt",
              "slug": "cotton-t-shirt",
              "status": "ACTIVE",
              "images": [
                {
                  "imageUrl": "https://cdn.example.com/tshirt.jpg",
                  "isFeatured": true
                }
              ]
            },
            "attributes": [
              {
                "attributeValue": {
                  "value": "Blue",
                  "attribute": { "name": "Color" }
                }
              },
              {
                "attributeValue": {
                  "value": "M",
                  "attribute": { "name": "Size" }
                }
              }
            ]
          },
          "itemSubtotal": 49.99
        }
      ],
      "summary": {
        "itemCount": 3,
        "subtotal": 249.97,
        "estimatedTax": 24.99,
        "estimatedShipping": 15.00,
        "estimatedTotal": 289.96
      }
    }
  }
}
```

---

### 2.2 Add Item to Cart
**POST** `/cart/item`

**Access:** CUSTOMER (authenticated)

**Request Body:**
```json
{
  "variantId": "660e8400-e29b-41d4-a716-446655440001",
  "quantity": 2
}
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    "cartItem": {
      "id": "110e8400-e29b-41d4-a716-446655440012",
      "cartId": "ff0e8400-e29b-41d4-a716-446655440011",
      "variantId": "660e8400-e29b-41d4-a716-446655440001",
      "quantity": 2,
      "createdAt": "2026-01-25T10:45:00.000Z"
    },
    "cart": {
      "itemCount": 3,
      "subtotal": 249.97
    }
  }
}
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "success": false,
  "message": "Insufficient stock",
  "data": {
    "requested": 10,
    "available": 5
  }
}
```

---

### 2.3 Update Cart Item
**PATCH** `/cart/item/:itemId`

**Access:** CUSTOMER (authenticated)

**Request Body:**
```json
{
  "quantity": 3
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Cart item updated successfully",
  "data": {
    "cartItem": {
      "id": "110e8400-e29b-41d4-a716-446655440012",
      "quantity": 3,
      "itemSubtotal": 299.97
    },
    "cart": {
      "itemCount": 4,
      "subtotal": 349.96
    }
  }
}
```

---

### 2.4 Remove Cart Item
**DELETE** `/cart/item/:itemId`

**Access:** CUSTOMER (authenticated)

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Item removed from cart successfully",
  "data": {
    "cart": {
      "itemCount": 1,
      "subtotal": 49.99
    }
  }
}
```

---

### 2.5 Clear Cart
**DELETE** `/cart/clear`

**Access:** CUSTOMER (authenticated)

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Cart cleared successfully",
  "data": {
    "cart": {
      "id": "ff0e8400-e29b-41d4-a716-446655440011",
      "itemCount": 0,
      "items": []
    }
  }
}
```

---

### 2.6 Checkout Preview
**POST** `/cart/checkout`

**Access:** CUSTOMER (authenticated)

**Request Body:**
```json
{
  "addressId": "550e8400-e29b-41d4-a716-446655440000",
  "shippingMethod": "express",
  "couponCode": "SAVE10"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Checkout summary calculated successfully",
  "data": {
    "checkout": {
      "items": [
        {
          "variantId": "660e8400-e29b-41d4-a716-446655440001",
          "productName": "Premium Wireless Headphones",
          "quantity": 2,
          "unitPrice": 99.99,
          "subtotal": 199.98,
          "inStock": true
        }
      ],
      "subtotal": 249.97,
      "taxAmount": 24.99,
      "shippingCost": 25.00,
      "discount": 24.99,
      "discountSource": "Coupon: SAVE10 (10% off)",
      "total": 274.97,
      "currency": "USD",
      "estimatedDelivery": "2026-01-27T23:59:59.000Z"
    }
  }
}
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "success": false,
  "message": "Some items are out of stock",
  "errors": [
    {
      "variantId": "660e8400-e29b-41d4-a716-446655440001",
      "productName": "Premium Wireless Headphones",
      "requested": 2,
      "available": 0
    }
  ]
}
```

---

## 3. WISHLIST

### 3.1 Get Wishlist
**GET** `/wishlist`

**Access:** Authenticated users

**Query Parameters:**
```
page=1
limit=20
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Wishlist retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 12
  },
  "data": {
    "wishlist": [
      {
        "id": "440e8400-e29b-41d4-a716-446655440015",
        "userId": "550e8400-e29b-41d4-a716-446655440016",
        "productId": "bb0e8400-e29b-41d4-a716-446655440007",
        "createdAt": "2026-01-20T14:30:00.000Z",
        "product": {
          "id": "bb0e8400-e29b-41d4-a716-446655440007",
          "name": "Premium Wireless Headphones",
          "slug": "premium-wireless-headphones",
          "shortDescription": "Experience superior sound quality",
          "status": "ACTIVE",
          "avgRating": 4.5,
          "reviewCount": 234,
          "images": [
            {
              "imageUrl": "https://cdn.example.com/headphones.jpg",
              "isFeatured": true
            }
          ],
          "variants": [
            {
              "id": "660e8400-e29b-41d4-a716-446655440001",
              "sku": "PWH-BLK-001",
              "price": 99.99,
              "stockQuantity": 50,
              "isDefault": true
            }
          ]
        }
      }
    ]
  }
}
```

---

### 3.2 Add to Wishlist
**POST** `/wishlist`

**Access:** Authenticated users

**Request Body:**
```json
{
  "productId": "bb0e8400-e29b-41d4-a716-446655440007"
}
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Product added to wishlist successfully",
  "data": {
    "wishlist": {
      "id": "440e8400-e29b-41d4-a716-446655440015",
      "userId": "550e8400-e29b-41d4-a716-446655440016",
      "productId": "bb0e8400-e29b-41d4-a716-446655440007",
      "createdAt": "2026-01-25T11:20:00.000Z"
    }
  }
}
```

**Error Response (409):**
```json
{
  "statusCode": 409,
  "success": false,
  "message": "Product already in wishlist"
}
```

---

### 3.3 Remove from Wishlist
**DELETE** `/wishlist/:id`

**Access:** Authenticated users

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Product removed from wishlist successfully"
}
```

---

### 3.4 Move Wishlist Item to Cart
**POST** `/wishlist/:id/move-to-cart`

**Access:** CUSTOMER (authenticated)

**Request Body:**
```json
{
  "variantId": "660e8400-e29b-41d4-a716-446655440001",
  "quantity": 1
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Item moved to cart successfully",
  "data": {
    "cartItem": {
      "id": "110e8400-e29b-41d4-a716-446655440012",
      "quantity": 1
    },
    "cart": {
      "itemCount": 2,
      "subtotal": 149.98
    }
  }
}
```

---

## 4. PAYMENTS

### 4.1 Initialize Payment
**POST** `/payment/init`

**Access:** CUSTOMER (own orders)

**Request Body:**
```json
{
  "orderId": "770e8400-e29b-41d4-a716-446655440003",
  "successUrl": "https://mystore.com/payment/success",
  "failUrl": "https://mystore.com/payment/fail",
  "cancelUrl": "https://mystore.com/payment/cancel"
}
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Payment initialized successfully",
  "data": {
    "payment": {
      "id": "cc0e8400-e29b-41d4-a716-446655440008",
      "orderId": "770e8400-e29b-41d4-a716-446655440003",
      "paymentMethod": "CREDIT_CARD",
      "provider": "sslcommerz",
      "amount": 314.97,
      "currency": "USD",
      "status": "PENDING",
      "createdAt": "2026-01-25T10:31:00.000Z"
    },
    "redirectUrl": "https://sandbox.sslcommerz.com/gwprocess/v4/gw.php?Q=REDIRECT&SESSIONKEY=ABC123XYZ456"
  }
}
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "success": false,
  "message": "Order payment already completed"
}
```

---

### 4.2 Payment Success Callback
**POST** `/payment/success`

**Access:** PUBLIC (SSLCommerz callback)

**Request Body (from SSLCommerz):**
```json
{
  "tran_id": "cc0e8400-e29b-41d4-a716-446655440008",
  "val_id": "2101251131590lWlBwiS8Qt1oI",
  "amount": "314.97",
  "card_type": "VISA-Dutch Bangla",
  "store_amount": "307.62",
  "card_no": "432149XXXXXX0667",
  "bank_tran_id": "210125113159uXWO8RW4331",
  "status": "VALID",
  "tran_date": "2026-01-25 11:31:00",
  "currency": "USD",
  "card_issuer": "STANDARD CHARTERED BANK",
  "card_brand": "VISA",
  "card_issuer_country": "Bangladesh",
  "card_issuer_country_code": "BD",
  "verify_sign": "e5c0e38fafac45c89f81b7b90f",
  "verify_key": "amount,bank_tran_id,base_fair,card_brand,card_issuer,card_issuer_country,card_issuer_country_code,card_no,card_type,currency,currency_amount,currency_rate,currency_type,risk_level,risk_title,status,store_amount,store_id,tran_date,tran_id,val_id,value_a,value_b,value_c,value_d"
}
```

**Success Response (302 Redirect):**
```
Redirects to: https://mystore.com/order/770e8400-e29b-41d4-a716-446655440003/success
```

**Internal Processing:**
- Validates transaction with SSLCommerz
- Updates Payment status to PAID
- Updates Order paymentStatus to PAID
- Updates Order status to CONFIRMED
- Creates AuditLog entry
- Creates Notification for customer
- Sends order confirmation email

---

### 4.3 Payment Fail Callback
**POST** `/payment/fail`

**Access:** PUBLIC (SSLCommerz callback)

**Request Body:**
```json
{
  "tran_id": "cc0e8400-e29b-41d4-a716-446655440008",
  "status": "FAILED",
  "error": "Insufficient balance in card"
}
```

**Success Response (302 Redirect):**
```
Redirects to: https://mystore.com/order/770e8400-e29b-41d4-a716-446655440003/failed
```

---

### 4.4 Payment Cancel Callback
**POST** `/payment/cancel`

**Access:** PUBLIC (SSLCommerz callback)

**Request Body:**
```json
{
  "tran_id": "cc0e8400-e29b-41d4-a716-446655440008",
  "status": "CANCELLED"
}
```

**Success Response (302 Redirect):**
```
Redirects to: https://mystore.com/cart
```

---

### 4.5 Payment IPN (Instant Payment Notification)
**POST** `/payment/ipn`

**Access:** PUBLIC (SSLCommerz IPN)

**Request Body:**
```json
{
  "tran_id": "cc0e8400-e29b-41d4-a716-446655440008",
  "val_id": "2101251131590lWlBwiS8Qt1oI",
  "status": "VALID"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "IPN processed successfully"
}
```

---

### 4.6 Get Order Payments
**GET** `/payment/order/:orderId`

**Access:** CUSTOMER (own orders), ADMIN, STAFF

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Order payments retrieved successfully",
  "data": {
    "payments": [
      {
        "id": "cc0e8400-e29b-41d4-a716-446655440008",
        "orderId": "770e8400-e29b-41d4-a716-446655440003",
        "paymentMethod": "CREDIT_CARD",
        "provider": "sslcommerz",
        "providerTransactionId": "SSL123456789",
        "amount": 314.97,
        "currency": "USD",
        "status": "PAID",
        "createdAt": "2026-01-25T10:31:00.000Z",
        "updatedAt": "2026-01-25T11:31:30.000Z"
      }
    ]
  }
}
```

---

### 4.7 Process Refund
**POST** `/payment/refund`

**Access:** ADMIN, SUPER_ADMIN

**Request Body:**
```json
{
  "paymentId": "cc0e8400-e29b-41d4-a716-446655440008",
  "amount": 314.97,
  "reason": "Customer requested return - approved"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Refund processed successfully",
  "data": {
    "refund": {
      "id": "660e8400-e29b-41d4-a716-446655440017",
      "orderId": "770e8400-e29b-41d4-a716-446655440003",
      "paymentMethod": "CREDIT_CARD",
      "provider": "sslcommerz",
      "amount": -314.97,
      "status": "REFUNDED",
      "createdAt": "2026-01-28T16:45:00.000Z"
    },
    "order": {
      "paymentStatus": "REFUNDED"
    }
  }
}
```

---

## 5. SHIPMENTS

### 5.1 Create Shipment
**POST** `/shipment`

**Access:** STAFF, ADMIN

**Request Body:**
```json
{
  "orderId": "770e8400-e29b-41d4-a716-446655440003",
  "carrier": "UPS",
  "shippingMethod": "standard",
  "trackingNumber": "1Z999AA10123456784",
  "estimatedDelivery": "2026-01-28T23:59:59.000Z",
  "cost": 15.00
}
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Shipment created successfully",
  "data": {
    "shipment": {
      "id": "dd0e8400-e29b-41d4-a716-446655440009",
      "orderId": "770e8400-e29b-41d4-a716-446655440003",
      "carrier": "UPS",
      "trackingNumber": "1Z999AA10123456784",
      "shippingMethod": "standard",
      "status": "PENDING",
      "estimatedDelivery": "2026-01-28T23:59:59.000Z",
      "cost": 15.00,
      "createdAt": "2026-01-26T08:30:00.000Z"
    },
    "order": {
      "status": "SHIPPED",
      "trackingNumber": "1Z999AA10123456784"
    }
  }
}
```

---

### 5.2 Update Shipment
**PATCH** `/shipment/:id`

**Access:** STAFF, ADMIN

**Request Body:**
```json
{
  "status": "DELIVERED",
  "deliveredAt": "2026-01-28T14:20:00.000Z"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Shipment updated successfully",
  "data": {
    "shipment": {
      "id": "dd0e8400-e29b-41d4-a716-446655440009",
      "status": "DELIVERED",
      "deliveredAt": "2026-01-28T14:20:00.000Z",
      "updatedAt": "2026-01-28T14:20:00.000Z"
    },
    "order": {
      "status": "DELIVERED",
      "deliveredAt": "2026-01-28T14:20:00.000Z"
    }
  }
}
```

---

### 5.3 Get Order Shipments
**GET** `/shipment/order/:orderId`

**Access:** CUSTOMER (own orders), STAFF, ADMIN

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Order shipments retrieved successfully",
  "data": {
    "shipments": [
      {
        "id": "dd0e8400-e29b-41d4-a716-446655440009",
        "orderId": "770e8400-e29b-41d4-a716-446655440003",
        "carrier": "UPS",
        "trackingNumber": "1Z999AA10123456784",
        "shippingMethod": "standard",
        "status": "DELIVERED",
        "shippedAt": "2026-01-26T09:15:00.000Z",
        "estimatedDelivery": "2026-01-28T23:59:59.000Z",
        "deliveredAt": "2026-01-28T14:20:00.000Z",
        "cost": 15.00
      }
    ]
  }
}
```

---

### 5.4 Track Shipment
**GET** `/shipment/:id/track`

**Access:** CUSTOMER (own orders), STAFF, ADMIN

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Shipment tracking retrieved successfully",
  "data": {
    "shipment": {
      "id": "dd0e8400-e29b-41d4-a716-446655440009",
      "carrier": "UPS",
      "trackingNumber": "1Z999AA10123456784",
      "status": "IN_TRANSIT",
      "shippedAt": "2026-01-26T09:15:00.000Z",
      "estimatedDelivery": "2026-01-28T23:59:59.000Z",
      "trackingUrl": "https://www.ups.com/track?tracknum=1Z999AA10123456784"
    },
    "order": {
      "orderNumber": "ORD-1737820800-A1B2C3",
      "status": "SHIPPED"
    }
  }
}
```

---

## 6. RETURNS

### 6.1 Request Return
**POST** `/return/request`

**Access:** CUSTOMER (own orders)

**Request Body:**
```json
{
  "orderId": "770e8400-e29b-41d4-a716-446655440003",
  "reason": "Product not as described",
  "items": [
    {
      "orderItemId": "aa0e8400-e29b-41d4-a716-446655440006",
      "quantity": 2,
      "reason": "Color different from picture",
      "condition": "NEW"
    }
  ]
}
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Return request created successfully",
  "data": {
    "return": {
      "id": "770e8400-e29b-41d4-a716-446655440018",
      "orderId": "770e8400-e29b-41d4-a716-446655440003",
      "returnNumber": "RET-1737900000-X9Y8Z7",
      "status": "PENDING",
      "reason": "Product not as described",
      "refundAmount": 199.98,
      "restockingFee": 0,
      "createdAt": "2026-01-30T10:15:00.000Z",
      "items": [
        {
          "id": "880e8400-e29b-41d4-a716-446655440019",
          "orderItemId": "aa0e8400-e29b-41d4-a716-446655440006",
          "quantity": 2,
          "reason": "Color different from picture",
          "condition": "NEW"
        }
      ]
    }
  }
}
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "success": false,
  "message": "Return window expired. Returns accepted within 30 days of delivery.",
  "data": {
    "deliveredAt": "2025-12-15T14:20:00.000Z",
    "returnDeadline": "2026-01-14T23:59:59.000Z",
    "daysElapsed": 45
  }
}
```

---

### 6.2 Get All Returns (Admin)
**GET** `/return`

**Access:** ADMIN, STAFF

**Query Parameters:**
```
page=1
limit=10
status=PENDING
orderId=770e8400-e29b-41d4-a716-446655440003
customerId=990e8400-e29b-41d4-a716-446655440005
dateFrom=2026-01-01
dateTo=2026-01-31
sortBy=createdAt
sortOrder=desc
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Returns retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45
  },
  "data": {
    "returns": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440018",
        "returnNumber": "RET-1737900000-X9Y8Z7",
        "status": "PENDING",
        "reason": "Product not as described",
        "refundAmount": 199.98,
        "createdAt": "2026-01-30T10:15:00.000Z",
        "order": {
          "orderNumber": "ORD-1737820800-A1B2C3",
          "customer": {
            "user": {
              "name": "John Doe",
              "email": "john.doe@example.com"
            }
          }
        },
        "items": [
          {
            "quantity": 2,
            "condition": "NEW"
          }
        ]
      }
    ]
  }
}
```

---

### 6.3 Get My Returns (Customer)
**GET** `/return/my-returns`

**Access:** CUSTOMER

**Query Parameters:**
```
page=1
limit=10
status=APPROVED
dateFrom=2026-01-01
dateTo=2026-01-31
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Your returns retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 3
  },
  "data": {
    "returns": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440018",
        "returnNumber": "RET-1737900000-X9Y8Z7",
        "status": "APPROVED",
        "reason": "Product not as described",
        "refundAmount": 199.98,
        "restockingFee": 0,
        "approvedAt": "2026-01-31T09:30:00.000Z",
        "createdAt": "2026-01-30T10:15:00.000Z",
        "order": {
          "orderNumber": "ORD-1737820800-A1B2C3"
        }
      }
    ]
  }
}
```

---

### 6.4 Get Return Details
**GET** `/return/:id`

**Access:** CUSTOMER (own returns), ADMIN, STAFF

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Return details retrieved successfully",
  "data": {
    "return": {
      "id": "770e8400-e29b-41d4-a716-446655440018",
      "orderId": "770e8400-e29b-41d4-a716-446655440003",
      "returnNumber": "RET-1737900000-X9Y8Z7",
      "status": "APPROVED",
      "reason": "Product not as described",
      "refundAmount": 199.98,
      "restockingFee": 0,
      "approvedAt": "2026-01-31T09:30:00.000Z",
      "notes": "Return approved - customer satisfaction priority",
      "createdAt": "2026-01-30T10:15:00.000Z",
      "order": {
        "id": "770e8400-e29b-41d4-a716-446655440003",
        "orderNumber": "ORD-1737820800-A1B2C3",
        "deliveredAt": "2026-01-28T14:20:00.000Z"
      },
      "items": [
        {
          "id": "880e8400-e29b-41d4-a716-446655440019",
          "orderItemId": "aa0e8400-e29b-41d4-a716-446655440006",
          "quantity": 2,
          "reason": "Color different from picture",
          "condition": "NEW",
          "orderItem": {
            "unitPrice": 99.99,
            "product": {
              "name": "Premium Wireless Headphones"
            },
            "variant": {
              "sku": "PWH-BLK-001"
            }
          }
        }
      ]
    }
  }
}
```

---

### 6.5 Approve/Reject Return
**PATCH** `/return/:id/approve`

**Access:** ADMIN, SUPER_ADMIN

**Request Body (Approve):**
```json
{
  "action": "approve",
  "refundAmount": 199.98,
  "restockingFee": 0,
  "notes": "Return approved - customer satisfaction priority"
}
```

**Request Body (Reject):**
```json
{
  "action": "reject",
  "notes": "Return period expired"
}
```

**Success Response (200) - Approved:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Return approved successfully",
  "data": {
    "return": {
      "id": "770e8400-e29b-41d4-a716-446655440018",
      "returnNumber": "RET-1737900000-X9Y8Z7",
      "status": "APPROVED",
      "refundAmount": 199.98,
      "restockingFee": 0,
      "approvedAt": "2026-01-31T09:30:00.000Z",
      "notes": "Return approved - customer satisfaction priority"
    }
  }
}
```

**Success Response (200) - Rejected:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Return rejected",
  "data": {
    "return": {
      "id": "770e8400-e29b-41d4-a716-446655440018",
      "returnNumber": "RET-1737900000-X9Y8Z7",
      "status": "REJECTED",
      "notes": "Return period expired"
    }
  }
}
```

---

### 6.6 Process Return
**PATCH** `/return/:id/process`

**Access:** ADMIN, STAFF

**Request Body (Restock Inventory):**
```json
{
  "action": "restock"
}
```

**Request Body (Complete Return with Refund):**
```json
{
  "action": "complete"
}
```

**Success Response (200) - Restock:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Inventory restocked successfully",
  "data": {
    "return": {
      "id": "770e8400-e29b-41d4-a716-446655440018",
      "status": "PROCESSING"
    },
    "inventoryLogs": [
      {
        "variantId": "660e8400-e29b-41d4-a716-446655440001",
        "change": 2,
        "reason": "RETURN",
        "newStockQuantity": 52
      }
    ]
  }
}
```

**Success Response (200) - Complete:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Return processed and refund issued successfully",
  "data": {
    "return": {
      "id": "770e8400-e29b-41d4-a716-446655440018",
      "returnNumber": "RET-1737900000-X9Y8Z7",
      "status": "COMPLETED",
      "processedAt": "2026-01-31T15:45:00.000Z",
      "refundedAt": "2026-01-31T15:45:00.000Z"
    },
    "refund": {
      "id": "990e8400-e29b-41d4-a716-446655440020",
      "amount": -199.98,
      "status": "REFUNDED",
      "provider": "sslcommerz"
    },
    "order": {
      "paymentStatus": "REFUNDED"
    }
  }
}
```

---

### 6.7 Cancel Return
**POST** `/return/:id/cancel`

**Access:** CUSTOMER (own returns, PENDING only), ADMIN

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Return cancelled successfully",
  "data": {
    "return": {
      "id": "770e8400-e29b-41d4-a716-446655440018",
      "returnNumber": "RET-1737900000-X9Y8Z7",
      "status": "CANCELLED",
      "notes": "Cancelled by customer: Changed my mind"
    }
  }
}
```

---

## 7. REVIEWS

### 7.1 Create Review
**POST** `/review`

**Access:** CUSTOMER

**Request Body:**
```json
{
  "productId": "bb0e8400-e29b-41d4-a716-446655440007",
  "orderId": "770e8400-e29b-41d4-a716-446655440003",
  "rating": 5,
  "comment": "Excellent product! Sound quality is amazing and battery life is great."
}
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Review submitted successfully. It will be visible after admin approval.",
  "data": {
    "review": {
      "id": "aa0e8400-e29b-41d4-a716-446655440021",
      "productId": "bb0e8400-e29b-41d4-a716-446655440007",
      "customerId": "990e8400-e29b-41d4-a716-446655440005",
      "rating": 5,
      "comment": "Excellent product! Sound quality is amazing and battery life is great.",
      "isApproved": false,
      "createdAt": "2026-02-01T12:30:00.000Z"
    }
  }
}
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "success": false,
  "message": "You can only review products you have purchased and received"
}
```

---

### 7.2 Get Product Reviews
**GET** `/review/product/:productId`

**Access:** PUBLIC

**Query Parameters:**
```
page=1
limit=10
sortBy=createdAt
sortOrder=desc
minRating=4
maxRating=5
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Product reviews retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 234
  },
  "data": {
    "summary": {
      "avgRating": 4.5,
      "totalReviews": 234,
      "ratingDistribution": {
        "5": 156,
        "4": 52,
        "3": 18,
        "2": 5,
        "1": 3
      }
    },
    "reviews": [
      {
        "id": "aa0e8400-e29b-41d4-a716-446655440021",
        "rating": 5,
        "comment": "Excellent product! Sound quality is amazing and battery life is great.",
        "isApproved": true,
        "createdAt": "2026-02-01T12:30:00.000Z",
        "customer": {
          "user": {
            "name": "John D.",
            "profilePicture": "https://cdn.example.com/profiles/john.jpg"
          }
        }
      }
    ]
  }
}
```

---

### 7.3 Get My Reviews
**GET** `/review/my-reviews`

**Access:** CUSTOMER

**Query Parameters:**
```
page=1
limit=10
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Your reviews retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 12
  },
  "data": {
    "reviews": [
      {
        "id": "aa0e8400-e29b-41d4-a716-446655440021",
        "rating": 5,
        "comment": "Excellent product! Sound quality is amazing and battery life is great.",
        "isApproved": true,
        "createdAt": "2026-02-01T12:30:00.000Z",
        "product": {
          "id": "bb0e8400-e29b-41d4-a716-446655440007",
          "name": "Premium Wireless Headphones",
          "images": [
            {
              "imageUrl": "https://cdn.example.com/headphones.jpg"
            }
          ]
        }
      }
    ]
  }
}
```

---

### 7.4 Get Pending Reviews
**GET** `/review/pending`

**Access:** ADMIN, STAFF

**Query Parameters:**
```
page=1
limit=20
productId=bb0e8400-e29b-41d4-a716-446655440007
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Pending reviews retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 15
  },
  "data": {
    "reviews": [
      {
        "id": "bb0e8400-e29b-41d4-a716-446655440022",
        "rating": 4,
        "comment": "Good product but delivery was slow",
        "isApproved": false,
        "createdAt": "2026-02-02T08:15:00.000Z",
        "customer": {
          "user": {
            "name": "Jane Smith",
            "email": "jane.smith@example.com"
          }
        },
        "product": {
          "name": "Premium Wireless Headphones"
        }
      }
    ]
  }
}
```

---

### 7.5 Approve Review
**PATCH** `/review/:id/approve`

**Access:** ADMIN, SUPER_ADMIN

**Request Body:**
```json
{
  "isApproved": true
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Review approved successfully",
  "data": {
    "review": {
      "id": "bb0e8400-e29b-41d4-a716-446655440022",
      "isApproved": true
    },
    "product": {
      "avgRating": 4.52,
      "reviewCount": 235
    }
  }
}
```

---

### 7.6 Delete Review
**DELETE** `/review/:id`

**Access:** CUSTOMER (own), ADMIN

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Review deleted successfully"
}
```

---

## 8. INVENTORY

### 8.1 Get Low Stock Alerts
**GET** `/inventory/low-stock`

**Access:** STAFF, ADMIN

**Query Parameters:**
```
tenantId=880e8400-e29b-41d4-a716-446655440004
threshold=10
page=1
limit=20
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Low stock items retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 8
  },
  "data": {
    "variants": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "sku": "PWH-BLK-001",
        "stockQuantity": 3,
        "stockAlertThreshold": 5,
        "price": 99.99,
        "product": {
          "id": "bb0e8400-e29b-41d4-a716-446655440007",
          "name": "Premium Wireless Headphones",
          "status": "ACTIVE"
        }
      }
    ]
  }
}
```

---

### 8.2 Get Out of Stock Products
**GET** `/inventory/out-of-stock`

**Access:** STAFF, ADMIN

**Query Parameters:**
```
tenantId=880e8400-e29b-41d4-a716-446655440004
page=1
limit=20
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Out of stock items retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 12
  },
  "data": {
    "variants": [
      {
        "id": "cc0e8400-e29b-41d4-a716-446655440023",
        "sku": "SWT-L-RED-001",
        "stockQuantity": 0,
        "price": 49.99,
        "product": {
          "id": "330e8400-e29b-41d4-a716-446655440014",
          "name": "Cotton T-Shirt",
          "status": "OUT_OF_STOCK"
        }
      }
    ]
  }
}
```

---

### 8.3 Get Inventory Logs
**GET** `/inventory/logs`

**Access:** ADMIN, STAFF

**Query Parameters:**
```
page=1
limit=50
variantId=660e8400-e29b-41d4-a716-446655440001
reason=SALE
dateFrom=2026-01-01
dateTo=2026-01-31
sortBy=createdAt
sortOrder=desc
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Inventory logs retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 342
  },
  "data": {
    "logs": [
      {
        "id": "dd0e8400-e29b-41d4-a716-446655440024",
        "variantId": "660e8400-e29b-41d4-a716-446655440001",
        "change": -2,
        "reason": "SALE",
        "referenceId": "770e8400-e29b-41d4-a716-446655440003",
        "note": "Order: ORD-1737820800-A1B2C3",
        "createdAt": "2026-01-25T10:30:15.000Z",
        "variant": {
          "sku": "PWH-BLK-001",
          "stockQuantity": 48,
          "product": {
            "name": "Premium Wireless Headphones"
          }
        }
      },
      {
        "id": "ee0e8400-e29b-41d4-a716-446655440025",
        "variantId": "660e8400-e29b-41d4-a716-446655440001",
        "change": 2,
        "reason": "RETURN",
        "referenceId": "770e8400-e29b-41d4-a716-446655440018",
        "note": "Return: RET-1737900000-X9Y8Z7",
        "createdAt": "2026-01-31T15:45:20.000Z",
        "variant": {
          "sku": "PWH-BLK-001",
          "stockQuantity": 50,
          "product": {
            "name": "Premium Wireless Headphones"
          }
        }
      }
    ]
  }
}
```

---

### 8.4 Manual Inventory Adjustment
**POST** `/inventory/adjust`

**Access:** ADMIN, STAFF

**Request Body:**
```json
{
  "variantId": "660e8400-e29b-41d4-a716-446655440001",
  "change": -5,
  "reason": "DAMAGE",
  "note": "Water damage during warehouse flooding"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Inventory adjusted successfully",
  "data": {
    "variant": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "sku": "PWH-BLK-001",
      "stockQuantity": 45,
      "previousStock": 50
    },
    "inventoryLog": {
      "id": "ff0e8400-e29b-41d4-a716-446655440026",
      "change": -5,
      "reason": "DAMAGE",
      "note": "Water damage during warehouse flooding",
      "createdAt": "2026-02-03T14:20:00.000Z"
    }
  }
}
```

---

### 8.5 Get Inventory Valuation
**GET** `/inventory/value`

**Access:** ADMIN, SUPER_ADMIN

**Query Parameters:**
```
tenantId=880e8400-e29b-41d4-a716-446655440004
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Inventory valuation retrieved successfully",
  "data": {
    "summary": {
      "totalValue": 456789.50,
      "totalUnits": 12456,
      "averageCostPerUnit": 36.67
    },
    "byCategory": [
      {
        "categoryId": "110e8400-e29b-41d4-a716-446655440027",
        "categoryName": "Electronics",
        "totalValue": 234567.80,
        "totalUnits": 3456
      },
      {
        "categoryId": "220e8400-e29b-41d4-a716-446655440028",
        "categoryName": "Clothing",
        "totalValue": 123456.70,
        "totalUnits": 6789
      }
    ],
    "byBrand": [
      {
        "brandId": "330e8400-e29b-41d4-a716-446655440029",
        "brandName": "Premium Audio",
        "totalValue": 89012.30,
        "totalUnits": 890
      }
    ]
  }
}
```

---

## 9. ANALYTICS

### 9.1 Get Revenue Analytics
**GET** `/order/revenue`

**Access:** ADMIN, SUPER_ADMIN

**Query Parameters:**
```
dateFrom=2026-01-01
dateTo=2026-01-31
tenantId=880e8400-e29b-41d4-a716-446655440004
groupBy=day
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Revenue analytics retrieved successfully",
  "data": {
    "summary": {
      "grossRevenue": 124780.50,
      "refunds": 3456.78,
      "netRevenue": 121323.72,
      "taxCollected": 12478.05,
      "shippingRevenue": 3567.89
    },
    "byPeriod": [
      {
        "period": "2026-01-25",
        "orders": 52,
        "grossRevenue": 5240.78,
        "refunds": 120.50,
        "netRevenue": 5120.28,
        "taxCollected": 524.07,
        "shippingRevenue": 156.00
      }
    ]
  }
}
```

---

### 9.2 Get Best Sellers
**GET** `/product/bestsellers`

**Access:** ADMIN, STAFF

**Query Parameters:**
```
dateFrom=2026-01-01
dateTo=2026-01-31
tenantId=880e8400-e29b-41d4-a716-446655440004
limit=10
categoryId=110e8400-e29b-41d4-a716-446655440027
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Best sellers retrieved successfully",
  "data": {
    "products": [
      {
        "productId": "bb0e8400-e29b-41d4-a716-446655440007",
        "productName": "Premium Wireless Headphones",
        "totalQuantitySold": 234,
        "totalRevenue": 23456.78,
        "averagePrice": 100.24,
        "orderCount": 189
      },
      {
        "productId": "330e8400-e29b-41d4-a716-446655440014",
        "productName": "Cotton T-Shirt",
        "totalQuantitySold": 567,
        "totalRevenue": 28349.33,
        "averagePrice": 50.00,
        "orderCount": 456
      }
    ]
  }
}
```

---

### 9.3 Get Low Rated Products
**GET** `/product/low-rated`

**Access:** ADMIN

**Query Parameters:**
```
maxRating=3
minReviews=5
tenantId=880e8400-e29b-41d4-a716-446655440004
page=1
limit=20
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Low rated products retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 8
  },
  "data": {
    "products": [
      {
        "id": "440e8400-e29b-41d4-a716-446655440030",
        "name": "Budget Earphones",
        "avgRating": 2.3,
        "reviewCount": 23,
        "status": "ACTIVE",
        "totalSales": 45
      }
    ]
  }
}
```

---

### 9.4 Get Customer Statistics
**GET** `/customer/stats`

**Access:** ADMIN, SUPER_ADMIN

**Query Parameters:**
```
tenantId=880e8400-e29b-41d4-a716-446655440004
dateFrom=2026-01-01
dateTo=2026-01-31
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Customer statistics retrieved successfully",
  "data": {
    "summary": {
      "totalCustomers": 3456,
      "newCustomers": 234,
      "activeCustomers": 1234,
      "customersByType": {
        "REGULAR": 2890,
        "PREMIUM": 345,
        "VIP": 156,
        "BUSINESS": 45,
        "WHOLESALE": 20
      }
    },
    "acquisition": [
      {
        "period": "2026-01-25",
        "newCustomers": 12,
        "totalOrders": 28,
        "totalRevenue": 2890.45
      }
    ],
    "lifetimeValue": {
      "average": 456.78,
      "median": 234.50,
      "top10Percent": 2345.67
    },
    "spendingBrackets": {
      "0-100": 1234,
      "100-500": 1567,
      "500-1000": 456,
      "1000+": 199
    }
  }
}
```

---

### 9.5 Get Top Spenders
**GET** `/customer/top-spenders`

**Access:** ADMIN, SUPER_ADMIN

**Query Parameters:**
```
limit=20
dateFrom=2026-01-01
dateTo=2026-01-31
tenantId=880e8400-e29b-41d4-a716-446655440004
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Top spenders retrieved successfully",
  "data": {
    "customers": [
      {
        "customerId": "990e8400-e29b-41d4-a716-446655440005",
        "customerName": "John Doe",
        "customerEmail": "john.doe@example.com",
        "customerType": "VIP",
        "totalSpent": 12456.78,
        "orderCount": 45,
        "averageOrderValue": 276.82,
        "lastPurchaseAt": "2026-01-25T10:30:00.000Z"
      }
    ]
  }
}
```

---

## Common Error Responses

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "success": false,
  "message": "Invalid or expired authentication token"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "success": false,
  "message": "Insufficient permissions to access this resource"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "success": false,
  "message": "Resource not found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "success": false,
  "message": "Resource already exists or conflict with current state"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "success": false,
  "message": "An unexpected error occurred. Please try again later."
}
```

---

## Testing with Postman

### Pre-request Script for Authentication
```javascript
// Set auth token from environment
pm.request.headers.add({
    key: 'Authorization',
    value: 'Bearer ' + pm.environment.get('authToken')
});
```

### Test Script for Storing Response Data
```javascript
// Store order ID from response
if (pm.response.code === 201 || pm.response.code === 200) {
    const jsonData = pm.response.json();
    if (jsonData.data && jsonData.data.order) {
        pm.environment.set('orderId', jsonData.data.order.id);
    }
}
```

### Test Script for Validation
```javascript
// Validate response structure
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success field", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData.success).to.be.true;
});

pm.test("Response has data", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('data');
});
```

---

## Notes

1. **Authentication**: All endpoints except SSLCommerz callbacks and public review listings require authentication via JWT token in the `Authorization` header.

2. **Tenant Isolation**: For multi-tenant endpoints, the tenant is automatically determined from the authenticated user's context. Super admins can query across tenants.

3. **Pagination**: Default pagination is `page=1` and `limit=10`. Maximum limit is 100.

4. **Date Formats**: All dates are in ISO 8601 format (e.g., `2026-01-25T10:30:00.000Z`).

5. **Currency**: All monetary values are in decimal format. Currency is specified per order (default: USD).

6. **UUIDs**: All IDs are UUID v4 format.

7. **SSLCommerz**: Use sandbox credentials for testing. Production credentials required for live deployment.

8. **Rate Limiting**: Consider implementing rate limiting on public endpoints and payment callbacks.

9. **Webhooks**: SSLCommerz webhooks must be accessible via public HTTPS URLs in production.

10. **Email Notifications**: Ensure SMTP configuration is set up for email notifications to work.
