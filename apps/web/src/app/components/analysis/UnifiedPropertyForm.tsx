/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Search, Upload, X, FileText } from "lucide-react";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { toast } from "sonner";

interface UnifiedPropertyFormProps {
  onSubmitData: (data: any) => void;
  fetchPropertyInfo: (url: string) => Promise<any>; // Server Action injected
}

type FormState = {
  address: string;
  price: string;
  priceType: "purchase" | "rent";
  rentPeriod: "monthly" | "yearly";
  bedrooms: string;
  bathrooms: string;
  description: string;
  propertyType: string;
};

const DEFAULT_FORM: FormState = {
  address: "",
  price: "",
  priceType: "purchase",
  rentPeriod: "monthly",
  bedrooms: "",
  bathrooms: "",
  description: "",
  propertyType: "",
};

const UnifiedPropertyForm: React.FC<UnifiedPropertyFormProps> = ({
  onSubmitData,
  fetchPropertyInfo,
}) => {
  const [propertyUrl, setPropertyUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState<FormState>(DEFAULT_FORM);

  const requestIdRef = useRef(0);

  const isProbablyUrl = (value: string) => {
    const v = value.trim();
    if (!v) return false;
    try {
      const url = new URL(v.includes("://") ? v : `https://${v}`);
      return !!url.hostname && url.hostname.includes(".");
    } catch {
      return false;
    }
  };

  const normalizePropertyType = (val?: string | null) => {
    if (!val) return "";
    const s = val.toLowerCase();
    if (s.includes("semi") && s.includes("detached")) return "semi-detached";
    if (s.includes("detached")) return "detached";
    if (s.includes("terraced") || s.includes("terrace")) return "terraced";
    if (s.includes("apartment") || s.includes("flat")) return "apartment";
    if (s.includes("bungalow")) return "bungalow";
    return "other";
  };

  const mapApiToForm = (api: any): FormState => {
    const o = api?.object ?? api;
    const purchase = o?.purchase_price ?? null;
    const rentMonthly = o?.rental_price_per_month ?? null;

    const priceType: "purchase" | "rent" =
      rentMonthly != null && rentMonthly !== 0 ? "rent" : "purchase";

    const priceNumber = priceType === "rent" ? rentMonthly : purchase ?? "";

    return {
      address: o?.property_address ?? "",
      price:
        priceNumber !== null && priceNumber !== undefined
          ? String(priceNumber)
          : "",
      priceType,
      rentPeriod: "monthly",
      bedrooms:
        o?.number_of_bedrooms != null ? String(o.number_of_bedrooms) : "",
      bathrooms:
        o?.number_of_bathrooms != null ? String(o.number_of_bathrooms) : "",
      description: o?.property_description ?? "",
      propertyType: normalizePropertyType(o?.property_type),
    };
  };

  // Debounced fetch via Server Action
  useEffect(() => {
    if (!propertyUrl.trim()) {
      setFormData(DEFAULT_FORM);
      return;
    }
    if (!isProbablyUrl(propertyUrl)) return;

    const myId = ++requestIdRef.current;
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetchPropertyInfo(propertyUrl.trim());
        if (requestIdRef.current !== myId) return; // stale
        const mapped = mapApiToForm(res);
        setFormData(mapped);
        toast.success("Property data extracted from URL");
      } catch (err) {
        if (requestIdRef.current !== myId) return;
        console.error(err);
        toast.error("Failed to extract property data from the URL");
      } finally {
        if (requestIdRef.current === myId) setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [propertyUrl, fetchPropertyInfo]);

  const handleInputChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.address.trim() || !formData.price.trim()) {
      toast.error("Please fill in at least the address and price");
      return;
    }

    const priceValue = parseInt(formData.price, 10);
    if (Number.isNaN(priceValue)) {
      toast.error("Price must be a valid number");
      return;
    }

    const formattedPrice =
      formData.priceType === "purchase"
        ? `£${priceValue.toLocaleString()}`
        : `£${priceValue.toLocaleString()}/${
            formData.rentPeriod === "monthly" ? "month" : "year"
          }`;

    const submitData = {
      ...formData,
      price: formattedPrice,
      uploadedFiles: uploadedFiles.length,
    };

    onSubmitData(submitData);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      const isValidType =
        file.type.startsWith("image/") ||
        file.type === "application/pdf" ||
        file.type.startsWith("text/") ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

      const isValidSize = file.size <= 10 * 1024 * 1024;
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
      setUploadedFiles((prev) => [...prev, ...validFiles]);
      toast.success(
        `Uploaded ${validFiles.length} file${validFiles.length > 1 ? "s" : ""}`
      );
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    toast.success("File removed");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Property Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* URL Input Section */}
        <div>
          <Label htmlFor="property-url">Property URL (Optional)</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="property-url"
              type="text"
              placeholder="Paste property URL (Rightmove, Zoopla, OnTheMarket, etc.)"
              className="pl-9"
              value={propertyUrl}
              onChange={(e) => setPropertyUrl(e.target.value)}
              onBlur={(e) => setPropertyUrl(e.target.value.trim())}
            />
          </div>
          {isLoading && (
            <p className="text-sm text-muted-foreground mt-1 flex items-center">
              <svg
                className="animate-spin h-4 w-4 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Extracting property data...
            </p>
          )}
        </div>

        {/* Property Details Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="address">Property Address</Label>
            <Input
              id="address"
              placeholder="Enter property address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="price-type">Price Type</Label>
            <Select
              value={formData.priceType}
              onValueChange={(value) =>
                handleInputChange("priceType", value as FormState["priceType"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Purchase or rent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="purchase">Purchase Price</SelectItem>
                <SelectItem value="rent">
                  Rental Price (Rent-To-Rent Strategy Only)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.priceType === "rent" && (
            <div>
              <Label htmlFor="rent-period">Rent Period</Label>
              <Select
                value={formData.rentPeriod}
                onValueChange={(value) =>
                  handleInputChange(
                    "rentPeriod",
                    value as FormState["rentPeriod"]
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Monthly or yearly" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Per Month</SelectItem>
                  <SelectItem value="yearly">Per Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className={formData.priceType === "rent" ? "" : "md:col-span-2"}>
            <Label htmlFor="price">
              {formData.priceType === "purchase"
                ? "Purchase Price (£)"
                : `Rent ${
                    formData.rentPeriod === "monthly" ? "(£/month)" : "(£/year)"
                  }`}
            </Label>
            <Input
              id="price"
              type="number"
              placeholder={
                formData.priceType === "purchase"
                  ? "450000"
                  : formData.rentPeriod === "monthly"
                  ? "1500"
                  : "18000"
              }
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="property-type">Property Type</Label>
            <Select
              value={formData.propertyType}
              onValueChange={(value) =>
                handleInputChange("propertyType", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="detached">Detached House</SelectItem>
                <SelectItem value="semi-detached">
                  Semi-Detached House
                </SelectItem>
                <SelectItem value="terraced">Terraced House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="bungalow">Bungalow</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Select
              value={formData.bedrooms}
              onValueChange={(value) => handleInputChange("bedrooms", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Number of bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Bedroom</SelectItem>
                <SelectItem value="2">2 Bedrooms</SelectItem>
                <SelectItem value="3">3 Bedrooms</SelectItem>
                <SelectItem value="4">4 Bedrooms</SelectItem>
                <SelectItem value="5">5+ Bedrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Select
              value={formData.bathrooms}
              onValueChange={(value) => handleInputChange("bathrooms", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Number of bathrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Bathroom</SelectItem>
                <SelectItem value="2">2 Bathrooms</SelectItem>
                <SelectItem value="3">3 Bathrooms</SelectItem>
                <SelectItem value="4">4+ Bathrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Property Description</Label>
            <Textarea
              id="description"
              placeholder="Enter property description..."
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>
        </div>

        {/* File Upload Section */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25"
          } transition-all duration-200 text-center`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm font-medium mb-1">
            Upload additional materials (optional)
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Property photos, floor plans, documents
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
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded text-xs"
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{file.name}</span>
                    <span className="text-muted-foreground">
                      ({formatFileSize(file.size)})
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={!formData.address.trim() || !formData.price.trim()}
        >
          Generate Investment Report
        </Button>
      </CardContent>
    </Card>
  );
};

export default UnifiedPropertyForm;
