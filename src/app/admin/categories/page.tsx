'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  image_url?: string | null;
  image_file?: File | null;
  created_at: string;
  updated_at?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);

  // Fetch categories from Supabase
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Eroare la încărcarea categoriilor');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Sunteți sigur că doriți să ștergeți această categorie? Această acțiune nu poate fi anulată.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchCategories();
      toast.success('Categorie ștearsă cu succes!');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Eroare la ștergerea categoriei. Asigurați-vă că nu există produse în această categorie.');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchCategories();
      toast.success(`Categorie ${!currentStatus ? 'activată' : 'dezactivată'} cu succes!`);
    } catch (error) {
      console.error('Error updating category status:', error);
      toast.error('Eroare la actualizarea stării categoriei');
    }
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    if (!file) return null;
    
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `categories/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('category-images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('category-images')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Eroare la încărcarea imaginii');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCategory?.name) {
      toast.error('Numele categoriei este obligatoriu');
      return;
    }

    try {
      const isNew = !currentCategory.id;
      let imageUrl = currentCategory.image_url || null;

      // Handle image upload if a new file is selected
      if (currentCategory.image_file) {
        const url = await handleImageUpload(currentCategory.image_file);
        if (url) imageUrl = url;
      }

      const categoryData = {
        name: currentCategory.name,
        description: currentCategory.description || null,
        is_active: currentCategory.is_active !== false,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      };

      if (isNew) {
        const { error } = await supabase
          .from('categories')
          .insert([{ ...categoryData }])
          .select();
        
        if (error) throw error;
        toast.success('Categorie adăugată cu succes!');
      } else {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', currentCategory.id);
        
        if (error) throw error;
        toast.success('Categorie actualizată cu succes!');
      }
      
      await fetchCategories();
      setIsDialogOpen(false);
      setCurrentCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Eroare la salvarea categoriei');
    }
  };

  const filteredCategories = categories
    .filter(category => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        category.name.toLowerCase().includes(search) ||
        (category.description?.toLowerCase() || '').includes(search)
      );
    })
    .sort((a, b) => {
      // Sort by is_active first (active first), then by name
      if (a.is_active === b.is_active) {
        return a.name.localeCompare(b.name);
      }
      return a.is_active ? -1 : 1;
    });

  return (
    <ProtectedRoute>
      <div className="space-y-6 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg shadow-sm">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Categorii Produse</h1>
            <p className="text-muted-foreground mt-1">
              Gestionează și organizează categoriile de produse
            </p>
          </div>
          <Button 
            onClick={() => {
              setCurrentCategory({
                name: '',
                description: '',
                is_active: true,
                image_url: null
              });
              setIsDialogOpen(true);
            }}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adaugă categorie
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Caută categorii după nume sau descriere..."
              className="pl-10 py-6 text-base"
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <p className="text-sm text-gray-500 mt-2">
            {filteredCategories.length} categorii {searchTerm ? 'găsite' : 'în total'}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-amber-600 mb-2" />
              <p className="text-gray-600">Se încarcă categoriile...</p>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <Search className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nicio categorie găsită</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm 
                ? 'Încercați alt termen de căutare.' 
                : 'Începeți prin a adăuga o categorie nouă.'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <Button 
                  onClick={() => {
                    setCurrentCategory({
                      name: '',
                      description: '',
                      is_active: true,
                      image_url: null
                    });
                    setIsDialogOpen(true);
                  }}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adaugă prima categorie
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul role="list" className="divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <li key={category.id} className="hover:bg-gray-50 transition-colors">
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-start">
                      {category.image_url && (
                        <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100 mr-4">
                          <Image
                            src={category.image_url}
                            alt={category.name}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-medium text-gray-900 truncate">
                            {category.name}
                          </h2>
                          <div className="ml-2 flex-shrink-0 flex space-x-2">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(category.id, category.is_active)}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                category.is_active 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              {category.is_active ? 'Activă' : 'Inactivă'}
                            </button>
                            <button
                              onClick={() => handleEdit(category)}
                              className="p-1.5 text-gray-400 hover:text-amber-600 rounded-full hover:bg-amber-50"
                              title="Editează"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(category.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
                              title="Șterge"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        {category.description && (
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {category.description}
                          </p>
                        )}
                        
                        <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500">
                          <span className="mr-4">
                            Creată: {new Date(category.created_at).toLocaleDateString('ro-RO')}
                          </span>
                          <span className="flex items-center">
                            <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                              category.is_active ? 'bg-green-400' : 'bg-gray-300'
                            }`}></span>
                            {category.is_active ? 'Vizibilă în meniu' : 'Ascunsă'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Category Form Dialog */}
        {isDialogOpen && currentCategory && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentCategory.id ? 'Editează categoria' : 'Categorie nouă'}
                  </h2>
                  <button 
                    onClick={() => {
                      setIsDialogOpen(false);
                      setCurrentCategory(null);
                    }}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                    aria-label="Închide"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Imagine categorie (opțional)
                    </label>
                    <div className="mt-1 flex items-center">
                      <div className={`relative ${currentCategory.image_url ? 'w-32 h-32' : 'w-20 h-20'} border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden`}>
                        {currentCategory.image_url ? (
                          <>
                            <Image
                              src={currentCategory.image_url}
                              alt={currentCategory.name || 'Imagine categorie'}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => setCurrentCategory({...currentCategory, image_url: null})}
                              className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-600 p-1 rounded-full shadow-sm"
                              title="Șterge imaginea"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <div className="text-center p-2">
                            <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="mt-1 text-xs text-gray-500">PNG, JPG</p>
                          </div>
                        )}
                        <input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setCurrentCategory({
                                ...currentCategory,
                                image_file: file,
                                image_url: URL.createObjectURL(file)
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="ml-4 text-sm">
                        <label
                          htmlFor="image-upload"
                          className="relative cursor-pointer rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500"
                        >
                          <span>{currentCategory.image_url ? 'Schimbă' : 'Încarcă'}</span>
                          <input id="image-upload" name="image-upload" type="file" className="sr-only" />
                        </label>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG până la 2MB</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nume categorie <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        id="name"
                        required
                        value={currentCategory.name || ''}
                        onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm py-3 px-4 border"
                        placeholder="De ex: Cafea, Deserturi, etc."
                      />
                    </div>
                  </div>
                  
                  {/* Description Field */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Descriere
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        rows={3}
                        value={currentCategory.description || ''}
                        onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})}
                        className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm py-3 px-4"
                        placeholder="O scurtă descriere a categoriei (opțional)"
                      />
                    </div>
                  </div>
                  
                  {/* Active Toggle */}
                  <div className="flex items-center">
                    <div className="flex items-center h-5">
                      <input
                        id="is_active"
                        name="is_active"
                        type="checkbox"
                        checked={currentCategory.is_active !== false}
                        onChange={(e) => setCurrentCategory({...currentCategory, is_active: e.target.checked})}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="is_active" className="font-medium text-gray-700">
                        Categorie activă
                      </label>
                      <p className="text-gray-500">
                        {currentCategory.is_active ? 'Vizibilă în meniul principal' : 'Ascunsă din meniu'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Form Actions */}
                  <div className="pt-6 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setCurrentCategory(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      Renunță
                    </button>
                    <button
                      type="submit"
                      disabled={isUploading || !currentCategory.name}
                      className={`inline-flex justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        isUploading || !currentCategory.name
                          ? 'bg-amber-400 cursor-not-allowed'
                          : 'bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500'
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                          Se încarcă...
                        </>
                      ) : currentCategory.id ? (
                        'Salvează modificări'
                      ) : (
                        'Adaugă categoria'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
