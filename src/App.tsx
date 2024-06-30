// import Navbar from "./components/Navbar";
import Category from "./components/Category";
import { useRef, useState } from 'react';

interface CategoryProps {
  id: number;
  name: string;
  handleDraw: () => [string, string];
}

//TODO
// 1. Add conditionals to drawing
// 2. Make reading the website easier
// 3. Change style of it, add dark theme
// 4. Make tests
// 5. Allow user to reroll, dont just reset

function App() {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [drawCompleted, setDrawCompleted] = useState(false);
  const [results, setResults] = useState<string[][]>([]);
  let handleDrawFunctions = useRef<{ id: number, handleDraw: () => [string, string] }[]>([]).current;
  let saveDataFunctions = useRef<{ id: number, saveData: () => { name: string, drawings: { ppbValue: string, countValue: string, inputValue: string }[] } }[]>([]).current;
  let loadDataFunctions = useRef<{ id: number, loadData: (data: { name: string, drawings: { ppbValue: string, countValue: string, inputValue: string }[] }) => void }[]>([]).current;

  const addCategory = () => {
    setCategories([...categories, { id: categories.length, name: "Type the name of this category...", handleDraw: () => ["", ""] }]);
  };

  function drawAnswers(): [string, string][] {
    const results = handleDrawFunctions.map(fn => fn.handleDraw());
    return results;
  }

  const registerHandleDraw = (id: number, handleDraw: () => [string, string]) => {
    let current = handleDrawFunctions.filter(fn => fn.id !== id);
    current.push({ id, handleDraw });
    handleDrawFunctions = current;
  }

  const registerSaveData = (id: number, saveData: () => { name: string, drawings: { ppbValue: string, countValue: string, inputValue: string }[] }) => {
    let current = saveDataFunctions.filter(fn => fn.id !== id);
    current.push({ id, saveData });
    saveDataFunctions = current;
  }

  const registerLoadData = (id: number, loadData: (data: { name: string, drawings: { ppbValue: string, countValue: string, inputValue: string }[] }) => void) => {
    let current = loadDataFunctions.filter(fn => fn.id !== id);
    current.push({ id, loadData });
    loadDataFunctions = current;
  }

  const handleDrawClick = () => {
    let answers = drawAnswers();
    if (answers.length > 0) {
      setResults(answers);
      setDrawCompleted(true);
    }
  };

  const saveInfo = () => {
    let data = saveDataFunctions.map(fn => fn.saveData());
    let dataString = JSON.stringify(data, null, 2);

    const blob = new Blob([dataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();

    URL.revokeObjectURL(url);
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          loadData(json);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const loadData = (data: { name: string, drawings: { ppbValue: string, countValue: string, inputValue: string }[] }[]) => {
    const newCategories = data.map((category, index) => ({
      id: index,
      name: category.name,
      handleDraw: () => ["", ""] as [string, string],
      drawings: []
    }));

    setCategories(newCategories);

    newCategories.forEach((category, index) => {
      if (loadDataFunctions[index]) {
        loadDataFunctions[index].loadData(category);
      }
    });
  };

  return (
    <div>
      {/* <Navbar /> */}
      <div className="p-4">
        {drawCompleted ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Summary of Results</h2>
            <ul className="list-disc pl-5">
              {results.map((result, index) => (
                <li key={index} className="mb-2">
                  <strong>Category:</strong> {result[0]} - <strong>Result:</strong> {result[1]}
                </li>
              ))}
            </ul>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={() => setDrawCompleted(false)}
            >
              Go back and lose result of this draw
            </button>
          </div>
        ) : (
          <div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={addCategory}
            >
              Add category
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => saveInfo()}
            >
              Save
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              Load
            </button>
            <input
              id="fileInput"
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
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
                registerHandleDraw={registerHandleDraw}
                registerSaveData={registerSaveData}
                registerLoadData={registerLoadData}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
