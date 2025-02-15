//app
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Study } from './pages/Study';
import { Recent } from './pages/Recent';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="study/:id" element={<Study />} />
          <Route path="recent" element={<Recent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;