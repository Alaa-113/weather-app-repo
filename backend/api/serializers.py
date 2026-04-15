from rest_framework import serializers
from .models import Favorite


class FavoriteSerializer(serializers.ModelSerializer):
    city = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Favorite
        fields = ['id', 'city_name', 'notes', 'city', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        city = validated_data.pop('city', None) or validated_data.get('city_name')
        if not city:
            raise serializers.ValidationError({'city': 'This field is required.'})
        validated_data['city_name'] = city
        return super().create(validated_data)
