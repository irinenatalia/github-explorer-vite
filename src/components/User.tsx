import React, { useState, KeyboardEvent } from 'react';
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
  const [expandedUserById, setExpandedUserById] = useState(-1);
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

  const onSelectUser = (userId: number) => {
    expandedUserById == userId? setExpandedUserById(-1) : setExpandedUserById(userId);
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
        className="w-full text-white px-3.5 py-2.5 text-sm font-semibold hover:bg-[#0e7cb9] disabled:opacity-50 bg-[#2c9ddb] cursor-pointer"
      >
        {loading ? (
          <div
  className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
  role="status">
    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Searching</span>
    </div>
          ) : 'Search'}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {users.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 font-semibold">Showing users for "{query}"</p>
          <div>
            {users.map((user) => (
              <div key={user.id} className="mb-2">
                <button
                  onClick={() => onSelectUser(user.id)}
                  className="w-full p-2 bg-gray-100 rounded hover:bg-gray-200 flex justify-between"
                >
                  {user.login}
                  {
                    expandedUserById == user.id? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    )
                  }
                </button>

                <div className={expandedUserById == user.id ? 'block' : 'hidden'}>
                  <Repository username={user.login} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {users.length == 0 && (
        <div className="mt-4">
          <p className="mb-2 font-semibold">User not found.</p>
        </div>
      )}
    </div>
  );
};

export default Users;
