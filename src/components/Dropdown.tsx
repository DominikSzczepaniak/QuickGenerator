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
    const { categories, getCategoryDrawings, getVariableDrawings, selectedCategory: propSelectedCategory, selectedDrawing: propSelectedDrawing } = props;
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedDrawing, setSelectedDrawing] = useState<string>('');
    const [drawings, setDrawings] = useState<DrawingComponent[] | null>(null);

    useEffect(() => {
        if (propSelectedCategory !== '') {
            setSelectedCategory(propSelectedCategory);
        }
    }, [propSelectedCategory]);

    useEffect(() => {
        if (selectedCategory !== '') {
            const newDrawings = getCategoryDrawings(selectedCategory);
            setDrawings(newDrawings);
        } else {
            setDrawings(null);
        }
    }, [selectedCategory, getCategoryDrawings]);

    useEffect(() => {
        if (propSelectedDrawing !== '' && drawings) {
            setSelectedDrawing(propSelectedDrawing);
        }
    }, [propSelectedDrawing, drawings]);

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const newCategory = event.target.value;
        setSelectedCategory(newCategory);
        setSelectedDrawing('');
        getVariableDrawings(newCategory, '');
    };

    const handleDrawingChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const newDrawing = event.target.value;
        setSelectedDrawing(newDrawing);
        getVariableDrawings(selectedCategory, newDrawing);
    };

    return (
        <div className="relative inline-block text-left">
            <select
                id="dropdown-category"
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
                    id="dropdown-drawing"
                    value={selectedDrawing}
                    onChange={handleDrawingChange}
                    className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
                >
                    <option value="">-- For category {selectedCategory}, draw when: drawing? --</option>
                    {drawings?.map((drawing, index) => (
                        <option key={index} value={drawing.drawingName}>{drawing.drawingName}</option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default Dropdown;
