import React, { useState, ChangeEvent } from 'react';

interface DrawingProps {
    id: number;
    ppbSwitch: boolean;
    handleDelete: (id: number) => void;
}

function Drawing(props: DrawingProps) {
    const { id, ppbSwitch, handleDelete } = props;
    const [ppbValue, setPpbValue] = useState('1');
    const [countValue, setCountValue] = useState('1');
    const [ppbValueSave, setPpbValueSave] = useState('1');
    const [countValueSave, setCountValueSave] = useState('1');
    const [inputValue, setInputValue] = useState("Enter the name of this draw...");
    const [isEditing, setIsEditing] = useState(false);

    const handleFocus = () => {
        if (inputValue === "Enter the name of this draw...") {
            setInputValue("");
        }
    };

    const isValidNumber = (value: string) => {
        const number = Number(value);
        return !isNaN(number) && (Number.isInteger(number) || (number >= 0 && number <= 1));
    };

    const isValidFraction = (value: string) => {
        const fractionParts = value.split('/');
        if (fractionParts.length === 2) {
            const numerator = Number(fractionParts[0]);
            const denominator = Number(fractionParts[1]);
            return !isNaN(numerator) && !isNaN(denominator) && denominator !== 0;
        }
        return false;
    };

    const handleNewValue = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (ppbSwitch) {
            setPpbValueSave(ppbValue);
            setPpbValue(newValue);
        } else {
            setCountValueSave(countValue);
            setCountValue(newValue);
        }
    };

    const handleSave = () => {
        const newValue = ppbSwitch ? ppbValue : countValue;
        if (ppbSwitch) {
            if (isValidNumber(newValue) && Number(newValue) >= 0 && Number(newValue) <= 1) {
                setPpbValue(newValue);
            }
            else if (isValidFraction(newValue)) {
                const x = Number(newValue.split('/')[0]);
                const y = Number(newValue.split('/')[1]);
                if (x / y < 0 || x / y > 1) {
                    alert("Please enter a probability (0 to 1)");
                    setPpbValue(ppbValueSave)
                }
            }
            else {
                alert("Please enter a probability (0 to 1) in decimal or fraction");
                setPpbValue(ppbValueSave)
            }
        }
        else {
            if (isValidNumber(newValue) && Number(newValue) >= 1) {
                setCountValue(newValue);
            }
            else {
                alert("Please enter a natural number (integer >= 1)");
                setCountValue(countValueSave)
            }
        }
        setIsEditing(false);
    };

    return (
        <div className="border p-4 mb-4 rounded shadow-md">
            {isEditing ? (
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        value={ppbSwitch ? ppbValue : countValue}
                        onChange={handleNewValue}
                        className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                    />
                    <input
                        type="text"
                        onFocus={handleFocus}
                        value={inputValue}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                        className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 flex-grow"
                    />
                    <button onClick={handleSave} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Save
                    </button>
                </div>
            ) : (
                <div className="flex items-center space-x-4">
                    <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded">{ppbSwitch ? ppbValue : countValue}</span>
                    <span className="flex-grow bg-gray-200 text-gray-800 px-3 py-1 rounded">{inputValue}</span>
                    <button onClick={() => setIsEditing(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Edit
                    </button>
                    <button onClick={() => handleDelete(id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Delete
                    </button>
                </div>

            )}
        </div>
    );
}

export default Drawing;
