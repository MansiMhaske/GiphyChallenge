import { useState, useEffect } from 'react';
import './App.css';

const API_KEY = 'ftKFYFeI1XUzGWqjg9IZPoHhSYCIobQ0';
const TRENDING_URL = `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=10&offset=`;
const SEARCH_URL = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&limit=10&q=`;

function App() {
  const [gifs, setGifs] = useState([] as any);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isSearching) {
      fetchTrendingGifs();
    }
  }, [offset]);

  const fetchTrendingGifs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${TRENDING_URL}${offset}`);
      const data = await response.json();
      setGifs((prevGifs: any) => {
        const uniqueGifs = [...new Map([...prevGifs, ...data.data].map(gif => [gif.id, gif])).values()];
        return uniqueGifs;
      });
    } catch (error) {
      console.error('Error fetching trending GIFs:', error);
    }
    setLoading(false);
  };

  const handleSearch = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setLoading(true);
    setIsSearching(true);
    setOffset(0);
    setGifs([]); // Empty the list before search
    try {
      const response = await fetch(`${SEARCH_URL}${searchTerm}&offset=0`);
      const data = await response.json();
      setGifs(data.data);
    } catch (error) {
      console.error('Error searching GIFs:', error);
    }
    setLoading(false);
  };

  const loadMore = () => {
    setOffset((prevOffset) => prevOffset + 10);
  };

  return (
    <div className="App">
      <h1>Giphy Explorer</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for GIFs..."
        />
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading...</p>}
      <div className="gif-container">
        {gifs.map((gif: any) => (
          <img key={gif.id} src={gif.images.fixed_height.url} alt={gif.title} />
        ))}
      </div>
      {!loading && !isSearching && <button onClick={loadMore}>Load More</button>}
    </div>
  );
}

export default App;
