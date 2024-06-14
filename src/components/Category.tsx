import React, { useState } from 'react';
import Drawing from './Drawing'; // Zakładam, że komponent Drawing jest w tym samym katalogu

interface Drawing {
    id: number;
}

interface CategoryProps {
    id: number;
    deleteCategory: (id: number) => void;
}

function Category(props: CategoryProps) {
    const { id, deleteCategory } = props;
    const [drawings, setDrawings] = useState<Drawing[]>([{ id: 1 }]);
    const [hidden, setHidden] = useState(false);
    const [name, setName] = useState("Type the name of this category...");
    const [ppbSwitch, setPpbSwitch] = useState(false);

    const addDrawing = () => {
        const newDrawingId = drawings.length + 1;
        setDrawings([...drawings, { id: newDrawingId }]);
    };

    const toggleHidden = () => {
        setHidden(!hidden);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleFocus = () => {
        if (name === "Type the name of this category...") {
            setName("");
        }
    };

    const togglePpbSwitch = () => {
        setPpbSwitch(!ppbSwitch);
    };

    return (
        <div className="p-4 border rounded shadow-md mb-4">
            <div className="flex items-center justify-between mb-2">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={togglePpbSwitch}
                >
                    {ppbSwitch ? "Change to count" : "Change to probability"}
                </button>
                <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    onFocus={handleFocus}
                    className="border border-gray-400 rounded px-3 py-2 focus:outline-none focus:border-blue-500 flex-grow ml-2"
                />
                <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
                    onClick={addDrawing}
                >
                    Add drawing option
                </button>
                <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                    onClick={() => deleteCategory(id)}
                >
                    Delete category
                </button>
                <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
                    onClick={toggleHidden}
                >
                    {hidden ? "Show" : "Hide"}
                </button>
            </div>
            {!hidden && (
                <div>
                    {drawings.map((drawing) => (
                        <Drawing
                            key={drawing.id}
                            id={drawing.id}
                            ppbSwitch={ppbSwitch}
                            handleDelete={(id: number) => {
                                setDrawings(drawings.filter((drawing) => drawing.id !== id));
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Category;
