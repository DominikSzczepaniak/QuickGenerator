import Navbar from "./components/Navbar";
import Category from "./components/Category";
import { useState } from 'react';

interface CategoryProps {
  id: number;
}

function App() {
  const [categories, setCategories] = useState<CategoryProps[]>([]);

  const addCategory = () => {
    setCategories([...categories, { id: categories.length }]);
  };

  const handleDrawClick = () => {
    // Obsługa kliknięcia przycisku "Draw"
    console.log("Drawing...");
  };

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={addCategory}
        >
          Add category
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleDrawClick}
        >
          Draw
        </button>
        {categories.map((category) => (
          <Category
            key={category.id}
            id={category.id}
            deleteCategory={(id: number) => {
              setCategories(categories.filter((category) => category.id !== id));
            }}
          />
        ))}

      </div>
    </div>
  );
}

export default App;
