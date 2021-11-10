import React from 'react'
import { DndProvider } from 'react-dnd-multi-backend'
import ReactDOM from 'react-dom'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom/'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import ReduxThunk from 'redux-thunk'
import App from './App'
import './index.css'
import rootReducer from './reducers/index'
import reportWebVitals from './reportWebVitals'
import { AnimatePresence } from 'framer-motion'

const composedEnhancer = composeWithDevTools(applyMiddleware(ReduxThunk))
const store = createStore(rootReducer, composedEnhancer)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <DndProvider options={HTML5toTouch}>
          <App />
        </DndProvider>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

reportWebVitals()
