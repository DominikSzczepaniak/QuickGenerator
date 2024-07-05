// import Navbar from "./components/Navbar";
import { DrawingComponent } from "./Types";
import Category from "./components/Category";
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Modal from "./components/Modal";

interface CategoryProps {
  id: string;
  name: string;
  variableCategory: string;
  variableDrawing: string;
  handleDraw: () => [string, string];
  getDrawings: () => [];
}

//TODO
// 2. Make reading the website easier
// 3. Change style of it, add dark theme
// 4. Make tests
// 6. When creating a category make user input a name that is not taken
// 10. Throw exception to JSON if something is not right
// 12. Variable drawing has error when loading data - something is not right

function App() {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [drawCompleted, setDrawCompleted] = useState(false);
  const [results, setResults] = useState<string[][]>([]);
  const [showFaq, setShowFaq] = useState(false);
  const [dataToLoad, setDataToLoad] = useState<{ name: string, variableCategory: string, variableDrawing: string, drawings: { ppbValue: string, countValue: string, drawingName: string }[] }[]>([]);
  let handleDrawFunctions = useRef<{ id: string, handleDraw: () => [string, string] }[]>([]).current;
  let saveDataFunctions = useRef<{ id: string, saveData: () => { name: string, variableCategory: string, variableDrawing: string, drawings: { ppbValue: string, countValue: string, drawingName: string }[] } }[]>([]).current;
  let loadDataFunctions = useRef<{ id: string, loadData: (data: { name: string, variableCategory: string, variableDrawing: string, drawings: { ppbValue: string, countValue: string, drawingName: string }[] }) => void }[]>([]).current;
  let getDrawingsFunctions = useRef<{ id: string, getDrawings: () => DrawingComponent[] }[]>([]).current;

  const addCategory = () => {
    setCategories([...categories, { id: uuidv4(), name: "Type the name of this category...", variableCategory: "", variableDrawing: "", handleDraw: () => ["", ""], getDrawings: () => [] }]);
  };

  function drawAnswers(): [string, string][] {
    const results = handleDrawFunctions.map(fn => fn.handleDraw());
    return results;
  }

  const registerHandleDraw = (id: string, handleDraw: () => [string, string]) => {
    let current = handleDrawFunctions.filter(fn => fn.id !== id);
    current.push({ id, handleDraw });
    handleDrawFunctions = current;
  }

  const registerSaveData = (id: string, saveData: () => { name: string, variableCategory: string, variableDrawing: string, drawings: { ppbValue: string, countValue: string, drawingName: string }[] }) => {
    let current = saveDataFunctions.filter(fn => fn.id !== id);
    current.push({ id, saveData });
    saveDataFunctions = current;
  }

  const registerLoadData = (id: string, loadData: (data: { name: string, variableCategory: string, variableDrawing: string, drawings: { ppbValue: string, countValue: string, drawingName: string }[] }) => void) => {
    let current = loadDataFunctions.filter(fn => fn.id !== id);
    current.push({ id, loadData });
    loadDataFunctions = current;
  }

  const registerGetDrawings = (id: string, getDrawings: () => DrawingComponent[]) => {
    let current = getDrawingsFunctions.filter(fn => fn.id !== id);
    current.push({ id, getDrawings });
    getDrawingsFunctions = current;
  }

  const handleDrawClick = () => {
    let answers = drawAnswers();
    for (let draw of answers) { //draw is [categoryName, drawName]
      let cat = categories.find(category => category.name === draw[0])
      if (cat?.variableCategory !== "" && cat?.variableDrawing !== "") {
        let drawingDepended = answers.find(answer => answer[0] === cat?.variableCategory);
        if (drawingDepended) {
          if (drawingDepended[1] !== draw[1]) { //if drawing depended on this draw is different, delete this draw from answers
            answers = answers.filter(answer => answer[0] !== draw[0]);
          }
        }
      }
    }
    if (answers.length > 0) {
      saveInfo(false);
      setResults(answers);
      setDrawCompleted(true);
    }
  };

  const saveInfo = (toFile: boolean) => {
    let data = saveDataFunctions.map(fn => fn.saveData());
    if (toFile) {
      saveDataToFile(data);
    }
    else {
      localStorage.setItem('data', JSON.stringify(data, null, 2));
    }
  }

  const saveDataToFile = (data: { name: string, variableCategory: string, variableDrawing: string, drawings: { ppbValue: string, countValue: string, drawingName: string }[] }[]) => {
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

  const loadData = (data: { name: string, variableCategory: string, variableDrawing: string, drawings: { ppbValue: string, countValue: string, drawingName: string }[] }[]) => {
    //we create x new dummy categories that we later fill out with correct data
    const newCategories = data.map((category) => ({
      id: uuidv4(),
      name: category.name,
      variableCategory: "",
      variableDrawing: "",
      handleDraw: () => ["", ""] as [string, string],
      getDrawings: () => [] as [],
      drawings: []
    }));

    setCategories(newCategories);
    setDataToLoad(data);
  };

  useEffect(() => {
    if (localStorage.getItem('data') && !drawCompleted) {
      const data = JSON.parse(localStorage.getItem('data') as string);
      localStorage.removeItem('data');
      loadData(data);
    }
  });

  useEffect(() => {
    if (dataToLoad.length > 0) {
      dataToLoad.forEach((category, index) => {
        if (loadDataFunctions[index]) {
          loadDataFunctions[index].loadData(category);
        }
      });
      setDataToLoad([]);
    }
  });

  const getCategoryDrawings = (categoryName: string) => {
    const category = categories.find(category => category.name === categoryName);
    if (category) {
      const getDrawingsFunction = getDrawingsFunctions.find(fn => fn.id === category.id);
      if (getDrawingsFunction) {
        return getDrawingsFunction.getDrawings();
      }
    }
    return null;
  };

  const getCategoriesNames = (excludeName: string) => {
    let names = new Set(categories.map(category => category.name));
    names.delete(excludeName);
    return Array.from(names);
  }

  const closeModal = () => {
    setShowFaq(false);
  }

  const toggleModal = () => {
    setShowFaq(!showFaq);
  }

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
            <div className="sticky top-0 w-full bg-gray-400">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={addCategory}
              >
                Add category
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => saveInfo(true)}
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
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleDrawClick}
              >
                Draw
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded float-right"
                onClick={toggleModal}>
                FAQ
              </button>
            </div>
            <Modal show={showFaq} onClose={closeModal}>
              <div className="bg-gray-600 text-white rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">What is this website for?</h3>
                  <p className="mb-4">
                    For every category you can add options to draw. Basic system of drawing is "count" - you type how many elements are in lotto, and then it's randomly picked. If there are 4 elements of type A and 1 element of type B then type A has 4/5 probability of picking.
                  </p>
                  <p>
                    Second mode is probability mode, where you just type probability what you want for some event. Note that probabilities have to sum to 1 at the moment of drawing.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">How to use variables?</h3>
                  <p className="mb-4">
                    Every category can be drawn based on another category answer. Let's consider example: you want to draw which escape room you will go to. But there is also drawing about where will you go and one of the option is escape room. Of course you don't want to draw which escape room to go to if escape room wasn't picked.
                  </p>
                  <p>
                    So in category "which escape room" you can choose that it will be drawn only if category "place to go" had result of "escape room", otherwise it's not drawn.
                  </p>
                </div>
              </div>
            </Modal>


            {categories.map((category) => (
              <Category
                key={category.id}
                id={category.id}
                deleteCategory={(id: string) => {
                  setCategories(categories.filter((category) => category.id !== id));
                  handleDrawFunctions = handleDrawFunctions.filter(fn => fn.id !== id);
                  saveDataFunctions = saveDataFunctions.filter(fn => fn.id !== id);
                  loadDataFunctions = loadDataFunctions.filter(fn => fn.id !== id);
                  getDrawingsFunctions = getDrawingsFunctions.filter(fn => fn.id !== id);
                }}
                handleNameChange={(id: string, newName: string) => {
                  setCategories(categories.map(category =>
                    category.id === id ? { ...category, name: newName } : category
                  ));
                }}
                handleVariablesChange={(id: string, newVariableCategory: string, newVariableDrawing: string) => {
                  setCategories(categories.map(category =>
                    category.id === id ? { ...category, variableCategory: newVariableCategory, variableDrawing: newVariableDrawing } : category
                  ));
                }}
                getCategoriesNames={getCategoriesNames}
                registerHandleDraw={registerHandleDraw}
                registerSaveData={registerSaveData}
                registerLoadData={registerLoadData}
                registerGetDrawings={registerGetDrawings}
                getCategoryDrawings={getCategoryDrawings}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
