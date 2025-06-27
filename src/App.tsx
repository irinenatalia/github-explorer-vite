import { useState } from 'react'
import './App.css'
import User from './components/User';
import Repository from './components/Repository';

const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white text-black p-4 max-w-md mx-auto">
      <User />
    </div>
  );
};

export default App;
