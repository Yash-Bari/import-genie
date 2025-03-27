
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, Save, List, AlertCircle } from "lucide-react";

type MappingInterfaceProps = {
  csvData: string[][];
  onMappingComplete: (mappedData: any[]) => void;
};

type ColumnMapping = {
  [key: string]: number;
};

const REQUIRED_FIELDS = ["name", "price"];

const FIELD_OPTIONS = [
  { value: "name", label: "Product Name" },
  { value: "description", label: "Description" },
  { value: "price", label: "Price" },
  { value: "sku", label: "SKU" },
  { value: "category", label: "Category" },
  { value: "stock", label: "Stock Quantity" },
  { value: "image", label: "Image URL" },
  { value: "ignore", label: "Ignore this column" },
];

const MappingInterface: React.FC<MappingInterfaceProps> = ({ csvData, onMappingComplete }) => {
  const headers = csvData[0] || [];
  const previewRows = csvData.slice(1, 4);
  
  // Initialize with potential automatic mappings
  const initialMapping: ColumnMapping = {};
  headers.forEach((header, index) => {
    const lowerHeader = header.toLowerCase();
    const matchingField = FIELD_OPTIONS.find(
      (field) => lowerHeader.includes(field.value) || field.value.includes(lowerHeader)
    );
    if (matchingField) {
      initialMapping[matchingField.value] = index;
    }
  });

  const [mapping, setMapping] = useState<ColumnMapping>(initialMapping);
  const [error, setError] = useState<string | null>(null);

  const handleMappingChange = (field: string, columnIndex: number) => {
    // Remove any existing mapping for this column
    const newMapping = { ...mapping };
    
    // Find and remove any field that is already mapped to this column
    Object.keys(newMapping).forEach(key => {
      if (newMapping[key] === columnIndex) {
        delete newMapping[key];
      }
    });
    
    // Add the new mapping
    if (field !== "ignore") {
      newMapping[field] = columnIndex;
    }
    
    setMapping(newMapping);
    setError(null);
  };

  const validateMapping = () => {
    const missingFields = REQUIRED_FIELDS.filter(field => mapping[field] === undefined);
    
    if (missingFields.length > 0) {
      setError(`Required fields missing: ${missingFields.join(", ")}`);
      return false;
    }
    
    return true;
  };

  const handleCompleteMapping = () => {
    if (!validateMapping()) {
      return;
    }
    
    // Transform CSV data to objects based on mapping
    const mappedData = csvData.slice(1).map(row => {
      const product: any = {};
      
      Object.entries(mapping).forEach(([field, columnIndex]) => {
        // Skip if column index is out of bounds
        if (columnIndex >= row.length) return;
        
        let value = row[columnIndex];
        
        // Convert values appropriately based on field
        if (field === "price" || field === "stock") {
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            value = numValue.toString();
          }
        }
        
        product[field] = value;
      });
      
      return product;
    });
    
    onMappingComplete(mappedData);
  };

  const getFieldLabel = (fieldValue: string) => {
    const field = FIELD_OPTIONS.find(f => f.value === fieldValue);
    return field ? field.label : fieldValue;
  };

  return (
    <div className="space-y-6 slide-up">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <List className="mr-2 h-5 w-5 text-primary" />
            Map CSV Columns to Product Fields
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select which CSV column corresponds to each product field. 
              <span className="text-primary font-medium"> Product Name and Price are required.</span>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FIELD_OPTIONS.filter(field => field.value !== "ignore").map((field) => (
                <div key={field.value} className="space-y-1">
                  <div className="flex items-center">
                    <label className="block text-sm font-medium" htmlFor={`field-${field.value}`}>
                      {field.label}
                      {REQUIRED_FIELDS.includes(field.value) && 
                        <span className="text-destructive ml-1">*</span>
                      }
                    </label>
                  </div>
                  <Select
                    value={mapping[field.value]?.toString() || ""}
                    onValueChange={(value) => handleMappingChange(field.value, parseInt(value))}
                  >
                    <SelectTrigger id={`field-${field.value}`}>
                      <SelectValue placeholder="Select a column" />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map((header, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            
            {error && (
              <div className="flex items-center text-destructive text-sm mt-4">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Reset Mapping</Button>
          <Button onClick={handleCompleteMapping}>
            <Save className="h-4 w-4 mr-2" />
            Complete Mapping
          </Button>
        </CardFooter>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl">Data Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((header, index) => (
                    <TableHead key={index} className="whitespace-nowrap">
                      <div className="flex flex-col items-start">
                        <span>{header}</span>
                        {Object.entries(mapping).map(([field, columnIndex]) => (
                          columnIndex === index && (
                            <span key={field} className="text-xs text-primary font-medium flex items-center mt-1">
                              <ArrowRight className="h-3 w-3 mr-1" />
                              {getFieldLabel(field)}
                            </span>
                          )
                        ))}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewRows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex} className="whitespace-nowrap">
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {previewRows.length === 0 && (
            <p className="text-center py-4 text-muted-foreground">No preview data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MappingInterface;
