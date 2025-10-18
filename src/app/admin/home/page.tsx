'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, X, Upload, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { uploadHomeImage, deleteHomeImage } from '@/utils/fileUpload';

import type { HomeSection } from '@/types/home';

interface Category {
  id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
}

export default function HomePage() {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<Partial<HomeSection> | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch home sections and categories from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch categories first
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (categoriesError) throw categoriesError;

        if (categoriesData) {
          setCategories(categoriesData);
        }

        // Fetch home sections
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('home_sections')
          .select('*')
          .order('display_order', { ascending: true });

        if (sectionsError) throw sectionsError;

        if (sectionsData) {
          setSections(sectionsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Eroare la încărcarea datelor');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (section: HomeSection) => {
    setCurrentSection(section);
    setIsDialogOpen(true);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentSection) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Te rog să selectezi doar fișiere imagine (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Fișierul trebuie să fie mai mic de 5MB');
      return;
    }

    try {
      setIsUploading(true);

      const uploadResult = await uploadHomeImage(file, currentSection.id);

      if (uploadResult.success && uploadResult.url) {
        setCurrentSection({
          ...currentSection,
          image_url: uploadResult.url
        });
        toast.success('Imagine încărcată cu succes!');
      } else {
        toast.error(uploadResult.error || 'Eroare la încărcarea imaginii');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Eroare la încărcarea imaginii');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Sunteți sigur că doriți să ștergeți această secțiune?')) {
      try {
        // Delete image if exists
        const sectionToDelete = sections.find(s => s.id === id);
        if (sectionToDelete?.image_url) {
          await deleteHomeImage(sectionToDelete.image_url);
        }

        const { error } = await supabase
          .from('home_sections')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setSections(sections.filter(section => section.id !== id));
        toast.success('Secțiune ștearsă cu succes!');
      } catch (error) {
        console.error('Error deleting section:', error);
        toast.error('Eroare la ștergerea secțiunii');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSection) return;

    try {
      setIsLoading(true);

      // Validate required fields
      if (!currentSection.title || !currentSection.description) {
        throw new Error('Titlul și descrierea sunt obligatorii');
      }

      const sectionData = {
        title: currentSection.title,
        description: currentSection.description,
        image_url: currentSection.image_url || null,
        link_url: currentSection.link_url || null,
        link_text: currentSection.link_text || null,
        category: currentSection.category || null,
        is_active: currentSection.is_active !== false,
        display_order: currentSection.display_order || sections.length,
        updated_at: new Date().toISOString()
      };

      if (currentSection.id) {
        // Update existing section
        const existingSection = sections.find(s => s.id === currentSection.id);
        if (existingSection?.image_url && existingSection.image_url !== currentSection.image_url) {
          await deleteHomeImage(existingSection.image_url);
        }

        const { data, error } = await supabase
          .from('home_sections')
          .update(sectionData)
          .eq('id', currentSection.id)
          .select()
          .single();

        if (error) throw error;

        setSections(sections.map(s => s.id === currentSection.id ? data : s));
        toast.success('Secțiune actualizată cu succes!');
      } else {
        // Add new section
        const { data, error } = await supabase
          .from('home_sections')
          .insert([{
            ...sectionData,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (error) throw error;

        setSections([...sections, data]);
        toast.success('Secțiune adăugată cu succes!');
      }

      setIsDialogOpen(false);
      setCurrentSection(null);
    } catch (error) {
      console.error('Error saving section:', error);
      toast.error('Eroare la salvarea secțiunii');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReorder = async (sectionId: string, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex(s => s.id === sectionId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const newSections = [...sections];
    [newSections[currentIndex], newSections[newIndex]] = [newSections[newIndex], newSections[currentIndex]];

    // Update display_order for all sections
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      display_order: index
    }));

    setSections(updatedSections);

    try {
      const { error } = await supabase
        .from('home_sections')
        .upsert(updatedSections.map(({ created_at, updated_at, ...section }) => ({
          ...section,
          updated_at: new Date().toISOString()
        })));

      if (error) throw error;
    } catch (error) {
      console.error('Error reordering sections:', error);
      toast.error('Eroare la reordonarea secțiunilor');
      // Revert changes on error
      window.location.reload();
    }
  };

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Secțiuni Pagina Principală</h1>
            <p className="text-muted-foreground">
              Gestionează secțiunile care apar pe pagina principală
            </p>
          </div>
          <Button onClick={() => {
            setCurrentSection({
              title: '',
              description: '',
              image_url: '',
              link_url: '',
              link_text: '',
              category: '',
              is_active: true,
              display_order: sections.length
            });
            setIsDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Adaugă secțiune
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Caută secțiuni..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSections.map((section, index) => (
              <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {section.image_url && (
                      <div className="flex-shrink-0 h-12 w-12 relative">
                        <Image
                          src={section.image_url}
                          alt={section.title}
                          fill
                          className="rounded-lg object-cover"
                          sizes="48px"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                      <p className="text-sm text-gray-500">
                        {section.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          section.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {section.is_active ? 'Activ' : 'Inactiv'}
                        </span>
                        {section.category && (
                          <span className="text-xs text-amber-600">
                            Categorie: {categories.find(c => c.id === section.category)?.name || 'Necunoscută'}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">Ordine: {section.display_order}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleReorder(section.id, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleReorder(section.id, 'down')}
                      disabled={index === sections.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(section)}
                      className="text-amber-600 hover:text-amber-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(section.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section Form Dialog */}
        {isDialogOpen && currentSection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {currentSection.id ? 'Editează secțiune' : 'Adaugă secțiune nouă'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsDialogOpen(false);
                      setCurrentSection(null);
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Titlu *
                    </label>
                    <input
                      type="text"
                      id="title"
                      required
                      value={currentSection.title || ''}
                      onChange={(e) => setCurrentSection({...currentSection, title: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Descriere *
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      required
                      value={currentSection.description || ''}
                      onChange={(e) => setCurrentSection({...currentSection, description: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                      Imagine
                    </label>
                    <div className="mt-1 flex items-center space-x-4">
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                      />
                      {isUploading && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                      )}
                    </div>
                    {currentSection.image_url && (
                      <div className="mt-2">
                        <img
                          src={currentSection.image_url}
                          alt="Preview"
                          className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Selectează o imagine pentru secțiune (JPG, PNG, max 5MB)
                    </p>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Categorie meniu (opțional)
                    </label>
                    <select
                      id="category"
                      value={currentSection.category || ''}
                      onChange={(e) => setCurrentSection({...currentSection, category: e.target.value || null})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                    >
                      <option value="">Nicio categorie selectată</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-gray-500">
                      Dacă este selectată, butonul va direcționa către această categorie în meniu
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="link_text" className="block text-sm font-medium text-gray-700">
                        Text buton (opțional)
                      </label>
                      <input
                        type="text"
                        id="link_text"
                        value={currentSection.link_text || ''}
                        onChange={(e) => setCurrentSection({...currentSection, link_text: e.target.value})}
                        placeholder="Vezi selecția"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="isActive"
                      name="isActive"
                      type="checkbox"
                      checked={currentSection.is_active !== false}
                      onChange={(e) => setCurrentSection({...currentSection, is_active: e.target.checked})}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Secțiune activă
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setCurrentSection(null);
                      }}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      Anulează
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      {currentSection.id ? 'Actualizează' : 'Adaugă'} secțiune
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
