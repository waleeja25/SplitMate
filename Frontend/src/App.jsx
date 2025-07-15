import './App.css';
import { RouterProvider } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getRouter } from './routes';

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
    try {
      const storedGroups = localStorage.getItem('groups');
      return storedGroups ? JSON.parse(storedGroups) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('groups', JSON.stringify(groups));
  }, [groups]);

  const router = getRouter(friends, setFriends, groups, setGroups);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
