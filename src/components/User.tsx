import React, { useState, useEffect, KeyboardEvent } from 'react';
import Repository from './Repository';

interface User {
  login: string;
  id: number;
}

const Users: React.FC = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = import.meta.env.VITE_GITHUB_TOKEN;

  const searchUsers = async () => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.github.com/search/users?q=${encodeURIComponent(query)}&per_page=5`, {
          method: 'GET',
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.items || []);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchUsers();
    }
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Enter username"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full p-2 border border-gray-300 rounded mb-2"
        aria-label="GitHub username"
      />
      <button
        onClick={searchUsers}
        disabled={loading}
        className="w-full text-white px-3.5 py-2.5 text-sm font-semibold hover:bg-[#0e7cb9] disabled:opacity-50 bg-[#2c9ddb]"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {users.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 font-semibold">Showing users for "{query}"</p>
          <div className=''>
            {users.map((user) => (
              <div key={user.id} className="mb-2">
                <button
                  onClick={() => onSelectUser(user.login)}
                  className="w-full text-left p-2 border border-gray-300 rounded hover:bg-gray-100"
                  aria-label={`Select user ${user.login}`}
                >
                  {user.login}
                </button>

                <div>
                  <Repository username={user.login} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
