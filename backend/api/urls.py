from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from . import views

router = DefaultRouter()
router.register(r'favorites', views.FavoriteViewSet, basename='favorite')

urlpatterns = [
    path('login/', views.login_view),
    path('register/', views.register_view),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('token/verify/', TokenVerifyView.as_view()),
    path('weather/current/', views.weather_current),
    path('weather/forecast/', views.weather_forecast),
    path('', include(router.urls)),
]
