import './Home.css'
import Match from './Match.tsx'
import Profile from './Profile.tsx'
import UsersPage from './UsersPage.tsx'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


function Home() {

  return (
    <>
   <Router>
      <div className="app-container">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/match">Match</Link>
          <Link to="/profile">My Profile</Link>
        </nav>
        
        <Routes>
        <Route path="/" element={<UsersPage />} />
        <Route path="/match" element={<Match />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      <h2>Welcome to Roommate Matching App</h2>


      </div>
    </Router>
    </>
  )
}

export default Home
