
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  RefreshCw, 
  Package, 
  AlertTriangle, 
  Check, 
  Ban, 
  Clock, 
  Loader2 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  fetchProducts, 
  syncProduct, 
  syncAllProducts, 
  Product, 
  getWooCommerceSettingsByUserId 
} from "@/utils/apiService";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const ProductList = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [syncProgress, setSyncProgress] = useState({ synced: 0, total: 0 });
  
  const PRODUCTS_PER_PAGE = 10;
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    loadProducts();
  }, [isAuthenticated, currentPage]);
  
  const loadProducts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const settings = getWooCommerceSettingsByUserId(user.id);
      if (!settings) {
        toast.error("Please configure your WooCommerce settings first");
        navigate("/settings");
        return;
      }
      
      const apiSettings = {
        siteUrl: settings.site_url,
        consumerKey: settings.consumer_key,
        consumerSecret: settings.consumer_secret
      };
      
      const { products: fetchedProducts, total } = await fetchProducts(
        apiSettings,
        currentPage,
        PRODUCTS_PER_PAGE
      );
      
      setProducts(fetchedProducts);
      setTotalProducts(total);
      setTotalPages(Math.ceil(total / PRODUCTS_PER_PAGE));
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSyncProduct = async (product: Product) => {
    if (!user) return;
    
    try {
      const settings = getWooCommerceSettingsByUserId(user.id);
      if (!settings) {
        toast.error("Please configure your WooCommerce settings first");
        navigate("/settings");
        return;
      }
      
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === product.id 
            ? { ...p, syncStatus: 'syncing' } 
            : p
        )
      );
      
      const apiSettings = {
        siteUrl: settings.site_url,
        consumerKey: settings.consumer_key,
        consumerSecret: settings.consumer_secret
      };
      
      const syncedProduct = await syncProduct(product, apiSettings);
      
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === product.id ? syncedProduct : p
        )
      );
      
      if (syncedProduct.syncStatus === 'synced') {
        toast.success(`Product "${syncedProduct.name}" synced successfully`);
      } else {
        toast.error(`Failed to sync product "${syncedProduct.name}": ${syncedProduct.syncError}`);
      }
    } catch (error) {
      console.error("Error syncing product:", error);
      toast.error(`Failed to sync product: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === product.id 
            ? { ...p, syncStatus: 'error', syncError: 'Failed to sync' } 
            : p
        )
      );
    }
  };
  
  const handleSyncAll = async () => {
    if (!user || products.length === 0) return;
    
    try {
      setSyncing(true);
      setSyncProgress({ synced: 0, total: products.length });
      
      const settings = getWooCommerceSettingsByUserId(user.id);
      if (!settings) {
        toast.error("Please configure your WooCommerce settings first");
        navigate("/settings");
        return;
      }
      
      const apiSettings = {
        siteUrl: settings.site_url,
        consumerKey: settings.consumer_key,
        consumerSecret: settings.consumer_secret
      };
      
      toast.info("Starting product sync...");
      
      const syncedProducts = await syncAllProducts(
        products,
        apiSettings,
        (synced, total) => {
          setSyncProgress({ synced, total });
        }
      );
      
      setProducts(syncedProducts);
      
      const successCount = syncedProducts.filter(p => p.syncStatus === 'synced').length;
      const errorCount = syncedProducts.filter(p => p.syncStatus === 'error').length;
      
      if (errorCount === 0) {
        toast.success(`All ${successCount} products synced successfully`);
      } else {
        toast.warning(`Sync completed with ${successCount} successes and ${errorCount} failures`);
      }
    } catch (error) {
      console.error("Error syncing all products:", error);
      toast.error(`Sync process failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSyncing(false);
      setSyncProgress({ synced: 0, total: 0 });
    }
  };
  
  const handleRefresh = () => {
    loadProducts();
  };
  
  const renderStockStatus = (status: Product['stockStatus']) => {
    switch (status) {
      case 'instock':
        return (
          <span className="flex items-center text-green-600">
            <Check className="h-4 w-4 mr-1" />
            In Stock
          </span>
        );
      case 'outofstock':
        return (
          <span className="flex items-center text-red-600">
            <Ban className="h-4 w-4 mr-1" />
            Out of Stock
          </span>
        );
      case 'onbackorder':
        return (
          <span className="flex items-center text-amber-600">
            <Clock className="h-4 w-4 mr-1" />
            Backorder
          </span>
        );
      default:
        return status;
    }
  };
  
  const renderSyncStatus = (product: Product) => {
    switch (product.syncStatus) {
      case 'synced':
        return (
          <span className="flex items-center text-green-600">
            <Check className="h-4 w-4 mr-1" />
            Synced
          </span>
        );
      case 'not_synced':
        return (
          <span className="flex items-center text-slate-600">
            <RefreshCw className="h-4 w-4 mr-1" />
            Not Synced
          </span>
        );
      case 'syncing':
        return (
          <span className="flex items-center text-blue-600">
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            Syncing
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center text-red-600" title={product.syncError}>
            <AlertTriangle className="h-4 w-4 mr-1" />
            Error
          </span>
        );
      default:
        return (
          <span className="flex items-center text-slate-600">
            <RefreshCw className="h-4 w-4 mr-1" />
            Unknown
          </span>
        );
    }
  };
  
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageItems = 5;
    
    if (totalPages <= maxPageItems) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 3) {
        startPage = 2;
        endPage = Math.min(totalPages - 1, 4);
      }
      
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
        endPage = totalPages - 1;
      }
      
      if (startPage > 2) {
        pageNumbers.push('ellipsis_start');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages - 1) {
        pageNumbers.push('ellipsis_end');
      }
      
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl space-y-8">
          <div className="slide-up">
            <h1 className="text-3xl font-bold flex items-center">
              <Package className="h-7 w-7 mr-2 text-primary" />
              Products
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and sync your WooCommerce products
            </p>
          </div>
          
          <Card className="glass-card slide-up">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Product Inventory</CardTitle>
                <CardDescription>
                  {totalProducts > 0 ? 
                    `Showing ${(currentPage - 1) * PRODUCTS_PER_PAGE + 1}-${Math.min(currentPage * PRODUCTS_PER_PAGE, totalProducts)} of ${totalProducts} products` : 
                    "No products found"
                  }
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSyncAll}
                  disabled={syncing || products.length === 0}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                  Sync All
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {syncing && (
                <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-blue-700 dark:text-blue-300">
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      <span>
                        Syncing products... ({syncProgress.synced} of {syncProgress.total})
                      </span>
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      {Math.round((syncProgress.synced / syncProgress.total) * 100)}%
                    </div>
                  </div>
                  <div className="mt-2 w-full h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-300" 
                      style={{ width: `${(syncProgress.synced / syncProgress.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No products found</p>
                  <p className="text-sm mt-2">
                    Configure your WooCommerce settings and refresh to load products
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Sync Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              {product.images[0] && (
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name}
                                  className="w-10 h-10 rounded object-cover mr-3" 
                                />
                              )}
                              <span>{product.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{product.sku || "—"}</TableCell>
                          <TableCell>
                            <div>
                              {product.price}
                              {product.salePrice && (
                                <div className="text-xs text-muted-foreground line-through">
                                  {product.regularPrice}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              {renderStockStatus(product.stockStatus)}
                              {product.stockQuantity !== null && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  Qty: {product.stockQuantity}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                              ${product.status === 'publish' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                                product.status === 'draft' ? 'bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-300' : 
                                'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                              }
                            `}>
                              {product.status === 'publish' ? 'Published' : 
                                product.status === 'draft' ? 'Draft' : 'Pending'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {renderSyncStatus(product)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSyncProduct(product)}
                              disabled={product.syncStatus === 'syncing' || syncing}
                            >
                              <RefreshCw className={`h-4 w-4 mr-1 ${product.syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                              Sync
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            
            {totalPages > 1 && (
              <CardFooter>
                <Pagination className="w-full">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (!loading && !syncing && currentPage > 1) {
                            setCurrentPage(p => Math.max(1, p - 1));
                          }
                        }}
                        className={currentPage === 1 || loading || syncing ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {getPageNumbers().map((page, index) => (
                      <PaginationItem key={index}>
                        {page === 'ellipsis_start' || page === 'ellipsis_end' ? (
                          <span className="flex h-9 w-9 items-center justify-center">
                            …
                          </span>
                        ) : (
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (!loading && !syncing) {
                                setCurrentPage(Number(page));
                              }
                            }}
                            isActive={currentPage === page}
                            className={loading || syncing ? 'pointer-events-none' : ''}
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (!loading && !syncing && currentPage < totalPages) {
                            setCurrentPage(p => Math.min(totalPages, p + 1));
                          }
                        }}
                        className={currentPage === totalPages || loading || syncing ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardFooter>
            )}
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductList;
