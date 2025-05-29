'use client';

import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Star, StarOff, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VehicleImageUploadProps {
  onImagesChange: (files: File[]) => void;
  maxImages?: number;
  className?: string;
}

export default function VehicleImageUpload({
  onImagesChange,
  maxImages = 10,
  className = ''
}: VehicleImageUploadProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [primaryIndex, setPrimaryIndex] = useState<number>(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).filter(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      
      return true;
    });

    // Check total image count
    if (selectedImages.length + newFiles.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    const updatedFiles = [...selectedImages, ...newFiles];
    setSelectedImages(updatedFiles);
    onImagesChange(updatedFiles);

    // Create preview URLs
    newFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => [...prev, url]);
    });
  }, [selectedImages, maxImages, onImagesChange]);

  const removeImage = useCallback((index: number) => {
    const updatedFiles = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedFiles);
    onImagesChange(updatedFiles);

    // Clean up preview URL
    URL.revokeObjectURL(previewUrls[index]);
    const updatedUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(updatedUrls);

    // Adjust primary index if needed
    if (index === primaryIndex && updatedFiles.length > 0) {
      setPrimaryIndex(0);
    } else if (index < primaryIndex) {
      setPrimaryIndex(primaryIndex - 1);
    } else if (primaryIndex >= updatedFiles.length) {
      setPrimaryIndex(Math.max(0, updatedFiles.length - 1));
    }
  }, [selectedImages, previewUrls, onImagesChange, primaryIndex]);

  const setPrimary = useCallback((index: number) => {
    setPrimaryIndex(index);
  }, []);

  const moveImage = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const newFiles = [...selectedImages];
    const newUrls = [...previewUrls];
    
    // Move the items
    const [movedFile] = newFiles.splice(fromIndex, 1);
    const [movedUrl] = newUrls.splice(fromIndex, 1);
    
    newFiles.splice(toIndex, 0, movedFile);
    newUrls.splice(toIndex, 0, movedUrl);
    
    setSelectedImages(newFiles);
    setPreviewUrls(newUrls);
    onImagesChange(newFiles);
    
    // Update primary index
    if (fromIndex === primaryIndex) {
      setPrimaryIndex(toIndex);
    } else if (fromIndex < primaryIndex && toIndex >= primaryIndex) {
      setPrimaryIndex(primaryIndex - 1);
    } else if (fromIndex > primaryIndex && toIndex <= primaryIndex) {
      setPrimaryIndex(primaryIndex + 1);
    }
  }, [selectedImages, previewUrls, onImagesChange, primaryIndex]);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveImage(draggedIndex, dropIndex);
    }
    
    setDraggedIndex(null);
  }, [draggedIndex, moveImage]);

  const handleFileDropZone = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOverZone = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Vehicle Images ({selectedImages.length}/{maxImages})
      </label>
      
      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
        onDrop={handleFileDropZone}
        onDragOver={handleDragOverZone}
        onClick={() => document.getElementById('image-upload')?.click()}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-1">
          Click to upload or drag and drop images here
        </p>
        <p className="text-xs text-gray-500">
          PNG, JPG, JPEG up to 5MB each
        </p>
        <input
          id="image-upload"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </div>

      {/* Image Previews */}
      {selectedImages.length > 0 && (
        <div className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previewUrls.map((url, index) => (
              <div 
                key={index} 
                className={`relative group cursor-move ${
                  draggedIndex === index ? 'opacity-50' : ''
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className={`aspect-square rounded-lg overflow-hidden bg-gray-100 ${
                  index === primaryIndex ? 'ring-2 ring-blue-500' : ''
                }`}>
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Drag Handle */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-4 h-4 text-white drop-shadow-lg" />
                </div>
                
                {/* Delete Button */}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
                
                {/* Primary Button */}
                <Button
                  type="button"
                  variant={index === primaryIndex ? "default" : "outline"}
                  size="sm"
                  className="absolute -top-2 -left-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setPrimary(index)}
                  title={index === primaryIndex ? "Primary image" : "Set as primary"}
                >
                  {index === primaryIndex ? (
                    <Star className="w-3 h-3 fill-current" />
                  ) : (
                    <StarOff className="w-3 h-3" />
                  )}
                </Button>
                
                {/* Primary Badge */}
                {index === primaryIndex && (
                  <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Primary
                  </div>
                )}
                
                {/* Image Number */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Drag images to reorder them. Click the star icon to set an image as primary.
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <ImageIcon className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Photo Tips:</p>
            <ul className="text-xs space-y-1">
              <li>• Include exterior shots from all angles</li>
              <li>• Add interior photos showing dashboard and seats</li>
              <li>• Take photos in good lighting conditions</li>
              <li>• Show any unique features or recent upgrades</li>
              <li>• Drag images to change their order</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
