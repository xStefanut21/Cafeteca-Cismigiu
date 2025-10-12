import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panou de administrare - Cafeteca Cismigiu',
  description: 'Panou de administrare pentru Cafeteca Cismigiu',
};

export default function AdminHead() {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </>
  );
}
