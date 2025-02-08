import { useEffect, useRef, useState } from 'react'

import LanguageSelector from './components/LanguageSelector';
import Progress from './components/Progress';

import { ArrowRightLeft, Loader2, Globe } from 'lucide-react';

function App() {
  const worker = useRef(null);

  const [ready, setReady] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [progressItems, setProgressItems] = useState([]);

  const [input, setInput] = useState('I love walking my dog.');
  const [sourceLanguage, setSourceLanguage] = useState('eng_Latn');
  const [targetLanguage, setTargetLanguage] = useState('fra_Latn');
  const [output, setOutput] = useState('');

  useEffect(() => {
    worker.current ??= new Worker(new URL('./worker.js', import.meta.url), {
      type: 'module'
    });

    const onMessageReceived = (e) => {
      switch (e.data.status) {
        case 'initiate':
          setReady(false);
          setProgressItems(prev => [...prev, e.data]);
          break;

        case 'progress':
          setProgressItems(
            prev => prev.map(item => {
              if (item.file === e.data.file) {
                return { ...item, progress: e.data.progress }
              }
              return item;
            })
          );
          break;

        case 'done':
          setProgressItems(
            prev => prev.filter(item => item.file !== e.data.file)
          );
          break;

        case 'ready':
          setReady(true);
          break;

        case 'update':
          setOutput(o => o + e.data.output);
          break;

        case 'complete':
          setDisabled(false);
          break;
      }
    };

    worker.current.addEventListener('message', onMessageReceived);

    return () => worker.current.removeEventListener('message', onMessageReceived);
  });

  const translate = () => {
    setDisabled(true);
    setOutput('');
    worker.current.postMessage({
      text: input,
      src_lang: sourceLanguage,
      tgt_lang: targetLanguage,
    });
  }

  return (
    <div className="min-h-screen bg-[#fdf0d5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-[#003049] mb-2 flex items-center justify-center">
          <Globe className="mr-2" size={36} color="#003049" />
          Transformers.js
        </h1>
        <h2 className="text-xl text-center text-[#c1121f] mb-8">ML-powered multilingual translation in React!</h2>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border-2 border-[#003049]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <LanguageSelector
              type="Source"
              defaultLanguage="eng_Latn"
              onChange={(x) => setSourceLanguage(x.target.value)}
            />
            <LanguageSelector
              type="Target"
              defaultLanguage="fra_Latn"
              onChange={(x) => setTargetLanguage(x.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-2 border-2 border-[#003049] rounded-md focus:ring-2 focus:ring-[#c1121f] focus:border-transparent"
              rows={4}
              placeholder="Enter text to translate"
            ></textarea>
            <textarea
              value={output}
              readOnly
              className="w-full p-2 bg-[#fdf0d5] border-2 border-[#003049] rounded-md"
              rows={4}
              placeholder="Translation will appear here"
            ></textarea>
          </div>

          <button
            disabled={disabled}
            onClick={translate}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#c1121f] hover:bg-[#003049] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c1121f] transition-colors duration-200 flex items-center justify-center ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {disabled ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : (
              <ArrowRightLeft className="mr-2" size={20} />
            )}
            Translate
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 border-2 border-[#003049]">
          {ready === false && (
            <p className="text-center text-[#c1121f] mb-4 flex items-center justify-center">
              <Loader2 className="animate-spin mr-2" size={20} />
              Loading models... (only run once)
            </p>
          )}
          {progressItems.map((data) => (
            <div key={data.file} className="mb-4">
              <Progress text={data.file} percentage={data.progress} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
