import { Calculator } from "lucide-react";
import { useState } from "react";

const gradePoints = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  D: 1.0,
  F: 0.0,
};

export default function GPACalculator() {
  const [subjects, setSubjects] = useState([
    { course: "", credit: 3, grade: "A" },
  ]);

  const [gpa, setGPA] = useState(null);

  const handleChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] =
      field === "credit" ? Number(value) : value;
    setSubjects(updated);
  };

  const addSubject = () => {
    setSubjects([
      ...subjects,
      { course: "", credit: 3, grade: "A" },
    ]);
  };

  const removeSubject = (index) => {
    const updated = subjects.filter((_, i) => i !== index);
    setSubjects(updated);
  };

  const calculateGPA = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    subjects.forEach((subject) => {
      totalCredits += subject.credit;
      totalPoints += gradePoints[subject.grade] * subject.credit;
    });

    if (totalCredits === 0) {
      setGPA(0);
      return;
    }

    setGPA((totalPoints / totalCredits).toFixed(2));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">
        GPA Calculator
      </h1>

      <p className="text-gray-600 mb-6">
        Enter your subjects, grades and credit hours to calculate GPA.
      </p>

      <div className="space-y-4">
        {subjects.map((subject, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white shadow rounded-lg p-4"
          >
            <input
              type="text"
              placeholder="Course Name"
              value={subject.course}
              onChange={(e) =>
                handleChange(index, "course", e.target.value)
              }
              className="border rounded-lg p-2"
            />

            <input
              type="number"
              min="1"
              max="6"
              value={subject.credit}
              onChange={(e) =>
                handleChange(index, "credit", e.target.value)
              }
              className="border rounded-lg p-2"
            />

            <select
              value={subject.grade}
              onChange={(e) =>
                handleChange(index, "grade", e.target.value)
              }
              className="border rounded-lg p-2"
            >
              {Object.keys(gradePoints).map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>

            <button
              onClick={() => removeSubject(index)}
              className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={addSubject}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          + Add Subject
        </button>

        <button
          onClick={calculateGPA}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
        >
          Calculate GPA
        </button>
      </div>

      {gpa !== null && (
        <div className="mt-8 bg-green-100 border border-green-300 rounded-xl p-6 text-center">
          <h2 className="text-2xl font-bold text-green-700">
            Your GPA
          </h2>

          <p className="text-5xl font-extrabold mt-3">
            {gpa}
          </p>
        </div>
      )}
    </div>
  );
}