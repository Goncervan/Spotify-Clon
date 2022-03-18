import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Prueba from './Components/Prueba';
const code = new URLSearchParams(window.location.search).get('code')


function App() {
  return (
    <HashRouter>
      <Routes>
        <Route exact path='/' element={<Login />} />
        {/* <Route path='/dashboard' element={<Dashboard code={code} />} />
        <Route exact path='/dashboard' element={<Dashboard code={code} />} /> */}
        <Route path='/#/dashboard' element={<Dashboard code={code} />} />
        {/* <Route exact path='/#/dashboard' element={<Dashboard code={code} />} />
        <Route exact path='/Prueba' element={<Prueba/>}/> */}
      </Routes>
    </HashRouter>
  )
}

export default App;
