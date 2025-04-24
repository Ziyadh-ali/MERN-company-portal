import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from "./store/store.tsx"
import { ChatProvider } from './context/chatContext.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider store={store}>
      <ChatProvider>
        <App />
      </ChatProvider>
    </Provider>
  </BrowserRouter>
)
