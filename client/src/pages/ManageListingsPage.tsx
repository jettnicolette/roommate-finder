import {useState} from 'react'
import AddLocationForm from '../components/AddLocationForm'
import LocationList from "../components/LocationList";


function ManageListings({onBack}: {onBack: () => void}){

    const [isFormVisable, setFormVisable] = useState<Boolean>(false);

    return(

        <div>
            <header className="page-header">
                <h1>My Locations</h1>
                <p>Create and edit your listings</p>
            </header>

            <button type="button" onClick={() => setFormVisable(!isFormVisable)} className="btn btn-secondary d-block ms-auto mb-4">
                {isFormVisable ? 'Hide' : "Create New Listing"}
            </button>
            
            <LocationList/>

            <button type="button" onClick={onBack} className="btn btn-secondary back-button">
                Back
            </button>

            {isFormVisable && (
                <div className="form-container">
                    <h3>Enter Property Details</h3>
                    <AddLocationForm />
                </div>
            )}
        </div>

    );
}

export default ManageListings;