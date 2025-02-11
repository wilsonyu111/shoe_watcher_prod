import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import store from "./asics_components/app/store"
import { Provider } from 'react-redux';
import Asics from './asics_components/Asics'
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <BrowserRouter>< Asics/></BrowserRouter>
      
  </Provider>

)
