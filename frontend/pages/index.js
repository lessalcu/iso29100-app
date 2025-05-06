import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [caseStudy, setCaseStudy] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [iaSolution, setIaSolution] = useState('');
  const [comparison, setComparison] = useState('');

  const getCase = async () => {
    const res = await axios.get('http://localhost:8000/case');
    setCaseStudy(res.data.case_study);
    setManualInput('');
    setIaSolution('');
    setComparison('');
  };

  const getSolution = async () => {
    const res = await axios.post('http://localhost:8000/solve', { case_study: caseStudy });
    setIaSolution(res.data.ia_solution);
  };

  const compareAnswers = async () => {
    const res = await axios.post('http://localhost:8000/compare', {
      manual_response: manualInput,
      case_study: caseStudy,
      ia_solution: iaSolution
    });
    setComparison(res.data.comparison);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-4xl w-full space-y-6">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-4">
          🛡️ ISO/IEC 29100 - Casos de Estudio
        </h1>

        {/* Botón para generar caso */}
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full text-lg transition"
          onClick={getCase}
        >
          Generar Caso de Estudio
        </button>

        {/* Mostrar caso solo si existe */}
        {caseStudy && (
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-300 shadow-sm prose max-w-none">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">Caso Generado</h2>
            <ReactMarkdown>{caseStudy}</ReactMarkdown>
          </div>
        )}

        {/* Mostrar textarea y botones solo si ya hay un caso */}
        {caseStudy && (
          <>
            <textarea
              className="w-full border border-gray-300 p-3 rounded-lg mt-4"
              rows="8"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Escribe tu solución manual aquí..."
            />

            <div className="flex space-x-4 mt-4">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex-1 transition"
                onClick={getSolution}
              >
                Obtener Solución IA
              </button>
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex-1 transition"
                onClick={compareAnswers}
                disabled={!iaSolution}
              >
                Comparar Respuestas
              </button>
            </div>
          </>
        )}

        {/* Mostrar solución IA si ya fue generada */}
        {iaSolution && (
          <div className="bg-green-50 p-4 rounded-xl border border-green-300 shadow-sm prose max-w-none mt-4">
            <h2 className="text-xl font-semibold text-green-700 mb-2">Solución IA</h2>
            <ReactMarkdown>{iaSolution}</ReactMarkdown>
          </div>
        )}

        {/* Mostrar comparación si ya existe */}
        {comparison && (
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-300 shadow-sm prose max-w-none mt-4">
            <h2 className="text-xl font-semibold text-purple-700 mb-2">Resultado de Comparación</h2>
            <ReactMarkdown>{comparison}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
