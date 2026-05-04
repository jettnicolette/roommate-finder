import '../styles/LocationCard.css'

export interface Location {
    location_id: number;
    user_id: number;
    address: string;
    unit_number: string;
    city:string;
    state:string;
    zip_code:string;
    rent: number;
    is_oncampus: boolean;
    allow_pets: boolean;
}

//Goal - create location card for individual location
function LocationCard({ location_id, user_id, address, unit_number, city, state, zip_code, rent, is_oncampus, allow_pets}: Location){

    //TODO - get user info

    const id_string: string = location_id.toString();
    const locationDetail = `${city}, ${state} ${zip_code}`;    

    return (

        //HTML struct 
        <div id={id_string} className="location-card">
            <div className="location-header">
                <h3>{address}</h3>
                <h3>{unit_number}</h3>
                <p>{locationDetail}</p>
            </div>
            <div>
                <p>Posted by:</p>
                <p>Name</p>
                <button className="btn btn-secondary d-block ms-auto mb-4">View Profile</button>
            </div>
            <div className='location-info'>
                <p><strong>Total Rent:</strong> ${rent}</p>
                <p><strong>On Campus:</strong> {is_oncampus ? "Yes" : "No"}</p>
                <p><strong>Allows Pets:</strong> {allow_pets ? "Yes" : "No"}</p>
            </div>
        </div>

    );
}

export default LocationCard;