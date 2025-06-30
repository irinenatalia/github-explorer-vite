import './App.css'
import User from './components/User';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-black p-4 max-w-md mx-auto">
      <User />
    </div>
  );
};

export default App;
