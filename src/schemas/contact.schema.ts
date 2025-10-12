import * as yup from 'yup';

export const contactFormSchema = yup.object().shape({
  name: yup.string().required('Numele este obligatoriu'),
  email: yup.string().email('Adresă de email invalidă').required('Email-ul este obligatoriu'),
  phone: yup.string().matches(/^[0-9+\-\s()]*$/, 'Număr de telefon invalid'),
  subject: yup.string().required('Subiectul este obligatoriu'),
  message: yup.string().required('Mesajul este obligatoriu').min(10, 'Mesajul trebuie să conțină cel puțin 10 caractere'),
});

export type ContactFormData = yup.InferType<typeof contactFormSchema>;
