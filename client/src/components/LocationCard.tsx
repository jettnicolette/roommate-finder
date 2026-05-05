import '../styles/LocationCard.css'

export interface Location {
    location_id?: number;
    current_id?: number;
    user_id: number;
    username: string;
    real_name: string;
    address: string;
    unit_number: string;
    city:string;
    state:string;
    zip_code:string;
    rent: number;
    is_oncampus: boolean;
    allows_pets: boolean;
}

//Goal - create location card for individual location
function LocationCard({ location_id, current_id, user_id, username, real_name, address, unit_number, city, state, zip_code, rent, is_oncampus, allows_pets}: Location){

    //TODO - get user info
     var id_string: string = "";
    if(location_id){
        id_string = location_id.toString();
    }
    const locationDetail = `${city}, ${state} ${zip_code}`;    
    
    const handleDelete = async () => {
        try {
            // 2. The URL must match your router.delete("/:id") path
            const url = `http://localhost:5000/locations/${location_id}`;

            const response = await fetch(url, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                // 3. Success! 
                alert(data.message); // "Location deleted successfully"

            } else {
                // Handle 404 or other server errors
                alert(`Error: ${data.error}`);
            }
        } catch (error: any) {
            // 5. Frontend error handling
            console.error("Network Error:", error.message);
            alert("Could not connect to the server.");
        }

    };

    return (

        //HTML struct 
        <div id={id_string} className="location-card">
            <div className="location-header">
                {(current_id === user_id) && (
                    <button onClick={handleDelete} className="btn btn-danger btn-sm ms-auto">
                        Delete
                    </button>)
                }
                <h3>{address}</h3>
                <h3>{unit_number}</h3>
                <p>{locationDetail}</p>
            </div>
            <div className='location-info'>
                <p><strong>Total Rent:</strong> ${rent}</p>
                <p><strong>On Campus:</strong> {is_oncampus ? "Yes" : "No"}</p>
                <p><strong>Allows Pets:</strong> {allows_pets ? "Yes" : "No"}</p>
            </div>
            <div className='poster-badge'>
                <p>Posted by:</p>
                <p>{real_name}</p>
                <p>@{username}</p>
                <button className="btn btn-secondary d-block ms-auto mb-4">View Profile</button>
            </div>
        </div>

    );
}

export default LocationCard;