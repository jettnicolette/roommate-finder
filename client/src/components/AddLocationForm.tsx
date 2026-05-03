import type { Location } from "./LocationCard";

function handleChange(){

}
function handleSubmit() {

}


function AddLocationForm(){

    return (

        <form onSubmit={handleSubmit}>
            <input
                name="address"
                placeholder="Street Address"
                onChange={handleChange}
            />
            <input
                name="unit_number"
                placeholder="Unit Number"
                onChange={handleChange}
            />
            <input
                name="city"
                placeholder="City"
                onChange={handleChange}
            />
            <input
                name="state"
                placeholder="State"
                onChange={handleChange}
            />
            <input
                name="zipcode"
                placeholder="Zipcode"
                onChange={handleChange}
            />
            <label>
                On Campus? 
                <input
                    name="is_oncampus"
                    placeholder="?"
                    type="checkbox"
                    onChange={handleChange}
                />
            </label>
            <input
                name="rent_total"
                type="number"
                placeholder="Rent Amount"
                onChange={handleChange}
            />
            <label>
                Allows Pets? 
                <input
                    name="allows_pets"
                    type="checkbox"
                    onChange={handleChange}
                />
            </label>
            <button type="submit">Submit Location</button>
        </form>

    )
}

export default AddLocationForm;