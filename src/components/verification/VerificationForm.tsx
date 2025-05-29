'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Building, User, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VerificationFormProps {
  userType: 'individual' | 'dealership';
  onSubmissionComplete: () => void;
}

export default function VerificationForm({ userType, onSubmissionComplete }: VerificationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    photoIdType: '',
    photoIdFile: null as File | null,
    proofOfAddressType: '',
    proofOfAddressFile: null as File | null,
    businessRegistrationFile: null as File | null,
    businessRegistrationNumber: '',
    businessName: '',
    businessAddress: '',
    vatNumber: ''
  });

  const { toast } = useToast();

  const photoIdTypes = [
    { value: 'passport', label: 'Passport' },
    { value: 'driving_license', label: 'Driving License' },
    { value: 'national_id', label: 'National ID Card' }
  ];

  const proofOfAddressTypes = [
    { value: 'utility_bill', label: 'Utility Bill' },
    { value: 'bank_statement', label: 'Bank Statement' },
    { value: 'council_tax', label: 'Council Tax Bill' },
    { value: 'rental_agreement', label: 'Rental Agreement' }
  ];

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const uploadFile = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'verification-documents');
      formData.append('path', `${Date.now()}-${file.name}`);

      console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('Upload response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Upload failed with response:', errorData);
        throw new Error(`Failed to upload file: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      return result.url;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.photoIdType || !formData.photoIdFile || !formData.proofOfAddressType || !formData.proofOfAddressFile) {
        toast({
          title: 'Missing Documents',
          description: 'Please provide both photo ID and proof of address.',
          variant: 'destructive'
        });
        return;
      }

      if (userType === 'dealership') {
        if (!formData.businessRegistrationFile || !formData.businessRegistrationNumber || !formData.businessName || !formData.businessAddress) {
          toast({
            title: 'Missing Business Information',
            description: 'Please provide all required business documents and information.',
            variant: 'destructive'
          });
          return;
        }
      }

      // Upload files
      const photoIdUrl = await uploadFile(formData.photoIdFile);
      const proofOfAddressUrl = await uploadFile(formData.proofOfAddressFile);
      let businessRegistrationUrl = '';

      if (userType === 'dealership' && formData.businessRegistrationFile) {
        businessRegistrationUrl = await uploadFile(formData.businessRegistrationFile);
      }

      // Submit verification
      const response = await fetch('/api/verification/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verificationType: userType,
          photoIdUrl,
          photoIdType: formData.photoIdType,
          proofOfAddressUrl,
          proofOfAddressType: formData.proofOfAddressType,
          ...(userType === 'dealership' && {
            businessRegistrationUrl,
            businessRegistrationNumber: formData.businessRegistrationNumber,
            businessName: formData.businessName,
            businessAddress: formData.businessAddress,
            vatNumber: formData.vatNumber
          })
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit verification');
      }

      toast({
        title: 'Verification Submitted',
        description: 'Your documents have been submitted for review. We\'ll notify you once the verification is complete.',
      });

      onSubmissionComplete();

    } catch (error) {
      console.error('Verification submission error:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your verification. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {userType === 'dealership' ? <Building className="h-5 w-5" /> : <User className="h-5 w-5" />}
            {userType === 'dealership' ? 'Dealership Verification' : 'Individual Seller Verification'}
          </CardTitle>
          <CardDescription>
            To ensure the safety and security of our marketplace, we require verification of your identity and address.
            {userType === 'dealership' && ' As a dealership, we also need your business registration documents.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo ID Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <FileText className="h-5 w-5" />
                Photo ID
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="photoIdType">ID Type</Label>
                  <Select value={formData.photoIdType} onValueChange={(value) => setFormData(prev => ({ ...prev, photoIdType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      {photoIdTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="photoIdFile">Upload Photo ID</Label>
                  <Input
                    id="photoIdFile"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange('photoIdFile', e.target.files?.[0] || null)}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Proof of Address Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <FileText className="h-5 w-5" />
                Proof of Address
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="proofOfAddressType">Document Type</Label>
                  <Select value={formData.proofOfAddressType} onValueChange={(value) => setFormData(prev => ({ ...prev, proofOfAddressType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {proofOfAddressTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="proofOfAddressFile">Upload Document</Label>
                  <Input
                    id="proofOfAddressFile"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange('proofOfAddressFile', e.target.files?.[0] || null)}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Business Information Section (Dealerships only) */}
            {userType === 'dealership' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Building className="h-5 w-5" />
                  Business Information
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                      placeholder="Your registered business name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="businessRegistrationNumber">Registration Number</Label>
                    <Input
                      id="businessRegistrationNumber"
                      value={formData.businessRegistrationNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessRegistrationNumber: e.target.value }))}
                      placeholder="Company registration number"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Textarea
                    id="businessAddress"
                    value={formData.businessAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessAddress: e.target.value }))}
                    placeholder="Full registered business address"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vatNumber">VAT Number (Optional)</Label>
                    <Input
                      id="vatNumber"
                      value={formData.vatNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, vatNumber: e.target.value }))}
                      placeholder="VAT registration number"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="businessRegistrationFile">Business Registration Certificate</Label>
                    <Input
                      id="businessRegistrationFile"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange('businessRegistrationFile', e.target.files?.[0] || null)}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Verification...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit for Verification
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Verification Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Documents must be clear and readable</li>
                <li>All information must be current and valid</li>
                <li>Files should be in JPG, PNG, or PDF format</li>
                <li>Maximum file size: 10MB per document</li>
                {userType === 'dealership' && (
                  <li>Business registration must be current and valid</li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
