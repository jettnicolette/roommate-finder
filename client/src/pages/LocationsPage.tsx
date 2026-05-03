import LocationList from "../components/LocationList";
import ManageListings from "./ManageListingsPage";
import{ useState } from 'react';

function LocationPage({ onBack }: { onBack: () => void }){
    const [currentView, setCurrentView] = useState("viewLocations");

    return (
        <div>
            {currentView === "viewLocations"  && (
                <div>
                    <button type="button" onClick={onBack} className="btn btn-secondary">
                        Back
                    </button>
                    <button type='button' onClick={() => setCurrentView('manageLocations')} className="btn btn-secondary">Manage My Listings
                    </button>
                    <LocationList />
                </div>
            )}
            {currentView === "manageLocations" && (<ManageListings onBack={() => setCurrentView("viewLocations")} />)}
        </div>
    );

}

export default LocationPage;
