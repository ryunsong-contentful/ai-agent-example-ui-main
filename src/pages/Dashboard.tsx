import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { formatJiraDescription } from '@/utils/jiraFormatter';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '@/hooks/useSettings';

interface Change {
  path: string;
  content: string;
}

type Step = 'form' | 'review' | 'complete';

interface JiraIssue {
  id: string;
  key: string;
  summary?: string;
  description?: string;
  status?: string;
  assignee?: string | null;
  priority?: string;
  issueType?: string;
  labels?: string[];
  components?: string[];
  created?: string;
  updated?: string;
}

const Dashboard = () => {
  const { settings, updateSettings } = useSettings();
  const [step, setStep] = useState<Step>('form');
  const [repoFullName, setRepoFullName] = useState(settings.githubRepo);
  const [repoOptions, setRepoOptions] = useState<Array<{ full_name: string; default_branch?: string }>>([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [baseBranch, setBaseBranch] = useState(settings.baseBranch);
  const [changes, setChanges] = useState<Change[]>([{ path: 'README.md', content: 'Updated by Ticket Oblierator' }]);
  const [prTitle, setPrTitle] = useState('test pr');
  const [prompt, setPrompt] = useState('');
  const [openPr, setOpenPr] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Jira state
  const [boardId, setBoardId] = useState(settings.jiraBoardId);
  const [maxResults, setMaxResults] = useState(settings.maxResults);
  const [jiraIssues, setJiraIssues] = useState<JiraIssue[]>([]);
  const [jiraLoading, setJiraLoading] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<JiraIssue | null>(null);
  
  // Settings dialog removed

  useEffect(() => {
    setRepoFullName(settings.githubRepo);
    setBaseBranch(settings.baseBranch);
    setBoardId(settings.jiraBoardId);
    setMaxResults(settings.maxResults);
  }, [settings]);

  // Auto-fetch issues when boardId is updated in settings
  useEffect(() => {
    if (boardId) {
      // Fire-and-forget: user can also manually fetch
      handleFetchJiraIssues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      repoFullName,
      baseBranch,
      prompt,
      prTitle,
      prBody: '',
      openPr,
      changes,
      ...(selectedIssue && {
        jiraIssueKey: selectedIssue.key,
        jiraIssue: {
          title: selectedIssue.summary || selectedIssue.key,
          description: selectedIssue.description,
        },
      }),
    };

    try {
      const rawBackendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!rawBackendUrl) {
        const msg = 'VITE_BACKEND_URL is not set. Please define it in your environment.';
        console.warn(msg);
        toast({
          title: 'Configuration error',
          description: msg,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const backendUrl = String(rawBackendUrl).replace(/\/$/, '');

      // Server router is mounted at /api/agents; POST to the GitHub agent
      // endpoint at /api/agents/github.
      const response = await fetch(`${backendUrl}/api/agents/github`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Assume the merged endpoint either creates the PR or returns a result
      // containing information about the created PR. Move directly to
      // completion state.
      setStep('complete');
      
      toast({
        title: 'Request Complete',
        description: 'The backend processed your request.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGitHubRepos = async () => {
    setReposLoading(true);
    try {
      const rawBackendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!rawBackendUrl) {
        toast({ title: 'Configuration error', description: 'VITE_BACKEND_URL is not set', variant: 'destructive' });
        return;
      }
      const backendUrl = String(rawBackendUrl).replace(/\/$/, '');
      const resp = await fetch(`${backendUrl}/api/agents/github/repos`);
      if (!resp.ok) throw new Error(`Backend error: ${resp.status}`);
      const data = await resp.json();
      if (!data?.success) throw new Error(data?.error || 'Failed to load repos');
      const repos = Array.isArray(data.repos) ? data.repos : [];
      setRepoOptions(repos.map((r: any) => ({ full_name: r.full_name, default_branch: r.default_branch })));
      if (repos.length > 0 && !repoFullName) setRepoFullName(repos[0].full_name);
    } catch (err: any) {
      toast({ title: 'Error loading repos', description: err?.message ?? String(err), variant: 'destructive' });
    } finally {
      setReposLoading(false);
    }
  };

  // Auto-load repos when the Dashboard mounts
  useEffect(() => {
    fetchGitHubRepos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectIssue = (issue: JiraIssue) => {
    setSelectedIssue(issue);
    const title = `[${issue.key}] ${issue.summary ?? issue.key}`;
    setPrTitle(title);
  };

  // Simplified flow: single endpoint handles plan + apply. Keep a simple
  // reset handler to reuse the form.
  const handleReset = () => {
    setStep('form');
    setPrompt('');
  setChanges([{ path: 'README.md', content: 'Updated by Ticket Oblierator' }]);
  };

  const handleFetchJiraIssues = async () => {
    if (!boardId) {
      toast({
        title: 'Board ID required',
        description: 'Please enter a Jira board ID',
        variant: 'destructive',
      });
      return;
    }

    setJiraLoading(true);
    try {
      const rawBackendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!rawBackendUrl) {
        const msg = 'VITE_BACKEND_URL is not set. Please define it in your environment.';
        toast({
          title: 'Configuration error',
          description: msg,
          variant: 'destructive',
        });
        return;
      }

      const backendUrl = String(rawBackendUrl).replace(/\/$/, '');
      const params = new URLSearchParams({
        boardId,
        maxResults: maxResults || '50',
      });

      const response = await fetch(`${backendUrl}/api/agents/jira/issues?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // API returns { success: true, total, maxResults, issues }
      const issues = data?.issues ?? [];
      setJiraIssues(Array.isArray(issues) ? issues : []);
      const total = typeof data?.total === 'number' ? data.total : (issues?.length || 0);
      toast({
        title: 'Issues fetched',
        description: `Successfully fetched ${total} issue(s)`,
      });
    } catch (error: any) {
      toast({
        title: 'Error fetching issues',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setJiraLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="flex justify-end mb-4" />
      
      <div className="flex gap-6 max-w-7xl mx-auto">
        {/* Left side - Main content - Fixed width to prevent layout shift */}
        <div className="flex-1 min-w-0 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Jira Issues</CardTitle>
            <CardDescription>
              Fetch and select an issue from your Jira board to inform the PR creation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="boardId">Board ID</Label>
                  <Input
                    id="boardId"
                    placeholder="Enter board ID"
                    value={boardId}
                    onChange={(e) => setBoardId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxResults">Max Results</Label>
                  <Input
                    id="maxResults"
                    type="number"
                    placeholder="50"
                    value={maxResults}
                    onChange={(e) => setMaxResults(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleFetchJiraIssues} disabled={jiraLoading} className="w-full">
                {jiraLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!jiraLoading && <RefreshCw className="mr-2 h-4 w-4" />}
                Fetch Issues
              </Button>

              {jiraIssues.length > 0 && (
                <div className="space-y-3 mt-6">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {jiraIssues.length} issue(s) found - Click to select
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto p-1">
                    {jiraIssues.map((issue) => (
                      <Card 
                        key={issue.id} 
                        className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                          selectedIssue?.id === issue.id 
                            ? 'ring-2 ring-primary bg-primary/5 shadow-lg' 
                            : 'hover:bg-accent/30'
                        }`}
                        onClick={() => handleSelectIssue(issue)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                                {/* Jira issue link - open in new tab. stopPropagation to avoid selecting the card. */}
                                {(() => {
                                  // Build Jira issue URL from settings.jiraHost (e.g. your-domain.atlassian.net)
                                  const host = (settings.jiraHost || '').trim();
                                  let base = '';
                                  if (host) base = host.match(/^https?:\/\//i) ? host : `https://${host}`;
                                  // try env-provided JIRA host (hard-coded fallback), then backend origin
                                  const envJiraHost = (import.meta.env.VITE_JIRA_HOST as string | undefined) || '';
                                  let envHost = envJiraHost.trim();
                                  if (envHost && !envHost.match(/^https?:\/\//i)) envHost = `https://${envHost}`;
                                  const rawBackend = import.meta.env.VITE_BACKEND_URL as string | undefined;
                                  let backendOrigin = '';
                                  if (rawBackend) {
                                    try {
                                      backendOrigin = new URL(String(rawBackend)).origin;
                                    } catch {
                                      backendOrigin = String(rawBackend).replace(/\/+$/, '');
                                    }
                                  }
                                  const fallback = base || envHost || backendOrigin || 'https://your-domain.atlassian.net';
                                  // ensure a single trailing slash then append browse/
                                  const normalizedRoot = (base || fallback).replace(/\/+$/, '') + '/browse/';
                                  const issueUrl = normalizedRoot + issue.key;
                                  return (
                                    <a
                                      href={issueUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Badge variant="ghost" className="font-mono hover:underline">
                                        {issue.key}
                                      </Badge>
                                    </a>
                                  );
                                })()}
                            <Badge variant="info">
                              {issue.status ?? 'Unknown'}
                            </Badge>
                            {issue.issueType && (
                              <Badge variant="default">
                                {issue.issueType}
                              </Badge>
                            )}
                            {issue.priority && (
                              <Badge variant={issue.priority === 'High' || issue.priority === 'Highest' ? 'warning' : 'secondary'}>
                                {issue.priority}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium">{issue.summary ?? issue.key}</p>
                          {issue.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {issue.description}
                            </p>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {step === 'form' && (
          <Card>
            <CardHeader>
              <CardTitle>Create Pull Request</CardTitle>
              <CardDescription>
                Configure and submit a new pull request to your repository
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="repoFullName">Repository Full Name</Label>
                  <div className="flex items-center gap-2">
                    <Select value={repoFullName ?? undefined} onValueChange={(v) => { if (v === 'no_repos') return; setRepoFullName(v); }}>
                      <SelectTrigger>
                        <SelectValue placeholder={reposLoading ? 'Loading repos...' : 'Select repository'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {repoOptions.length === 0 && (
                            <SelectItem value="no_repos" disabled>No repos</SelectItem>
                          )}
                          {repoOptions.map((r) => (
                            <SelectItem key={r.full_name} value={r.full_name}>{r.full_name}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={fetchGitHubRepos} disabled={reposLoading}>
                      {reposLoading ? 'Loading' : 'Refresh'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="baseBranch">Base Branch</Label>
                  <Input
                    id="baseBranch"
                    placeholder="main"
                    value={baseBranch}
                    onChange={(e) => setBaseBranch(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prTitle">Pull Request Title</Label>
                  <Input
                    id="prTitle"
                    placeholder="test pr"
                    value={prTitle}
                    onChange={(e) => setPrTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt">Prompt (optional)</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe the changes you want the AI to make (optional)"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="openPr"
                    checked={openPr}
                    onCheckedChange={setOpenPr}
                  />
                  <Label htmlFor="openPr">Open Pull Request</Label>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'complete' && (
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader>
              <CardTitle className="text-green-700">Success!</CardTitle>
              <CardDescription className="text-green-600">
                Your pull request has been created successfully.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleReset} className="w-full bg-green-600 hover:bg-green-700 text-white" variant={undefined}>
                Create Another PR
              </Button>
            </CardContent>
          </Card>
        )}
        </div>

        {/* Right side - Selected Issue Details - Fixed width to prevent layout shift */}
        <div className={`w-96 flex-shrink-0 transition-all duration-300 ${selectedIssue ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
          {selectedIssue && (
            <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-primary/20 shadow-xl">
              <CardHeader className="pb-3 border-b border-border/50">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        {(() => {
                          const host = (settings.jiraHost || '').trim();
                          let base = '';
                          if (host) base = host.match(/^https?:\/\//i) ? host : `https://${host}`;
                          const envJiraHost = (import.meta.env.VITE_JIRA_HOST as string | undefined) || '';
                          let envHost = envJiraHost.trim();
                          if (envHost && !envHost.match(/^https?:\/\//i)) envHost = `https://${envHost}`;
                          const rawBackend = import.meta.env.VITE_BACKEND_URL as string | undefined;
                          let backendOrigin = '';
                          if (rawBackend) {
                            try {
                              backendOrigin = new URL(String(rawBackend)).origin;
                            } catch {
                              backendOrigin = String(rawBackend).replace(/\/+$/, '');
                            }
                          }
                          const fallback = base || envHost || backendOrigin || 'https://your-domain.atlassian.net';
                          const normalizedRoot = (fallback).replace(/\/+$/, '') + '/browse/';
                          const issueUrl = normalizedRoot + selectedIssue.key;
                          return (
                            <a href={issueUrl} target="_blank" rel="noopener noreferrer">
                              <Badge variant="ghost" className="font-mono hover:underline">
                                {selectedIssue.key}
                              </Badge>
                            </a>
                          );
                        })()}
                      <Badge variant="default">
                        {selectedIssue.issueType}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight">{selectedIssue.summary || selectedIssue.key}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                    <span className="text-xs font-medium text-muted-foreground">Status</span>
                    <Badge variant="info">
                      {selectedIssue.status ?? 'Unknown'}
                    </Badge>
                  </div>
                  
                  {selectedIssue.priority && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                      <span className="text-xs font-medium text-muted-foreground">Priority</span>
                      <Badge variant={selectedIssue.priority === 'High' || selectedIssue.priority === 'Highest' ? 'warning' : 'secondary'}>
                        {selectedIssue.priority}
                      </Badge>
                    </div>
                  )}

                  {selectedIssue.assignee && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                      <span className="text-xs font-medium text-muted-foreground">Assignee</span>
                      <span className="text-sm font-medium truncate">{selectedIssue.assignee}</span>
                    </div>
                  )}
                </div>

                {selectedIssue.description && (
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground">Description</span>
                    <div className="text-foreground/90 p-4 rounded-lg bg-muted/30 border border-border/50 max-h-96 overflow-y-auto">
                      {formatJiraDescription(selectedIssue.description)}
                    </div>
                  </div>
                )}

                {selectedIssue.labels && selectedIssue.labels.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground">Labels</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedIssue.labels.map((label, idx) => (
                        <Badge key={idx} variant="default">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedIssue.components && selectedIssue.components.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground">Components</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedIssue.components.map((component, idx) => (
                        <Badge key={idx} variant="secondary">
                          {component}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-2 text-xs text-muted-foreground">
                  {selectedIssue.created && (
                    <div className="flex justify-between">
                      <span>Created</span>
                      <span>{new Date(selectedIssue.created).toLocaleDateString()}</span>
                    </div>
                  )}
                  {selectedIssue.updated && (
                    <div className="flex justify-between">
                      <span>Updated</span>
                      <span>{new Date(selectedIssue.updated).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
