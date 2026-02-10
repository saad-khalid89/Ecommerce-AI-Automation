"""
Simplified Shopify Routes for Next.js Integration
No database dependencies - direct Shopify API proxy
"""
import logging
from typing import Optional, List, Dict, Any
from datetime import datetime

from fastapi import APIRouter, HTTPException, Header, Query
from pydantic import BaseModel, Field

# Add parent directory to path to import ShopifyAdminClient
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from integrations.shopify.client import (
    ShopifyAdminClient,
    ShopifyAPIError,
    ShopifyAuthError,
    ShopifyNotFoundError
)

logger = logging.getLogger(__name__)


# =============================================================================
# Request/Response Models
# =============================================================================

class ShopifyCredentials(BaseModel):
    shop_domain: str = Field(..., description="Shopify store domain (e.g., store.myshopify.com)")
    access_token: str = Field(..., description="Shopify Admin API access token")


class ShopInfo(BaseModel):
    id: int
    name: str
    email: str
    domain: str
    currency: str
    timezone: str
    plan_name: str


class ProductResponse(BaseModel):
    id: int
    title: str
    handle: str
    vendor: str
    product_type: str
    status: str
    price: Optional[str]
    sku: Optional[str]
    image_url: Optional[str]
    inventory_quantity: Optional[int]


class OrderResponse(BaseModel):
    id: int
    name: str
    email: Optional[str]
    total_price: str
    currency: str
    financial_status: str
    fulfillment_status: Optional[str]
    customer_name: Optional[str]
    customer_phone: Optional[str]
    created_at: str
    line_items_count: int


class CustomerResponse(BaseModel):
    id: int
    email: Optional[str]
    first_name: Optional[str]
    last_name: Optional[str]
    phone: Optional[str]
    orders_count: int
    total_spent: str
    created_at: str


# =============================================================================
# Helper Functions
# =============================================================================

def get_shopify_client(
    shop_domain: Optional[str] = Header(None, alias="X-Shopify-Shop-Domain"),
    access_token: Optional[str] = Header(None, alias="X-Shopify-Access-Token")
) -> ShopifyAdminClient:
    """Extract Shopify credentials from headers"""
    if not shop_domain or not access_token:
        raise HTTPException(
            status_code=401,
            detail="Missing Shopify credentials. Provide X-Shopify-Shop-Domain and X-Shopify-Access-Token headers."
        )
    
    return ShopifyAdminClient(
        shop_domain=shop_domain,
        access_token=access_token
    )


# =============================================================================
# Router Factory
# =============================================================================

