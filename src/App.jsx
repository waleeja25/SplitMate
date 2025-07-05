import './App.css'
import Home from './components/Home';
import NavBar from './components/NavBar'
import Login from './components/Login';
import SignUp from './components/SignUp'
import {createBrowserRouter, RouterProvider} from "react-router-dom";

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
