import LocationList from "../components/LocationList";
import ManageListings from "./ManageListingsPage";
import{ useState } from 'react';
import './pages.css';

function LocationPage({ onBack }: { onBack: () => void }){
    const [currentView, setCurrentView] = useState("viewLocations");

    return (
        <div className="page-container">
            {currentView === "viewLocations"  && (
                <div>
                    <header className="page-header">
                        <h1>Avaliable Locations</h1>
                        <p>View listings looking for roomates</p>
                    </header>
                    <button type='button' onClick={() => setCurrentView('manageLocations')} className="btn btn-secondary d-block ms-auto mb-4">Manage My Listings
                    </button>
                    <LocationList />
                    <button type="button" onClick={onBack} className="btn btn-secondary back-button">
                        Back
                    </button>
                </div>
            )}
            {currentView === "manageLocations" && (<ManageListings onBack={() => setCurrentView("viewLocations")} />)}
        
        
        </div>
    );

}

export default LocationPage;
