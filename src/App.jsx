import './App.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { useEffect, useState } from 'react';
import Home from './components/Home';
import NavBar from './components/NavBar'
import Login from './components/Login';
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard';
import CreateGroup from './components/CreateGroup'
import DashboardNavbar from './components/DashboardNavbar'
import MyFriends from './components/MyFriends';
import MyGroups from './components/MyGroups';
import { displayList } from './utils/displayList';

function App() {
   const [friends, setFriends] = useState(() => {
    try {
      const stored = localStorage.getItem('friends');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('friends', JSON.stringify(friends));
  }, [friends]);

  const [groups, setGroups] = useState(() => {
    try{
      const storedGroups = localStorage.getItem('groups');
      return storedGroups ? JSON.parse(storedGroups) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('groups', JSON.stringify(groups));
  }, [groups]);



  const router = createBrowserRouter (
    [
      {
        path: '/',
        element: 
        <div>
          <Home />
          {/* <NavBar /> */}
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
        </div>,
      } , {
        path : '/createGroup',
        element:
        <div>
          <CreateGroup friends={friends} groups={groups} setGroups={setGroups}/>
        </div>
      } , {
        path: '/myFriends',
        element:
        <div>
          <MyFriends friends={friends} setFriends={setFriends} displayList={displayList} />
        </div>
      } , {
        path: 'myGroups',
        element:
        <div>
          <MyGroups groups={groups} setGroups={setGroups} displayList={displayList} friends={friends}/>
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
