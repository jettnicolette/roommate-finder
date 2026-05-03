import { useState, useEffect } from 'react';
import LocationCard from './LocationCard';
import type { Location } from './LocationCard';


//Creates list of locations
function LocationList() {

    //use state effects to control displaying content
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    //fetch from api
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch('http://localhost:5000/locations');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data: Location[] = await response.json();
                setLocations(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    //conditional rendering
    if (loading) return <p>Loading locations...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="roommates-grid">
            {locations.map((loc) => (
                <LocationCard key={loc.location_id} {...loc} />
            ))}
        </div>
        
    );
}

export default LocationList;