export interface Location {
    id: number;
    address: string;
    unit_number: string;
    city:string;
    state:string;
    zip_code:string;
    is_oncampus: boolean;
    allow_pets: boolean;
}

//Goal - create location card for individual location
function LocationCard({id, address, unit_number, city, state, zip_code, is_oncampus, allow_pets}: Location){

    const id_string: string = id.toString();
    const locationDetail = `${city}, ${state} ${zip_code}`;    

    return (

        //define HTML struct here
        <div id={id_string}>
            <h3>{address}</h3>
            <h3>{unit_number}</h3>
            <p>{locationDetail}</p>
            <p><strong>On Campus:</strong> {is_oncampus ? "Yes" : "No"}</p>
            <p><strong>Allows Pets:</strong> {allow_pets ? "Yes" : "No"}</p>>
        </div>

    );
}

export default LocationCard;