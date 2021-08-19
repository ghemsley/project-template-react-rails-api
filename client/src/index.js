import React from 'react'
import { DndProvider } from 'react-dnd'
import ReactDOM from 'react-dom'
import MultiBackend from 'react-dnd-multi-backend'
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom/'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import ReduxThunk from 'redux-thunk'
import App from './App'
import './index.css'
import rootReducer from './reducers/index'
import reportWebVitals from './reportWebVitals'

const composedEnhancer = composeWithDevTools(applyMiddleware(ReduxThunk))
const store = createStore(rootReducer, composedEnhancer)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
          <App />
        </DndProvider>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
