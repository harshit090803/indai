from django.contrib import admin
from django.urls import path
from ninja_extra import NinjaExtraAPI
from ninja_jwt.controller import NinjaJWTDefaultController
from api.api import router as api_router

api = NinjaExtraAPI(title="IndAI API", version="1.0.0")
api.register_controllers(NinjaJWTDefaultController)
api.add_router("/", api_router)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls),
]
