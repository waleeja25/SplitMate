import { createBrowserRouter } from 'react-router-dom';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import SignUp from './components/pages/SignUp';
import Dashboard from './components/pages/Dashboard';
import NavBar from './components/ui/NavBar';
import CreateGroup from './components/groups/CreateGroup';
import MyFriends from './components/friends/MyFriends';
import MyGroups from './components/groups/MyGroups';
import AddExpense from './components/expenses/AddExpense';
import AllExpenses from './components/expenses/AllExpenses';

import { displayList } from './components/ui/displayList';

// We’ll receive friends/groups as props from App.jsx
export const getRouter = (friends, setFriends, groups, setGroups) =>
  createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/login',
      element: (
        <>
          <NavBar />
          <Login />
        </>
      ),
    },
    {
      path: '/signup',
      element: (
        <>
          <NavBar />
          <SignUp />
        </>
      ),
    },
    {
      path: '/dashboard',
      element: <Dashboard />,
    },
    {
      path: '/createGroup',
      element: (
        <CreateGroup friends={friends} groups={groups} setGroups={setGroups} />
      ),
    },
    {
      path: '/myFriends',
      element: (
        <MyFriends
          friends={friends}
          setFriends={setFriends}
          displayList={displayList}
        />
      ),
    },
    {
      path: '/myGroups',
      element: (
        <MyGroups
          groups={groups}
          setGroups={setGroups}
          displayList={displayList}
          friends={friends}
        />
      ),
    },
    {
      path: '/addExpense',
      element: <AddExpense groups={groups} />,
    },
    {
      path: '/allExpenses',
      element: <AllExpenses />,
    },
  ]);
