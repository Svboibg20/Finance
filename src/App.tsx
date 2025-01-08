import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { Home } from './pages/Home'
import { Dashboard } from './pages/Dashboard'
import { Transactions } from './pages/Transactions'
import { Budget } from './pages/Budget'
import { BottomNav } from './components/bottom-nav'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col">
        <main className="container mx-auto px-4 pt-4 pb-20 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budget" element={<Budget />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  )
}

export default App

