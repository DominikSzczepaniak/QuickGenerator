import React, { useState, useCallback, useEffect, useRef } from 'react';
import Drawing from './Drawing';
import { DrawingComponent } from '../Types';

interface CategoryProps {
    id: number;
    deleteCategory: (id: number) => void;
    registerHandleDraw: (id: number, handleDraw: () => [string, string]) => void;
    registerSaveData: (id: number, saveData: () => {name: string, drawings: {ppbValue: string, countValue: string, inputValue: string}[]}) => void;
    registerLoadData: (id: number, loadData: (data: {name: string, drawings: {ppbValue: string, countValue: string, inputValue: string}[]}) => void) => void;
}

function Category(props: CategoryProps) {
    const { id, deleteCategory, registerHandleDraw, registerSaveData, registerLoadData } = props;
    const [drawings, setDrawings] = useState<DrawingComponent[]>([{ id: 1, ppbValue: "1", countValue: "1", inputValue: "Enter the name of this draw..." }]);
    const [hidden, setHidden] = useState(false);
    const [name, setName] = useState("Type the name of this category...");
    const [ppbSwitch, setPpbSwitch] = useState(false);

    const addDrawing = () => {
        const newDrawingId = drawings.length + 1;
        setDrawings([...drawings, { id: newDrawingId, ppbValue: "1", countValue: "1", inputValue: "Enter the name of this draw..." }]);
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

    const updateDrawing = useCallback((updatedDrawing: DrawingComponent) => {
        const updatedDrawings = drawings.map((drawing) => (drawing.id === updatedDrawing.id ? updatedDrawing : drawing));
        setDrawings(updatedDrawings);
    }, [drawings]);

    function handleDrawProbability(): [string, string] {
        let answer: [string, string] = [name, ""];
        let sum = 0;
        for (let k = 0; k < drawings.length; k++) {
            if (drawings[k].ppbValue.includes('/')) {
                let parts = drawings[k].ppbValue.split('/');
                sum += Number(parts[0]) / Number(parts[1]);
            } else {
                sum += Number(drawings[k].ppbValue);
            }
        }
        if (sum + 0.1 < 1 && sum > 1) {
            alert("The sum of probabilities in one category is greater than 1. Please correct it.");
            return ["error", "error"];
        }
        let random = Math.random();
        let counter = 0;
        for (let k = 0; k < drawings.length; k++) {
            if (drawings[k].ppbValue.includes('/')) {
                let parts = drawings[k].ppbValue.split('/');
                counter += Number(parts[0]) / Number(parts[1]);
            } else {
                counter += Number(drawings[k].ppbValue);
            }
            if (counter >= random) {
                answer[1] = drawings[k].inputValue;
                break;
            }
        }
        return answer;
    }

    function handleDrawCount(): [string, string] {
        let answer: [string, string] = [name, ""];
        let elements: [number, string][] = [];
        let sum = 0;
        for (let j = 0; j < drawings.length; j++) {
            elements.push([Number(drawings[j].countValue), drawings[j].inputValue]);
            sum += Number(drawings[j].countValue);
        }
        let random = Math.random() * sum;
        let counter = 0;
        for (let j = 0; j < elements.length; j++) {
            counter += elements[j][0];
            if (counter >= random) {
                answer[1] = elements[j][1];
                break;
            }
        }
        return answer;
    }

    const handleDraw = useCallback((): [string, string] => {
        if (ppbSwitch) {
            return handleDrawProbability();
        } else {
            return handleDrawCount();
        }
    }, [handleDrawProbability, handleDrawCount, ppbSwitch]);

    function saveData() {
        let draws = [];
        for(let i = 0; i < drawings.length; i++) {
            draws.push({ppbValue: drawings[i].ppbValue, countValue: drawings[i].countValue, inputValue: drawings[i].inputValue});
        }
        return {name: name, drawings: draws};
    }

    function loadData(category: {name: string, drawings: {ppbValue: string, countValue: string, inputValue: string}[]}) {
        setName(category.name);
        setDrawings(category.drawings.map((drawing, index) => ({id: index + 1, ppbValue: drawing.ppbValue, countValue: drawing.countValue, inputValue: drawing.inputValue})));
    }

    useEffect(() => {
        registerSaveData(id, saveData);
    }, [id, registerSaveData, saveData]);

    useEffect(() => {
        registerLoadData(id, loadData);
    }, [id, registerLoadData, loadData]);

    useEffect(() => {
        registerHandleDraw(id, handleDraw);
    }, [id, registerHandleDraw, handleDraw]);

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
                            handleDelete={(drawingId: number) => {
                                setDrawings(drawings.filter((drawing) => drawing.id !== drawingId));
                            }}
                            updateDrawing={(updatedDrawing: DrawingComponent) => updateDrawing(updatedDrawing)}
                            ppbValue={drawing.ppbValue}
                            countValue={drawing.countValue}
                            inputValue={drawing.inputValue}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Category;
