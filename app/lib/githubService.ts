
export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  bio: string;
}

export interface GitHubStats {
  totalStars: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  contributedTo: number;
  publicRepos: number;
  followers: number;
  following: number;
  longestStreak: number;
  currentStreak: number;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

class GitHubService {
  private baseUrl = 'https://api.github.com';
  private token: string = '';

  setToken(token: string) {
    this.token = token;
    if (token) {
      localStorage.setItem('github_token', token);
    } else {
      localStorage.removeItem('github_token');
    }
  }

  getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('github_token') || '';
    }
    return this.token;
  }

  private getHeaders() {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async getUser(username: string): Promise<GitHubUser | null> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${username}`, {
        headers: this.getHeaders(),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  async getUserRepos(username: string): Promise<any[]> {
    try {
      const repos: any[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore && page <= 10) { // Limit to 10 pages (1000 repos max)
        const response = await fetch(
          `${this.baseUrl}/users/${username}/repos?per_page=100&page=${page}&sort=updated`,
          { headers: this.getHeaders() }
        );

        if (!response.ok) break;

        const pageRepos = await response.json();
        if (pageRepos.length === 0) {
          hasMore = false;
        } else {
          repos.push(...pageRepos);
          page++;
        }
      }

      return repos;
    } catch (error) {
      console.error('Error fetching repos:', error);
      return [];
    }
  }

  async getTotalCommits(username: string): Promise<number> {
    try {
      const repos = await this.getUserRepos(username);
      let totalCommits = 0;

      // Sample a subset of repos to estimate total commits (to avoid rate limits)
      const sampleRepos = repos.slice(0, 20);

      for (const repo of sampleRepos) {
        try {
          const response = await fetch(
            `${this.baseUrl}/repos/${username}/${repo.name}/commits?author=${username}&per_page=1`,
            { headers: this.getHeaders() }
          );

          if (response.ok) {
            const linkHeader = response.headers.get('Link');
            if (linkHeader) {
              const match = linkHeader.match(/page=(\d+)>; rel="last"/);
              if (match) {
                totalCommits += parseInt(match[1]);
              }
            } else {
              totalCommits += 1;
            }
          }
        } catch (e) {
          console.error(`Error fetching commits for ${repo.name}:`, e);
        }
      }

      // Extrapolate if we only sampled
      if (repos.length > sampleRepos.length) {
        totalCommits = Math.round((totalCommits / sampleRepos.length) * repos.length);
      }

      return totalCommits;
    } catch (error) {
      console.error('Error calculating total commits:', error);
      return 0;
    }
  }

  async getSearchResults(username: string, query: string): Promise<number> {
    try {
      const response = await fetch(
        `${this.baseUrl}/search/issues?q=${query}+author:${username}&per_page=1`,
        { headers: this.getHeaders() }
      );

      if (!response.ok) return 0;

      const data = await response.json();
      return data.total_count || 0;
    } catch (error) {
      console.error(`Error fetching ${query}:`, error);
      return 0;
    }
  }

  async getContributionData(username: string): Promise<ContributionDay[]> {
    try {
      // Using GitHub's GraphQL API for contribution data
      const query = `
        query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionCalendar {
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    contributionLevel
                  }
                }
              }
            }
          }
        }
      `;

      const token = this.getToken();
      if (!token) {
        // Return sample data if no token
        return this.generateSampleContributions();
      }

      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { username },
        }),
      });

      if (!response.ok) {
        return this.generateSampleContributions();
      }

      const data = await response.json();
      const weeks = data.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];

      const contributions: ContributionDay[] = [];
      weeks.forEach((week: any) => {
        week.contributionDays.forEach((day: any) => {
          contributions.push({
            date: day.date,
            count: day.contributionCount,
            level: this.getContributionLevel(day.contributionCount),
          });
        });
      });

      return contributions;
    } catch (error) {
      console.error('Error fetching contribution data:', error);
      return this.generateSampleContributions();
    }
  }

  private getContributionLevel(count: number): number {
    if (count === 0) return 0;
    if (count < 3) return 1;
    if (count < 6) return 2;
    if (count < 9) return 3;
    return 4;
  }

  private generateSampleContributions(): ContributionDay[] {
    const contributions: ContributionDay[] = [];
    const today = new Date();

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const count = Math.floor(Math.random() * 12);

      contributions.push({
        date: date.toISOString().split('T')[0],
        count,
        level: this.getContributionLevel(count),
      });
    }

    return contributions;
  }

  async getAllStats(username: string): Promise<GitHubStats> {
    try {
      const [user, repos, totalPRs, totalIssues] = await Promise.all([
        this.getUser(username),
        this.getUserRepos(username),
        this.getSearchResults(username, 'is:pr'),
        this.getSearchResults(username, 'is:issue'),
      ]);

      if (!user) {
        throw new Error('User not found');
      }

      // Calculate total stars
      const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

      // Get organizations (contributed to)
      const orgsResponse = await fetch(`${this.baseUrl}/users/${username}/orgs`, {
        headers: this.getHeaders(),
      });
      const orgs = orgsResponse.ok ? await orgsResponse.json() : [];

      // Calculate streaks from contribution data
      const contributions = await this.getContributionData(username);
      const streaks = this.calculateStreaks(contributions);

      return {
        totalStars,
        totalCommits: 0, // This is expensive, calculate separately if needed
        totalPRs,
        totalIssues,
        contributedTo: orgs.length + repos.filter((r: any) => r.fork).length,
        publicRepos: user.public_repos,
        followers: user.followers,
        following: user.following,
        longestStreak: streaks.longest,
        currentStreak: streaks.current,
      };
    } catch (error) {
      console.error('Error fetching all stats:', error);
      throw error;
    }
  }

  private calculateStreaks(contributions: ContributionDay[]): { current: number; longest: number } {
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const sortedContributions = [...contributions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    for (let i = sortedContributions.length - 1; i >= 0; i--) {
      if (sortedContributions[i].count > 0) {
        tempStreak++;
        if (i === sortedContributions.length - 1 || currentStreak === 0) {
          currentStreak++;
        }
      } else {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        if (i === sortedContributions.length - 1 || currentStreak > 0) {
          break;
        }
        tempStreak = 0;
      }
    }

    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }

    return { current: currentStreak, longest: longestStreak };
  }

  async getLanguageStats(username: string): Promise<{ name: string; percentage: number; color: string }[]> {
    try {
      const repos = await this.getUserRepos(username);
      const languageBytes: { [key: string]: number } = {};

      // Get languages for each repo
      for (const repo of repos.slice(0, 50)) { // Limit to 50 repos
        try {
          const response = await fetch(
            `${this.baseUrl}/repos/${username}/${repo.name}/languages`,
            { headers: this.getHeaders() }
          );

          if (response.ok) {
            const languages = await response.json();
            Object.entries(languages).forEach(([lang, bytes]) => {
              languageBytes[lang] = (languageBytes[lang] || 0) + (bytes as number);
            });
          }
        } catch (e) {
          console.error(`Error fetching languages for ${repo.name}:`, e);
        }
      }

      // Calculate percentages
      const total = Object.values(languageBytes).reduce((sum, val) => sum + val, 0);
      if (total === 0) return [];

      const languageColors: { [key: string]: string } = {
        JavaScript: '#f7df1e',
        TypeScript: '#3178c6',
        Python: '#3776ab',
        Java: '#b07219',
        'C++': '#f34b7d',
        C: '#555555',
        'C#': '#178600',
        PHP: '#4F5D95',
        Ruby: '#701516',
        Go: '#00ADD8',
        Rust: '#dea584',
        Swift: '#ffac45',
        Kotlin: '#A97BFF',
        HTML: '#e34c26',
        CSS: '#264de4',
        Shell: '#89e051',
        Dart: '#00B4AB',
        Scala: '#c22d40',
        Perl: '#0298c3',
        Lua: '#000080',
      };

      const languages = Object.entries(languageBytes)
        .map(([name, bytes]) => ({
          name,
          percentage: Math.round((bytes / total) * 100),
          color: languageColors[name] || '#888888',
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 6); // Top 6 languages

      return languages;
    } catch (error) {
      console.error('Error fetching language stats:', error);
      return [];
    }
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}

export const githubService = new GitHubService();
