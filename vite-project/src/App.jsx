import AdminPage from './components/AdminPage.jsx';
import SearchPage from './components/SearchPage.jsx'

import axios from 'axios';

function App() {
  return (
    <div className="App">
      <SearchPage />
    </div>
  );
}

export default App



export const axiosInstance = axios.create({
    baseURL : 'http://localhost:8080'
});