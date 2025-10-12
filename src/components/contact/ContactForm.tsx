'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().min(2, 'Numele trebuie să aibă cel puțin 2 caractere'),
  email: z.string().email('Adresă de email invalidă'),
  subject: z.string().min(5, 'Subiectul trebuie să aibă cel puțin 5 caractere'),
  message: z.string().min(10, 'Mesajul trebuie să aibă cel puțin 10 caractere'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsLoading(true);
    
    try {
      // Here you would typically send the form data to your API
      console.log('Form submitted:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Mesajul tău a fost trimis cu succes! Vă vom contacta în curând.');
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('A apărut o eroare la trimiterea mesajului. Vă rugăm să încercați din mai târziu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-amber-900">
            Nume complet *
          </label>
          <Input
            id="name"
            placeholder="Introduceți numele dumneavoastră"
            {...register('name')}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-amber-900">
            Email *
          </label>
          <Input
            id="email"
            type="email"
            placeholder="email@dvs.com"
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="block text-sm font-medium text-amber-900">
          Subiect *
        </label>
        <Input
          id="subject"
          placeholder="Despre ce doriți să ne contactați?"
          {...register('subject')}
          className={errors.subject ? 'border-red-500' : ''}
        />
        {errors.subject && (
          <p className="text-sm text-red-600">{errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-amber-900">
          Mesajul dumneavoastră *
        </label>
        <Textarea
          id="message"
          rows={5}
          placeholder="Scrieți mesajul dumneavoastră aici..."
          {...register('message')}
          className={errors.message ? 'border-red-500' : ''}
        />
        {errors.message && (
          <p className="text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          className="bg-amber-800 hover:bg-amber-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Se trimite...' : 'Trimite mesajul'}
        </Button>
      </div>
    </form>
  );
}
