'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deliveryLocationsApi, DeliveryLocation } from '../../lib/api/cart';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, MapPin, Package, Check, X, Grid, List } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface DeliveryLocationFormData {
  name: string;
  slug: string;
  city: string;
  shippingPrice: string | number;
  isActive: boolean;
}

export default function DeliveryLocationsPage() {
  const router = useRouter();
  const [locations, setLocations] = useState<DeliveryLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<DeliveryLocation | null>(null);
  const [formData, setFormData] = useState<DeliveryLocationFormData>({
    name: '',
    slug: '',
    city: '',
    shippingPrice: '',
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [locationsPerPage] = useState(12);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data = await deliveryLocationsApi.getAll(true);
      setLocations(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch delivery locations');
      console.error('Error fetching delivery locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = locations.filter(location => {
    const searchTerm = debouncedSearch?.toLowerCase() || '';
    return (
      (location.name?.toLowerCase() || '').includes(searchTerm) ||
      (location.city?.toLowerCase() || '').includes(searchTerm) ||
      (location.slug?.toLowerCase() || '').includes(searchTerm)
    );
  });

  // Pagination logic
  const paginatedLocations = filteredLocations.slice(
    (currentPage - 1) * locationsPerPage,
    currentPage * locationsPerPage
  );
  const totalPages = Math.ceil(filteredLocations.length / locationsPerPage);

  const handleCreate = () => {
    setFormData({
      name: '',
      slug: '',
      city: '',
      shippingPrice: '',
      isActive: true,
    });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (location: DeliveryLocation) => {
    setSelectedLocation(location);
    setFormData({
      name: location.name,
      slug: location.slug,
      city: location.city,
      shippingPrice: location.shippingPrice,
      isActive: location.isActive,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (location: DeliveryLocation) => {
    setSelectedLocation(location);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (isEdit: boolean = false) => {
    try {
      setIsSubmitting(true);
      const submitData = {
        ...formData,
        shippingPrice: formData.shippingPrice === '' ? 0 : Number(formData.shippingPrice),
      };
      if (isEdit && selectedLocation) {
        await deliveryLocationsApi.update(selectedLocation.id, submitData);
        toast.success('Delivery location updated successfully');
        setIsEditModalOpen(false);
      } else {
        await deliveryLocationsApi.create(submitData);
        toast.success('Delivery location created successfully');
        setIsCreateModalOpen(false);
      }
      fetchLocations();
      setSelectedLocation(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save delivery location';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedLocation) return;

    try {
      setIsSubmitting(true);
      await deliveryLocationsApi.delete(selectedLocation.id);
      toast.success('Delivery location deleted successfully');
      fetchLocations();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete delivery location';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setSelectedLocation(null);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading delivery locations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchLocations}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Delivery Locations</h1>
            <p className="mt-2 text-gray-600">Manage delivery locations and shipping costs</p>
          </div>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Location
          </Button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-1 items-center gap-2">
            <Search className="text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search locations by name, city, or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Locations Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {paginatedLocations.map((location) => (
            <div key={location.id} className={`bg-white rounded-lg shadow-sm border p-6 transition-all duration-200 hover:shadow-md ${viewMode === 'list' ? 'flex items-center' : ''}`}>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
                  </div>
                  <Badge variant={location.isActive ? "default" : "secondary"}>
                    {location.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="h-4 w-4" />
                    <span>KES {location.shippingPrice.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600">{location.city}</p>
                  <p className="text-xs text-gray-500 font-mono">{location.slug}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(location)}
                  className="flex items-center"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(location)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No delivery locations found</h3>
            <p className="text-gray-600 mb-4">
              {search ? 'Try adjusting your search terms.' : 'Get started by creating your first delivery location.'}
            </p>
            {!search && (
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Location
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="inline-flex -space-x-px">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              {[...Array(totalPages)].map((_, idx) => (
                <Button
                  key={idx + 1}
                  variant={currentPage === idx + 1 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </nav>
          </div>
        )}

        {/* Create/Edit Modal */}
        <Dialog open={isCreateModalOpen || isEditModalOpen} onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedLocation(null);
          }
        }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isEditModalOpen ? 'Edit Delivery Location' : 'Add Delivery Location'}
              </DialogTitle>
              <DialogDescription>
                {isEditModalOpen ? 'Update the delivery location details.' : 'Create a new delivery location with shipping costs.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Location Name *
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Nairobi CBD"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="slug" className="text-sm font-medium">
                  Slug *
                </label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="e.g., nairobi-cbd"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="city" className="text-sm font-medium">
                  City *
                </label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="e.g., Nairobi"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="shippingPrice" className="text-sm font-medium">
                  Shipping Price (KES) *
                </label>
                <Input
                  id="shippingPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.shippingPrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, shippingPrice: value === '' ? '' : parseFloat(value) }));
                  }}
                  placeholder="0.00"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Active
                </label>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsEditModalOpen(false);
                  setSelectedLocation(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleSubmit(isEditModalOpen)}
                disabled={isSubmitting || !formData.name || !formData.slug || !formData.city}
              >
                {isSubmitting ? 'Saving...' : (isEditModalOpen ? 'Update' : 'Create')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the delivery location "{selectedLocation?.name}". 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
} 