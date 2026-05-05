import {useState} from 'react'

export interface LocationFormData {
    user_id: number;
    address: string;
    unit_number: string;
    city: string;
    state: string;
    zip_code: string;
    rent: number | string; // Allows empty string in input
    is_oncampus: boolean;
    allows_pets: boolean;
}

function AddLocationForm({ currentUser }: { currentUser: number }){

    const [formData, setFormData] = useState<LocationFormData>({
        user_id: currentUser,
        address: '',
        unit_number: '',
        city: '',
        state: '',
        zip_code: '',
        rent: 0,
        is_oncampus: false,
        allows_pets: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            // Checkboxes use 'checked', everything else uses 'value'
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevents page reload

        try {
            const response = await fetch('http://localhost:5000/locations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Location added successfully!");
            } else {
                const errorData = await response.json();
                console.error("Server error:", errorData);
            }
        } catch (error) {
            console.error("Connection error:", error);
        }
    };


    return (

        <form className="form" onSubmit={handleSubmit}>
            <div className="form-group-location">
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
                <input
                    name="rent"
                    type="number"
                    placeholder="Rent Amount"
                    onChange={handleChange}
                />
            </div>
            <div className="checkbox-container">
                <label>
                    Allows Pets?
                </label>
                <input
                    name="allows_pets"
                    type="checkbox"
                    onChange={handleChange}
                />
            </div>
            <div className="checkbox-container">
                <label>
                    On Campus?
                </label>
                <input
                    name="is_oncampus"
                    placeholder="?"
                    type="checkbox"
                    onChange={handleChange}
                />
            </div>

            <button className="btn btn-primary" type="submit">Submit Location</button>
        </form>

    )
}

export default AddLocationForm;