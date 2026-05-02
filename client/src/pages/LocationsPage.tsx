
import LocationList from "../components/LocationList";


function LocationPage({ onBack }: { onBack: () => void }){

    return (
        <div>
            <LocationList/>
            <button type="button" onClick={onBack} className="btn btn-secondary">
                Back
            </button>
        </div>
    );

}

export default LocationPage;
