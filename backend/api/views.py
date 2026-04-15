import requests
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from . import weather as weather_api
from .models import Favorite
from .serializers import FavoriteSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = (request.data.get('username') or '').strip()
    password = request.data.get('password') or ''
    if not username or not password:
        return Response({'error': 'Username and password required'},
                        status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if user is None:
        # Auto-create on first login for convenience (dev-friendly).
        if not User.objects.filter(username=username).exists():
            user = User.objects.create_user(username=username, password=password)
        else:
            return Response({'error': 'Invalid credentials'},
                            status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'username': user.username})


@api_view(['GET'])
@permission_classes([AllowAny])
def weather_current(request):
    city = request.query_params.get('city', '').strip()
    if not city:
        return Response({'error': 'city parameter is required'},
                        status=status.HTTP_400_BAD_REQUEST)
    try:
        data = weather_api.get_current(city)
    except requests.RequestException:
        return Response({'error': 'Weather service unavailable'},
                        status=status.HTTP_502_BAD_GATEWAY)
    if data is None:
        return Response({'error': f'City "{city}" not found'},
                        status=status.HTTP_404_NOT_FOUND)
    return Response(data)


@api_view(['GET'])
@permission_classes([AllowAny])
def weather_forecast(request):
    city = request.query_params.get('city', '').strip()
    if not city:
        return Response({'error': 'city parameter is required'},
                        status=status.HTTP_400_BAD_REQUEST)
    try:
        data = weather_api.get_forecast(city)
    except requests.RequestException:
        return Response({'error': 'Weather service unavailable'},
                        status=status.HTTP_502_BAD_GATEWAY)
    if data is None:
        return Response({'error': f'City "{city}" not found'},
                        status=status.HTTP_404_NOT_FOUND)
    return Response(data)


class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
