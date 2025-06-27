import React, { useEffect, useState } from 'react';

interface Repo {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  html_url: string;
}

interface RepositoryProps {
  username: string;
}

const Repository: React.FC<RepositoryProps> = ({ username }) => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.github.com/users/${encodeURIComponent(username)}/repos`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }
        const data = await response.json();
        setRepos(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
        setRepos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username]);

  if (loading) {
    return <p>Loading repositories...</p>;
  }

  if (error) {
    return <p className="text-red-600">Error: {error}</p>;
  }

  if (repos.length === 0) {
    return <p className="pl-4 mt-2">No repositories found.</p>;
  }

  return (
    <div className="pl-4 mt-4">
      <ul>
        {repos.map((repo) => (
          <li key={repo.id} className="mb-3 p-3 border border-gray-300 rounded bg-gray-100">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-black hover:underline"
            >
              {repo.name}
            </a>
            <p className="text-sm">{repo.description || 'No description'}</p>
            <p className="text-sm mt-1">⭐ {repo.stargazers_count}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Repository;