def create_simplified_router() -> APIRouter:
    """Create router with simplified Shopify endpoints"""
    router = APIRouter(prefix="/v1/shopify", tags=["Shopify"])
    
    
    @router.post("/validate")
    async def validate_credentials(credentials: ShopifyCredentials):
        """Validate Shopify credentials by fetching shop info"""
        try:
            async with ShopifyAdminClient(
                shop_domain=credentials.shop_domain,
                access_token=credentials.access_token
            ) as client:
                shop_data = await client.get_shop_info()
                
                return {
                    "valid": True,
                    "shop": {
                        "id": shop_data.id,
                        "name": shop_data.name,
                        "email": shop_data.email,
                        "domain": shop_data.domain,
                        "currency": shop_data.currency,
                        "timezone": shop_data.timezone,
                        "plan_name": shop_data.plan_name
                    }
                }
        except ShopifyAuthError as e:
            raise HTTPException(status_code=401, detail=str(e))
        except ShopifyAPIError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            logger.error(f"Validation error: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Validation failed: {str(e)}")
    
    
    @router.get("/shop")
    async def get_shop(
        x_shop_domain: str = Header(..., alias="X-Shop-Domain"),
        x_access_token: str = Header(..., alias="X-Access-Token")
    ):
        """Get shop information"""
        try:
            client = get_shopify_client(x_shop_domain, x_access_token)
            async with client:
                shop_data = await client.get_shop_info()
                
                return {
                    "id": shop_data.id,
                    "name": shop_data.name,
                    "email": shop_data.email,
                    "domain": shop_data.domain,
                    "currency": shop_data.currency,
                    "timezone": shop_data.timezone,
                    "plan_name": shop_data.plan_name,
                    "address": {
                        "city": shop_data.city,
                        "country": shop_data.country,
                        "country_code": shop_data.country_code
                    }
                }
        except ShopifyAuthError as e:
            raise HTTPException(status_code=401, detail=str(e))
        except ShopifyAPIError as e:
            raise HTTPException(status_code=400, detail=str(e))
    
    
    @router.get("/products")
    async def get_products(
        limit: int = Query(50, le=250, description="Number of products to fetch"),
        status: str = Query("active", description="Product status filter"),
        x_shop_domain: str = Header(..., alias="X-Shop-Domain"),
        x_access_token: str = Header(..., alias="X-Access-Token")
    ):
        """Get products from Shopify"""
        try:
            client = get_shopify_client(x_shop_domain, x_access_token)
            async with client:
                products = await client.get_products(limit=limit, status=status)
                
                return {
                    "count": len(products),
                    "products": [
                        {
                            "id": p.id,
                            "title": p.title,
                            "handle": p.handle,
                            "vendor": p.vendor,
                            "product_type": p.product_type,
                            "status": p.status.value,
                            "price": p.variants[0].price if p.variants else None,
                            "sku": p.variants[0].sku if p.variants else None,
                            "image_url": p.images[0].src if p.images else None,
                            "inventory_quantity": p.variants[0].inventory_quantity if p.variants else None,
                            "created_at": p.created_at.isoformat() if p.created_at else None,
                            "updated_at": p.updated_at.isoformat() if p.updated_at else None,
                        }
                        for p in products
                    ]
                }
        except ShopifyAuthError as e:
            raise HTTPException(status_code=401, detail=str(e))
        except ShopifyAPIError as e:
            raise HTTPException(status_code=400, detail=str(e))
    
    
    @router.get("/orders")
    async def get_orders(
        limit: int = Query(50, le=250, description="Number of orders to fetch"),
        status: str = Query("any", description="Order status filter"),
        x_shop_domain: str = Header(..., alias="X-Shop-Domain"),
        x_access_token: str = Header(..., alias="X-Access-Token")
    ):
        """Get orders from Shopify"""
        try:
            client = get_shopify_client(x_shop_domain, x_access_token)
            async with client:
                orders = await client.get_orders(limit=limit, status=status)
                
                return {
                    "count": len(orders),
                    "orders": [
                        {
                            "id": o.id,
                            "name": o.name,
                            "email": o.email,
                            "total_price": o.total_price,
                            "currency": o.currency,
                            "financial_status": o.financial_status.value,
                            "fulfillment_status": o.fulfillment_status.value if o.fulfillment_status else "unfulfilled",
                            "customer_name": f"{o.customer['first_name']} {o.customer['last_name']}" if o.customer and o.customer.get('first_name') else None,
                            "customer_phone": o.customer.get('phone') if o.customer else None,
                            "created_at": o.created_at.isoformat() if o.created_at else None,
                            "line_items_count": len(o.line_items) if o.line_items else 0,
                            "tags": o.tags,
                        }
                        for o in orders
                    ]
                }
        except ShopifyAuthError as e:
            raise HTTPException(status_code=401, detail=str(e))
        except ShopifyAPIError as e:
            raise HTTPException(status_code=400, detail=str(e))
    
    
    @router.get("/customers")
    async def get_customers(
        limit: int = Query(50, le=250, description="Number of customers to fetch"),
        x_shop_domain: str = Header(..., alias="X-Shop-Domain"),
        x_access_token: str = Header(..., alias="X-Access-Token")
    ):
        """Get customers from Shopify"""
        try:
            client = get_shopify_client(x_shop_domain, x_access_token)
            async with client:
                customers = await client.get_customers(limit=limit)
                
                return {
                    "count": len(customers),
                    "customers": [
                        {
                            "id": c.id,
                            "email": c.email,
                            "first_name": c.first_name,
                            "last_name": c.last_name,
                            "phone": c.phone,
                            "orders_count": c.orders_count,
                            "total_spent": c.total_spent,
                            "created_at": c.created_at.isoformat() if c.created_at else None,
                            "tags": c.tags,
                        }
                        for c in customers
                    ]
                }
        except ShopifyAuthError as e:
            raise HTTPException(status_code=401, detail=str(e))
        except ShopifyAPIError as e:
            raise HTTPException(status_code=400, detail=str(e))
    
    
    @router.get("/stats")
    async def get_stats(
        x_shop_domain: str = Header(..., alias="X-Shop-Domain"),
        x_access_token: str = Header(..., alias="X-Access-Token")
    ):
        """Get dashboard statistics"""
        try:
            client = get_shopify_client(x_shop_domain, x_access_token)
            async with client:
                # Fetch products and orders in parallel
                products = await client.get_products(limit=250)
                orders = await client.get_orders(limit=250, status="any")
                
                # Calculate stats
                total_revenue = sum(float(o.total_price) for o in orders)
                pending_orders = [o for o in orders if o.fulfillment_status and o.fulfillment_status.value != "fulfilled"]
                
                return {
                    "products_count": len(products),
                    "orders_count": len(orders),
                    "pending_orders": len(pending_orders),
                    "total_revenue": total_revenue,
                    "currency": orders[0].currency if orders else "USD"
                }
        except ShopifyAuthError as e:
            raise HTTPException(status_code=401, detail=str(e))
        except ShopifyAPIError as e:
            raise HTTPException(status_code=400, detail=str(e))
    
    return router
