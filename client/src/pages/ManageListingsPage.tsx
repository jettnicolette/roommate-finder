import {useState} from 'react'
import AddLocationForm from '../components/AddLocationForm'
import LocationList from "../components/LocationList";
import './pages.css';


interface managePageProps {
    currentUser: number;
    onBack: () => void
}

function ManageListings({currentUser, onBack }: managePageProps){

    const [isFormVisable, setFormVisable] = useState<Boolean>(false);
    return(

        <div>
            <header className="page-header">
                <h1>My Locations</h1>
                <p>Create and edit your listings</p>
            </header>

            <div>
                <button
                    type="button"
                    onClick={() => setFormVisable(!isFormVisable)}
                    className="btn btn-secondary mb-4"
                >
                    {isFormVisable ? 'Hide' : "Create New Listing"}
                </button>
                {isFormVisable && (
                    <div className="form-container">
                        <h3>Enter New Location Listing Details:</h3>
                        <AddLocationForm currentUser={currentUser} />
                    </div>
                )}
            </div>

            <LocationList showOnlyUser={true} userId={currentUser}/>

            <button type="button" onClick={onBack} className="btn btn-secondary back-button">
                Back
            </button>

           
        </div>

    );
}

export default ManageListings;