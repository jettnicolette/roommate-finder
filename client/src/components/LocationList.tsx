import { useState, useEffect } from 'react';
import LocationCard from './LocationCard';
import type { Location } from './LocationCard';

interface LocationListProps {
    showOnlyUser?: boolean;
    userId?: number;
}

//Creates list of locations
function LocationList({showOnlyUser = false, userId }: LocationListProps) {

    //use state effects to control displaying content
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    //fetch from api
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const baseURL = 'http://localhost:5000/locations';
                const url = showOnlyUser
                    ? `${baseURL}/user/${userId}`
                    : baseURL;

                const response = await fetch(url);
                
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
    }, [showOnlyUser, userId]);

    //conditional rendering
    if (loading) return <p>Loading locations...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="roommates-grid">
            {locations.length > 0 ? (
                locations.map((loc) => <LocationCard key={loc.location_id} current_id={userId} {...loc} />)
            ) : (
                <p>No postings found.</p>
            )}
        </div>
        
    );
}

export default LocationList;