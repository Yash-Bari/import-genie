
// Service for making API calls to WooCommerce
import { 
  getWooCommerceSettingsByUserId, 
  saveWooCommerceSettings as saveSettings, 
  createImportLog,
  updateImportLog,
  WooCommerceSettings as DbWooCommerceSettings
} from './databaseService';
import { useAuth } from '@/contexts/AuthContext';

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

export type Product = {
  id: number;
  name: string;
  sku: string;
  price: string;
  regularPrice: string;
  salePrice: string | null;
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  stockQuantity: number | null;
  categories: string[];
  images: string[];
  status: 'publish' | 'draft' | 'pending';
  dateCreated: string;
  dateModified: string;
  syncStatus?: 'synced' | 'not_synced' | 'syncing' | 'error';
  syncError?: string;
};

// Load WooCommerce settings from local storage
export const getSettings = (): WooCommerceSettings | null => {
  const settings = localStorage.getItem('woocommerce_settings');
  return settings ? JSON.parse(settings) : null;
};

// Save WooCommerce settings to local storage
export const saveWooCommerceSettings = (settings: WooCommerceSettings, userId: number): void => {
  const dbSettings: DbWooCommerceSettings = {
    user_id: userId,
    site_url: settings.siteUrl,
    consumer_key: settings.consumerKey,
    consumer_secret: settings.consumerSecret
  };
  
  saveSettings(dbSettings);
  
  // For compatibility with existing code, also save to localStorage
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
  userId: number,
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
  
  // Create initial import log
  const importLog = createImportLog({
    user_id: userId,
    import_date: new Date().toISOString(),
    total_products: status.total,
    successful_imports: 0,
    failed_imports: 0,
    status: 'processing',
    errors: []
  });
  
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
    
    // Update the import log
    updateImportLog({
      ...importLog,
      successful_imports: status.successful,
      failed_imports: status.failed,
      status: 'processing',
      errors: status.errors
    });
    
    onProgress({...status});
  }
  
  // Final status
  status.status = status.failed === 0 ? 'completed' : 'completed';
  
  // Update the final import log
  updateImportLog({
    ...importLog,
    successful_imports: status.successful,
    failed_imports: status.failed,
    status: status.status,
    errors: status.errors
  });
  
  onProgress({...status});
  
  return status;
};

// Fetch products from WooCommerce
export const fetchProducts = async (
  settings: WooCommerceSettings, 
  page: number = 1,
  perPage: number = 10
): Promise<{products: Product[], total: number}> => {
  try {
    // In a real app, this would make an actual API call to WooCommerce
    // For demo purposes, we'll generate mock data
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockProducts: Product[] = Array.from({ length: perPage }).map((_, index) => {
      const productId = (page - 1) * perPage + index + 1;
      return {
        id: productId,
        name: `Product ${productId}`,
        sku: `SKU-${productId}`,
        price: `$${(Math.random() * 100).toFixed(2)}`,
        regularPrice: `$${(Math.random() * 110).toFixed(2)}`,
        salePrice: Math.random() > 0.3 ? `$${(Math.random() * 80).toFixed(2)}` : null,
        stockStatus: Math.random() > 0.2 ? 'instock' : (Math.random() > 0.5 ? 'outofstock' : 'onbackorder'),
        stockQuantity: Math.random() > 0.2 ? Math.floor(Math.random() * 100) : null,
        categories: ['Category A', 'Category B'].filter(() => Math.random() > 0.5),
        images: [`https://picsum.photos/id/${productId % 100}/200/200`],
        status: Math.random() > 0.2 ? 'publish' : (Math.random() > 0.5 ? 'draft' : 'pending'),
        dateCreated: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        dateModified: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
        syncStatus: Math.random() > 0.3 ? 'synced' : 'not_synced'
      };
    });
    
    const total = 35; // Mock total number of products
    
    return { products: mockProducts, total };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Sync a single product with WooCommerce
export const syncProduct = async (
  product: Product,
  settings: WooCommerceSettings
): Promise<Product> => {
  try {
    // In a real app, this would make an actual API call to WooCommerce
    // For demo purposes, we'll simulate a sync with a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate success or error (90% success rate)
    if (Math.random() > 0.1) {
      return {
        ...product,
        syncStatus: 'synced',
        dateModified: new Date().toISOString()
      };
    } else {
      throw new Error('Failed to sync product with WooCommerce');
    }
  } catch (error) {
    console.error('Sync error:', error);
    return {
      ...product,
      syncStatus: 'error',
      syncError: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Sync all products with WooCommerce
export const syncAllProducts = async (
  products: Product[],
  settings: WooCommerceSettings,
  onProgress: (synced: number, total: number) => void
): Promise<Product[]> => {
  const updatedProducts: Product[] = [...products];
  
  for (let i = 0; i < products.length; i++) {
    // Set product to syncing state
    updatedProducts[i] = { ...updatedProducts[i], syncStatus: 'syncing' };
    onProgress(i, products.length);
    
    try {
      // Sync the product
      const syncedProduct = await syncProduct(products[i], settings);
      updatedProducts[i] = syncedProduct;
    } catch (error) {
      updatedProducts[i] = { 
        ...updatedProducts[i], 
        syncStatus: 'error',
        syncError: error instanceof Error ? error.message : 'Unknown error'
      };
    }
    
    // Update progress
    onProgress(i + 1, products.length);
  }
  
  return updatedProducts;
};
