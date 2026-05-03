import {useState} from 'react'
import AddLocationForm from '../components/AddLocationForm'

function ManageListings({onBack}: {onBack: () => void}){

    const [isFormVisable, setFormVisable] = useState<Boolean>(false);

    return(

        <div>
            <button type="button" onClick={onBack} className="btn btn-secondary">
                Back
            </button>
            <button type="button" onClick={() => setFormVisable(!isFormVisable)} className="btn btn-secondary">
                {isFormVisable ? 'Hide' : "Create New Listing"}
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