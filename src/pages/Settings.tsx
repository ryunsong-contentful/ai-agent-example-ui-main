import React, { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const { settings, updateSettings } = useSettings();
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [vercelAiKey, setVercelAiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [jiraHost, setJiraHost] = useState('');
  const [jiraEmail, setJiraEmail] = useState('');
  const [jiraApiToken, setJiraApiToken] = useState('');
  const [jiraBoardId, setJiraBoardId] = useState(settings.jiraBoardId || '');

  useEffect(() => {
    setJiraBoardId(settings.jiraBoardId || '');
  }, [settings.jiraBoardId]);

  const handleSave = () => {
    updateSettings({
      jiraBoardId,
    });

    toast({
      title: 'Settings saved',
      description: 'Your settings have been saved successfully.',
    });
  };

  return (
    <div className="container mx-auto max-w-3xl p-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            Configure your API keys and integration settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">AI Services</h3>
            <div className="space-y-2">
              <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
              <Input
                id="openaiApiKey"
                type="password"
                placeholder="sk-..."
                value={openaiApiKey}
                onChange={(e) => setOpenaiApiKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vercelAiKey">Vercel AI Key</Label>
              <Input
                id="vercelAiKey"
                type="password"
                placeholder="your_vercel_ai_key_here"
                value={vercelAiKey}
                onChange={(e) => setVercelAiKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anthropicKey">Anthropic Key (Optional)</Label>
              <Input
                id="anthropicKey"
                type="password"
                placeholder="sk-ant-..."
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Jira Cloud</h3>
            <div className="space-y-2">
              <Label htmlFor="jiraHost">Jira Host</Label>
              <Input
                id="jiraHost"
                placeholder="your-domain.atlassian.net"
                value={jiraHost}
                onChange={(e) => setJiraHost(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jiraEmail">Jira Email</Label>
              <Input
                id="jiraEmail"
                type="email"
                placeholder="your-jira-email@example.com"
                value={jiraEmail}
                onChange={(e) => setJiraEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jiraApiToken">Jira API Token</Label>
              <Input
                id="jiraApiToken"
                type="password"
                placeholder="your_jira_api_token_here"
                value={jiraApiToken}
                onChange={(e) => setJiraApiToken(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jiraBoardId">Jira Board ID</Label>
              <Input
                id="jiraBoardId"
                placeholder="Enter Jira board ID (e.g. 1)"
                value={jiraBoardId}
                onChange={(e) => setJiraBoardId(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleSave} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;