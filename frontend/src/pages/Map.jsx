import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useLocation } from 'react-router-dom';
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
    const location = useLocation();

    // Google Maps API loader (redundant if parent already loaded, but safe)
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey,
    });

    // Fetch all churches when component mounts or when navigating to map page
    useEffect(() => {
        if (location.pathname === '/map') {
            fetchChurches();
        }
    }, [location.pathname, fetchChurches]);

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

    // Define user marker icon - use a simple blue dot
    const userMarkerIcon = {
        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        scaledSize: { width: 32, height: 32 }
    };


    // If API key missing, surface helpful message (especially for production env)
    if (!apiKey) {
        return (
            <Box maxW="1200px" mx="auto" mt={8}>
                <Text color="red.500">
                    Missing Google Maps API key. Set VITE_GOOGLE_MAPS_API_KEY in your env and rebuild/redeploy.
                </Text>
            </Box>
        );
    }

    // If loader errored, display it
    if (loadError) {
        return (
            <Box maxW="1200px" mx="auto" mt={8}>
                <Text color="red.500">Failed to load Google Maps: {String(loadError)}</Text>
            </Box>
        );
    }

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
                    {userLocation && (
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
