import React, { useState, ChangeEvent } from 'react';

interface DropdownProps {
    categories: string[];

}

function Dropdown(props: DropdownProps){
    const {categories} = props;
    const [categoryNumber, setCategoryNumber] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string>('');

    const handleCategoryPick = (event: ChangeEvent<HTMLSelectElement>) => {
        setCategoryNumber(Number(event.target.value));
    }

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
    };

    return (
        <div className="relative inline-block text-left">
            <select
                id="dropdown"
                value={selectedOption}
                onChange={handleChange}
                className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
            >
                <option value="">-- Wybierz nazwe kategorii --</option>
                {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                ))}
            </select>
            {/* {selectedOption && (
                <p className="mt-2 text-sm text-gray-500">
                    Wybrałeś: <span className="font-medium text-gray-900">{selectedOption}</span>
                </p>
            )} */}
        </div>
    );
};

export default Dropdown;
