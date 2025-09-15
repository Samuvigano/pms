
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('Main.jsx is loading...')
console.log('App component:', App)

const rootElement = document.getElementById("root")
console.log('Root element:', rootElement)

if (rootElement) {
  console.log('Creating React root and rendering App...')
  createRoot(rootElement).render(<App />)
} else {
  console.error('Root element not found!')
}
