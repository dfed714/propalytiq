
import React, { useState } from 'react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { toast } from 'sonner';

interface ManualEntryFormProps {
  onSubmitData: (data: any) => void;
}

const ManualEntryForm: React.FC<ManualEntryFormProps> = ({ onSubmitData }) => {
  const [formData, setFormData] = useState({
    address: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.address || !formData.price) {
      toast.error('Please fill in required fields (address and price)');
      return;
    }
    
    // Add a mock image for the demo
    const dataWithImage = {
      ...formData,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
    };
    
    onSubmitData(dataWithImage);
    toast.success('Property details submitted');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="address">Property Address*</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="123 Main Street, City, Postcode"
          className="mt-1"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="price">Purchase Price (£)*</Label>
          <Input
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="250000"
            type="text"
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="propertyType">Property Type</Label>
          <Select 
            onValueChange={(value) => handleSelectChange('propertyType', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment/Flat</SelectItem>
              <SelectItem value="bungalow">Bungalow</SelectItem>
              <SelectItem value="maisonette">Maisonette</SelectItem>
              <SelectItem value="land">Land</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Select 
            onValueChange={(value) => handleSelectChange('bedrooms', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select number of bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="6+">6+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Select 
            onValueChange={(value) => handleSelectChange('bathrooms', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select number of bathrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4+">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Property Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter details about the property condition, features, etc."
          rows={4}
          className="mt-1"
        />
      </div>
      
      <div className="pt-4">
        <Button type="submit" className="w-full">
          Continue to Investment Strategy
        </Button>
      </div>
    </form>
  );
};

export default ManualEntryForm;
