import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useChurchStore } from '../store/church';
import { Box, Spinner, Text } from '@chakra-ui/react';

const containerStyle = {
    width: '100%',
    height: '80vh',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
};

// Fallback: center of US
const DEFAULT_CENTER = { lat: 39.8283, lng: -98.5795 };

const churchMarkerIcon = {
    url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
};

const Map = () => {
    const { churches, fetchChurches } = useChurchStore();
    const [userLocation, setUserLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
    const [geoError, setGeoError] = useState(null);

    // Google Maps API loader (redundant if parent already loaded, but safe)
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
    });

    // Fetch all churches on mount
    useEffect(() => {
        fetchChurches();
    }, [fetchChurches]);

    // Get user geolocation
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    setMapCenter({ lat: latitude, lng: longitude });
                },
                (err) => {
                    setGeoError('Could not get your location. Showing default view.');
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } else {
            setGeoError('Geolocation not supported. Showing default view.');
        }
    }, []);

    // Memoize markers for performance
    const renderChurchMarkers = useCallback(() => {
        return churches
            .filter((church) => church.latitude && church.longitude)
            .map((church) => (
                <Marker
                    key={church._id}
                    position={{ lat: church.latitude, lng: church.longitude }}
                    icon={churchMarkerIcon}
                    title={church.name}
                />
            ));
    }, [churches]);

    // Define user marker icon only after Google Maps is loaded
    const userMarkerIcon = isLoaded && window.google && window.google.maps && window.google.maps.SymbolPath
        ? {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#4285F4',
            fillOpacity: 1,
            scale: 8,
            strokeColor: '#fff',
            strokeWeight: 2,
        }
        : undefined;

    return (
        <Box maxW="1200px" mx="auto" mt={8}>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>Church Map</Text>
            {geoError && (
                <Text color="red.500" mb={2}>{geoError}</Text>
            )}
            {!isLoaded ? (
                <Spinner size="xl" />
            ) : (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={mapCenter}
                    zoom={userLocation ? 12 : 5}
                >
                    {/* User marker */}
                    {userLocation && userMarkerIcon && (
                        <Marker
                            position={userLocation}
                            icon={userMarkerIcon}
                            title="You are here"
                        />
                    )}
                    {/* Church markers */}
                    {renderChurchMarkers()}
                </GoogleMap>
            )}
        </Box>
    );
};

export default Map;
