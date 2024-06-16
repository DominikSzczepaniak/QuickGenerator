import Navbar from "./components/Navbar";
import Category from "./components/Category";
import { useState } from 'react';
import { DrawingComponent } from "./Types";

interface CategoryProps {
  id: number;
  ppbSwitch: boolean;
  drawings: DrawingComponent[];
  name: string;
}

function App() {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [drawCompleted, setDrawCompleted] = useState(false);
  const [results, setResults] = useState<string[][]>([]);

  const addCategory = () => {
    setCategories([...categories, { id: categories.length, ppbSwitch: false, drawings: [], name: "Type the name of this category..." }]);
  };

  const updateCategoryDrawings = (categoryId: number, drawings: DrawingComponent[]) => {
    const updatedCategories = categories.map((category) =>
      category.id === categoryId ? { ...category, drawings } : category
    );
    setCategories(updatedCategories);
  };

  function drawAnswers(categories: CategoryProps[]): [string, string][] {
    let answers: string[] = [];
    for (let i = 0; i < categories.length; i++) {
      const drawings = categories[i].drawings;
      console.log(drawings)
      if (categories[i].ppbSwitch) {
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
          return [];
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
            answers.push(drawings[k].inputValue);
            break;
          }
        }
      } else {

        let elements: [number, string][] = [];
        let sum = 0;
        for (let j = 0; j < drawings.length; j++) {
          elements.push([Number(drawings[j].countValue), drawings[j].inputValue]);
          sum += Number(drawings[j].countValue);
        }
        console.log(sum)
        console.log(elements)
        let random = Math.random() * sum;
        let counter = 0;
        for (let j = 0; j < elements.length; j++) {
          counter += elements[j][0];
          if (counter >= random) {
            answers.push(elements[j][1]);
            break;
          }
        }
      }
    }
    let results: [string, string][] = [];
    for (let i = 0; i < answers.length; i++) {
      results.push([categories[i].name, answers[i]]);
    }
    console.log(answers);
    return results;
  }
  

  const handleDrawClick = () => {
    let answers = drawAnswers(categories);
    if (answers.length > 0) {
      setResults(answers);
      setDrawCompleted(true);
    }
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
              Reset
            </button>
          </div>
        ) : (
          categories.map((category) => (
            <Category
              key={category.id}
              id={category.id}
              deleteCategory={(id: number) => {
                setCategories(categories.filter((category) => category.id !== id));
              }}
              updateCategoryDrawings={updateCategoryDrawings}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
