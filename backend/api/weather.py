import requests

GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search'
FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

WEATHER_CODES = {
    0: 'Clear',
    1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Rime fog',
    51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
    56: 'Freezing drizzle', 57: 'Freezing drizzle',
    61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
    66: 'Freezing rain', 67: 'Freezing rain',
    71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Rain showers', 81: 'Rain showers', 82: 'Violent rain showers',
    85: 'Snow showers', 86: 'Heavy snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with hail',
}


def code_to_condition(code):
    return WEATHER_CODES.get(code, 'Unknown')


def geocode(city):
    r = requests.get(GEOCODE_URL, params={'name': city, 'count': 1}, timeout=10)
    r.raise_for_status()
    data = r.json()
    results = data.get('results') or []
    if not results:
        return None
    top = results[0]
    return {
        'latitude': top['latitude'],
        'longitude': top['longitude'],
        'name': top.get('name', city),
        'country': top.get('country', ''),
        'timezone': top.get('timezone', 'auto'),
    }


def get_current(city):
    loc = geocode(city)
    if not loc:
        return None
    params = {
        'latitude': loc['latitude'],
        'longitude': loc['longitude'],
        'current': 'temperature_2m,apparent_temperature,relative_humidity_2m,'
                   'wind_speed_10m,pressure_msl,weather_code',
        'timezone': loc['timezone'],
        'wind_speed_unit': 'kmh',
    }
    r = requests.get(FORECAST_URL, params=params, timeout=10)
    r.raise_for_status()
    cur = r.json().get('current', {})
    return {
        'city': loc['name'],
        'country': loc['country'],
        'temperature': cur.get('temperature_2m'),
        'feels_like': cur.get('apparent_temperature'),
        'condition': code_to_condition(cur.get('weather_code')),
        'humidity': cur.get('relative_humidity_2m'),
        'wind_speed': cur.get('wind_speed_10m'),
        'pressure': cur.get('pressure_msl'),
    }


def get_forecast(city):
    loc = geocode(city)
    if not loc:
        return None
    params = {
        'latitude': loc['latitude'],
        'longitude': loc['longitude'],
        'daily': 'temperature_2m_max,weather_code',
        'timezone': loc['timezone'],
        'forecast_days': 5,
    }
    r = requests.get(FORECAST_URL, params=params, timeout=10)
    r.raise_for_status()
    daily = r.json().get('daily', {})
    dates = daily.get('time', [])
    temps = daily.get('temperature_2m_max', [])
    codes = daily.get('weather_code', [])
    items = []
    for i, date in enumerate(dates):
        items.append({
            'date': date,
            'temp': temps[i] if i < len(temps) else None,
            'condition': code_to_condition(codes[i] if i < len(codes) else None),
        })
    return {'city': loc['name'], 'country': loc['country'], 'list': items}
