import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SearchResultPage from './pages/SearchResultPage'
import WordDetailPage from './pages/WordDetailPage'
import VocabularyPage from './pages/VocabularyPage'
import ReviewPage from './pages/ReviewPage'
import SettingsPage from './pages/SettingsPage'
import WelcomePage from './pages/WelcomePage'
import ImportPage from './pages/ImportPage'
import { Toast } from './components/Toast'

function App() {
  return (
    <Router>
      <Toast />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResultPage />} />
        <Route path="/word/:id" element={<WordDetailPage />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/import" element={<ImportPage />} />
      </Routes>
    </Router>
  )
}

export default App
