import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { documentUrlSlice } from './redux/slices/documentUrlSlice';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const mystore = configureStore({
  reducer: combineSlices(documentUrlSlice)
})
root.render(
  <BrowserRouter>
    <Provider store={mystore}>
      <App></App>
    </Provider>
  </BrowserRouter>

);


reportWebVitals();
