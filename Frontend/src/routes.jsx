import { createBrowserRouter } from 'react-router-dom';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import SignUp from './components/pages/SignUp';
import Dashboard from './components/pages/Dashboard';
import NavBar from './components/ui/NavBar';
import CreateGroup from './components/groups/CreateGroup';
import MyFriends from './components/groups/MyFriends';
import MyGroups from './components/groups/MyGroups';
import SettleUp from './components/dashboard/settleUp';
import AllExpenses from './components/expenses/AllExpenses';
import AddExpenseForm from './components/expenses/AddExpense/AddExpenseForm';
import IndividualExpensesCard from './components/expenses/IndividualExpensesCard';
import { displayList } from './components/ui/displayList';
import GroupExpensesCard from './components/expenses/GroupExpensesCard'

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
    }, {
path: '/myFriends/:friendName',
element: <IndividualExpensesCard friends={friends} />,

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
    }, {
path: '/myGroups/:groupName',
element: <GroupExpensesCard groups={groups} />,

},
    {
      path: '/addExpense',
      element: <AddExpenseForm groups={groups} friends={friends}/>,
    },
    {
      path: '/allExpenses',
      element: <AllExpenses />,
    },
    {
      path: '/settleUp',
      element: <SettleUp groups={groups} friends={friends}/>

    },
  ]);
