import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './lib/firebase'

import { Home } from './pages/Home'
import { Dashboard } from './pages/Dashboard'
import { Transactions } from './pages/Transactions'
import { Budget } from './pages/Budget'
import { BottomNav } from './components/bottom-nav'
import { Auth } from './components/Auth'

function App() {
  const [user, loading] = useAuthState(auth)

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col">
        <Toaster />
        {user ? (
          <>
            <main className="container mx-auto px-4 pt-4 pb-20 flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/budget" element={<Budget />} />
              </Routes>
            </main>
            <BottomNav />
          </>
        ) : (
          <Auth />
        )}
      </div>
    </Router>
  )
}

export default App

