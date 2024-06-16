import { useState, ChangeEvent, KeyboardEvent } from 'react';
import { DrawingComponent } from '../Types';

interface DrawingProps {
  id: number;
  ppbSwitch: boolean;
  handleDelete: (id: number) => void;
  updateDrawing: (drawing: DrawingComponent) => void;
  ppbValue: string;
  countValue: string;
  inputValue: string;
}

function Drawing(props: DrawingProps) {
  const { id, ppbSwitch, handleDelete, updateDrawing, ppbValue: initialPpbValue, countValue: initialCountValue, inputValue: initialInputValue } = props;
  const [ppbValue, setPpbValue] = useState(initialPpbValue);
  const [countValue, setCountValue] = useState(initialCountValue);
  const [inputValue, setInputValue] = useState(initialInputValue);
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
      setPpbValue(newValue);
    } else {
      setCountValue(newValue);
    }
  };

  const handleSave = () => {
    const newValue = ppbSwitch ? ppbValue : countValue;
    if (ppbSwitch) {
      if (isValidNumber(newValue) && Number(newValue) >= 0 && Number(newValue) <= 1) {
        setPpbValue(newValue);
        updateDrawing({ id, ppbValue: newValue, countValue, inputValue });
      } else if (isValidFraction(newValue)) {
        const [numerator, denominator] = newValue.split('/').map(Number);
        if (numerator / denominator >= 0 && numerator / denominator <= 1) {
          setPpbValue(newValue);
          updateDrawing({ id, ppbValue: newValue, countValue, inputValue });
        }
      } else {
        alert("Please enter a probability (0 to 1) in decimal or fraction");
      }
    } else {
      if (isValidNumber(newValue) && Number(newValue) >= 1) {
        setCountValue(newValue);
        updateDrawing({ id, ppbValue, countValue: newValue, inputValue });
      } else {
        alert("Please enter a natural number (integer >= 1)");
      }
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="border p-4 mb-4 rounded shadow-md">
      {isEditing ? (
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={ppbSwitch ? ppbValue : countValue}
            onChange={handleNewValue}
            onKeyDown={handleKeyDown}
            className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            onFocus={handleFocus}
            value={inputValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
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
