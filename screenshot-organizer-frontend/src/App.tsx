import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;