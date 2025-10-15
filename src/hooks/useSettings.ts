import { useState, useEffect } from 'react';

interface Settings {
  githubRepo: string;
  baseBranch: string;
  jiraBoardId: string;
  jiraHost: string;
  maxResults: string;
}

const DEFAULT_SETTINGS: Settings = {
  githubRepo: 'cantstoptheunk/ai-agent-example',
  baseBranch: 'main',
  jiraBoardId: '1',
  jiraHost: '',
  maxResults: '50',
};

const STORAGE_KEY = 'app-settings';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } as Settings;
        // Migration: if previous default was 'master', migrate to 'main'
        if (parsed.baseBranch === 'master') {
          parsed.baseBranch = 'main';
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          } catch {
            // ignore
          }
        }
        return parsed;
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  return { settings, updateSettings };
}
