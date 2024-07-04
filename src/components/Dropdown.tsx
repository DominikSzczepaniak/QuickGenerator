import { useState, ChangeEvent, useEffect } from 'react';
import { DrawingComponent } from '../Types';

interface DropdownProps {
    categories: string[];
    getCategoryDrawings: (categoryName: string) => DrawingComponent[] | null;
    getVariableDrawings: (categoryName: string, drawingName: string) => void;
    selectedCategory: string;
    selectedDrawing: string;
}

function Dropdown(props: DropdownProps) {
    const { categories, getCategoryDrawings, getVariableDrawings } = props;
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedDrawing, setSelectedDrawing] = useState<string>('');

    useEffect(() => {
        if (props.selectedCategory !== '') {
            setSelectedCategory(props.selectedCategory);
        }
    }, [props.selectedCategory]);

    useEffect(() => {
        if (props.selectedDrawing !== '') {
            setSelectedDrawing(props.selectedDrawing);
        }
    }, [props.selectedDrawing]);

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
    };

    const handleDrawingChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedDrawing(event.target.value);
        getVariableDrawings(selectedCategory, event.target.value);
    }

    let drawings: DrawingComponent[] | null = null;
    if (selectedCategory) {
        drawings = getCategoryDrawings(selectedCategory);
    }

    return (
        <div className="relative inline-block text-left">
            <select
                id="dropdown"
                value={selectedCategory}
                onChange={handleChange}
                className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
            >
                <option value="">-- Draw when: category? --</option>
                {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                ))}
            </select>
            {selectedCategory && (
                <select
                    id="dropdown"
                    value={selectedDrawing}
                    onChange={handleDrawingChange}
                    className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
                >
                    <option value="">-- For category {selectedCategory}, draw when: drawing? --</option>
                    {drawings?.map((drawing, index) => (
                        <option key={index} value={drawing.inputValue}>{drawing.inputValue}</option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default Dropdown;
