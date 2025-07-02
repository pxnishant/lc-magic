export interface AppSettings {
    selectedCompany: string;
    selectedDuration: string;
    selectedTags: string[];
    showTags: boolean;
  }
  
  const SETTINGS_STORAGE_KEY = 'coding-problems-settings';
  
  export const getStoredSettings = (): Partial<AppSettings> => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading settings from storage:', error);
      return {};
    }
  };
  
  export const saveSettings = (settings: Partial<AppSettings>): void => {
    try {
      const currentSettings = getStoredSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving settings to storage:', error);
    }
  };
  
  export const saveSetting = <K extends keyof AppSettings>(
    key: K, 
    value: AppSettings[K]
  ): void => {
    saveSettings({ [key]: value });
  };