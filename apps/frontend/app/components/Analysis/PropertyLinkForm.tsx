
import React, { useState } from 'react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@components/ui/card';
import { Upload, Link2, Search, X, FileText } from 'lucide-react';
import { Label } from '@components/ui/label';
import { toast } from 'sonner';

interface PropertyLinkFormProps {
  onPreviewData: (data: any) => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const PropertyLinkForm: React.FC<PropertyLinkFormProps> = ({ 
  onPreviewData, 
  isLoading, 
  setIsLoading 
}) => {
  const [propertyUrl, setPropertyUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!propertyUrl.trim()) {
      toast.error('Please enter a property URL');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call delay - in a real app, this would be an actual API call
    setTimeout(() => {
      // Mock data for demo purposes
      const mockData = {
        address: '123 Investment Avenue, London, UK',
        price: '£450,000',
        bedrooms: '3',
        bathrooms: '2',
        description: 'A well-presented three bedroom terraced house in a popular residential area. The property features a modern kitchen, spacious living room, and a private garden.',
        propertyType: 'Terraced House',
        image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2145&auto=format&fit=crop',
        uploadedFiles: uploadedFiles.length
      };
      
      setIsLoading(false);
      onPreviewData(mockData);
      toast.success('Property data analysed successfully!');
    }, 1500);
  };
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || 
                         file.type === 'application/pdf' || 
                         file.type.startsWith('text/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        toast.error(`${file.name} is not a supported file type`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name} exceeds 10MB size limit`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      toast.success(`Uploaded ${validFiles.length} file${validFiles.length > 1 ? 's' : ''}`);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    toast.success('File removed');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Analyse Property</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="property-url">Property URL</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="property-url"
                  type="text"
                  placeholder="Paste property URL..."
                  className="pl-9"
                  value={propertyUrl}
                  onChange={(e) => setPropertyUrl(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Paste a URL from Rightmove, Zoopla, OnTheMarket, etc.
              </p>
            </div>
            
            <div 
              className={`border-2 border-dashed rounded-lg p-6 ${
                dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
              } transition-all duration-200 text-center`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm font-medium mb-1">
                Drag & drop or upload additional materials
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Property photos, floor plans, land registry documents, or any other helpful information to enhance the AI analysis
              </p>
              <div>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    multiple
                    accept="image/*,.pdf,.txt,.doc,.docx"
                  />
                  <Button type="button" variant="outline" size="sm">
                    Select Files
                  </Button>
                </label>
              </div>
            </div>

            {/* Uploaded Files Display */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Uploaded Files:</Label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="truncate">{file.name}</span>
                        <span className="text-gray-400">({formatFileSize(file.size)})</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-red-100"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button 
          type="submit" 
          className="w-full purple-gradient-bg hover:opacity-90"
          disabled={isLoading || !propertyUrl.trim()}
          onClick={handleSubmit}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <Link2 className="mr-2 h-4 w-4" />
              Get Report
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyLinkForm;
