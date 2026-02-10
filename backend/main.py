"""
FastAPI backend for Shopify Integration
Connects Next.js dashboard to Shopify Admin API
"""
import os
import sys
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

# Add integrations to path
sys.path.insert(0, str(Path(__file__).parent))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Shopify AI Backend",
    version="1.0.0",
    description="Backend API for Shopify integration with Next.js dashboard"
)

# CORS - Allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"  # Update with your frontend URL in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include Shopify routes
try:
    from integrations.shopify.simplified_routes import create_simplified_router
    shopify_router = create_simplified_router()
    app.include_router(shopify_router)
    logger.info("✅ Shopify routes loaded successfully")
except Exception as e:
    logger.error(f"❌ Failed to load Shopify routes: {e}")

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)}
    )

@app.get("/")
def root():
    return {
        "service": "Shopify AI Backend",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "shopify": "/v1/shopify/*",
            "docs": "/docs"
        }
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "shopify-ai-backend"
    }

@app.get("/ready")
def ready():
    return {
        "status": "ready",
        "checks": {
            "api": "ok",
            "shopify_routes": "loaded"
        }
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
