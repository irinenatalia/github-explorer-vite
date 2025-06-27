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
          <li key={repo.id} className="mb-3 p-3 bg-gray-200 rounded">
            <div className='flex justify-between gap-2'>
              <div>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-black hover:underline"
                >
                  {repo.name}
                </a>
                <p className="text-sm">{repo.description || '-'}</p>
              </div>
              <div>
                <p className="text-sm mt-1 flex align-center gap-1">
                  {repo.stargazers_count} 
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                  </svg>
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Repository;
