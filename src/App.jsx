
import './App.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from './components/Home';
import NavBar from './components/NavBar'
import Login from './components/Login';
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard';

function App() {

  const router = createBrowserRouter (
    [
      {
        path: '/',
        element: 
        <div>
          <Home />
          <NavBar />
        </div>
      }, {
        path: '/login',
        element :
        <div>
          <NavBar />
          < Login />
        </div>
      } , {
        path: '/signup',
        element : 
        <div>
          <NavBar />
          <SignUp />
        </div>
      } , {
        path : '/dashboard',
        element : 
        <div>
          <Dashboard />
        </div>
      }
    ]
  )
  return (
    <>
      <div>
        <RouterProvider router={router} />
    </div>
    </>
  )
}

export default App
