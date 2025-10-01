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
import { GetPropertyInfoDto } from "@dtos";

interface UnifiedPropertyFormProps {
  onSubmitData: (data: any) => void;
  fetchPropertyInfo: (url: GetPropertyInfoDto) => Promise<any>; // Server Action injected
}

type FormState = {
  address: string;
  price: string;
  price_type: "purchase" | "rent";
  rent_period: "monthly" | "yearly";
  bedrooms: number;
  bathrooms: number;
  description: string;
  property_type: string;
};

const DEFAULT_FORM: FormState = {
  address: "",
  price: "",
  price_type: "purchase",
  rent_period: "monthly",
  bedrooms: 3,
  bathrooms: 3,
  description: "",
  property_type: "",
};

const UnifiedPropertyForm: React.FC<UnifiedPropertyFormProps> = ({
  onSubmitData,
  fetchPropertyInfo,
}) => {
  const [propertyUrl, setPropertyUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
      price_type: priceType,
      rent_period: "monthly",
      bedrooms:
        o.number_of_bedrooms !== null && o.number_of_bedrooms !== undefined
          ? o.number_of_bedrooms
          : 0,
      bathrooms:
        o.number_of_bathrooms !== null && o.number_of_bathrooms !== undefined
          ? o.number_of_bathrooms
          : 0,
      description: o?.property_description ?? "",
      property_type: normalizePropertyType(o?.property_type),
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
        const res = await fetchPropertyInfo({ url: propertyUrl.trim() });
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
      formData.price_type === "purchase"
        ? `£${priceValue.toLocaleString()}`
        : `£${priceValue.toLocaleString()}/${
            formData.rent_period === "monthly" ? "month" : "year"
          }`;

    const submitData = {
      ...formData,
      price: formattedPrice,
    };

    onSubmitData(submitData);
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
              value={formData.price_type}
              onValueChange={(value) =>
                handleInputChange(
                  "price_type",
                  value as FormState["price_type"]
                )
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

          {formData.price_type === "rent" && (
            <div>
              <Label htmlFor="rent-period">Rent Period</Label>
              <Select
                value={formData.rent_period}
                onValueChange={(value) =>
                  handleInputChange(
                    "rent_period",
                    value as FormState["rent_period"]
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

          <div
            className={formData.price_type === "rent" ? "" : "md:col-span-2"}
          >
            <Label htmlFor="price">
              {formData.price_type === "purchase"
                ? "Purchase Price (£)"
                : `Rent ${
                    formData.rent_period === "monthly"
                      ? "(£/month)"
                      : "(£/year)"
                  }`}
            </Label>
            <Input
              id="price"
              type="number"
              placeholder={
                formData.price_type === "purchase"
                  ? "450000"
                  : formData.rent_period === "monthly"
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
              value={formData.property_type}
              onValueChange={(value) =>
                handleInputChange("property_type", value)
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
            <Input
              id="bedrooms"
              type="number"
              placeholder="3"
              value={formData.bedrooms}
              onChange={(e) => handleInputChange("bedrooms", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              type="number"
              placeholder="3"
              value={formData.bathrooms}
              onChange={(e) => handleInputChange("bathrooms", e.target.value)}
            />
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
