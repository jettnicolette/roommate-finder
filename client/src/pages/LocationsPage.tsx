import LocationList from "../components/LocationList";
import ManageListings from "./ManageListingsPage";
import{ useState } from 'react';
import './pages.css';

interface locationPageProps{
    currentUser: number;
    onBack: () => void 
}

function LocationPage({currentUser, onBack}: locationPageProps){
    const [currentView, setCurrentView] = useState("viewLocations");

    return (
        <div className="page-container">
            {currentView === "viewLocations"  && (
                <div>
                    <header className="page-header">
                        <h1>Avaliable Locations</h1>
                        <p>View listings looking for roomates</p>
                    </header>
                    <div className="location-back-button-container"><button onClick={onBack} className="back-button">Back</button>
                        <button type='button' onClick={() => setCurrentView('manageLocations')} className="btn btn-secondary">Manage My Listings</button>
                    </div>
                    <LocationList/>
                </div>
            )}
            {currentView === "manageLocations" && (<ManageListings currentUser={currentUser} onBack={() => setCurrentView("viewLocations")} />)}
        
        
        </div>
    );

}

export default LocationPage;
