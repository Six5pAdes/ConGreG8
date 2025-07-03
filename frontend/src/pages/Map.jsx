import { Container, Heading, VStack, Spinner, Text } from '@chakra-ui/react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import axios from 'axios';

const containerStyle = {
    width: '100%',
    height: '500px',
};

const defaultCenter = {
    lat: 37.7749, // San Francisco latitude
    lng: -122.4194, // San Francisco longitude
};

const Map = () => {
    // TODO: Store your API key in an environment variable for security
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';
    const [churches, setChurches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChurches = async () => {
            try {
                const res = await axios.get('/api/churches');
                const data = res.data;
                if (!data.success) throw new Error('Failed to fetch churches');
                const filteredChurches = data.data.filter(
                    (church) =>
                        typeof church.latitude === "number" &&
                        typeof church.longitude === "number"
                );
                setChurches(filteredChurches);
                console.log('Churches for map:', filteredChurches);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchChurches();
        // eslint-disable-next-line
    }, []);

    return (
        <Container maxW="container.xl" py={14}>
            <VStack spacing={8} align="center">
                <Heading as="h1" size="2xl" color="teal.500">
                    Map View
                </Heading>
                {loading ? (
                    <Spinner size="xl" />
                ) : error ? (
                    <Text color="red.500">{error}</Text>
                ) : (
                    <LoadScript googleMapsApiKey={apiKey}>
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={
                                churches[0]
                                    ? { lat: churches[0].latitude, lng: churches[0].longitude }
                                    : defaultCenter
                            }
                            zoom={churches[0] ? 10 : 12}
                        >
                            {churches.map((church) => (
                                <Marker
                                    key={church._id}
                                    position={{ lat: church.latitude, lng: church.longitude }}
                                    title={church.name}
                                />
                            ))}
                        </GoogleMap>
                    </LoadScript>
                )}
            </VStack>
        </Container>
    );
};

export default Map;
