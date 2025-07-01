import React from 'react';
import logo from './logo.svg';
import './App.css';
import DocumentFlow from './components/DocumentFlow/DocumentFlow';
import DigitlSignature from './components/DigitlSignature/DigitlSignature';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<DocumentFlow></DocumentFlow>}></Route>
        <Route path='/signature/:id' element={<DigitlSignature></DigitlSignature>}></Route>

      </Routes>
    </div>
  );
}

export default App;
