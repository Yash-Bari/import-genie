
// Service for making API calls to WooCommerce

export type WooCommerceSettings = {
  siteUrl: string;
  consumerKey: string;
  consumerSecret: string;
};

export type ImportStatus = {
  total: number;
  processed: number;
  successful: number;
  failed: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  errors: string[];
};

// Load WooCommerce settings from local storage
export const getSettings = (): WooCommerceSettings | null => {
  const settings = localStorage.getItem('woocommerce_settings');
  return settings ? JSON.parse(settings) : null;
};

// Save WooCommerce settings to local storage
export const saveSettings = (settings: WooCommerceSettings): void => {
  localStorage.setItem('woocommerce_settings', JSON.stringify(settings));
};

// Validate WooCommerce API credentials
export const validateCredentials = async (settings: WooCommerceSettings): Promise<boolean> => {
  try {
    // In a real app, this would make an actual API call to WooCommerce
    // For demo purposes, we'll simulate a successful validation after a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
};

// Read CSV file and return parsed data
export const parseCsvFile = async (file: File): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (!event.target?.result) {
        reject(new Error('Failed to read file'));
        return;
      }
      
      const csvContent = event.target.result as string;
      const lines = csvContent.split('\n');
      const data = lines.map(line => line.split(',').map(cell => cell.trim()));
      
      resolve(data);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

// Process product import
export const importProducts = async (
  mappedData: any[],
  settings: WooCommerceSettings,
  onProgress: (status: ImportStatus) => void
): Promise<ImportStatus> => {
  // Initial status
  const status: ImportStatus = {
    total: mappedData.length,
    processed: 0,
    successful: 0,
    failed: 0,
    status: 'processing',
    errors: [],
  };
  
  onProgress({...status});
  
  // In a real app, this would make actual API calls to WooCommerce
  // For demo purposes, we'll simulate the import process with delays
  for (let i = 0; i < mappedData.length; i++) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    status.processed++;
    
    // Randomly succeed or fail (80% success rate for demo)
    if (Math.random() > 0.2) {
      status.successful++;
    } else {
      status.failed++;
      status.errors.push(`Error importing product: ${mappedData[i].name || `Product ${i+1}`}`);
    }
    
    onProgress({...status});
  }
  
  // Final status
  status.status = status.failed === 0 ? 'completed' : 'completed';
  onProgress({...status});
  
  return status;
};
