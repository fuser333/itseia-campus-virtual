import { redirect } from 'next/navigation';

// La información del preuniversitario se consolidó en itseia.ai/preuniversitario
// Esta ruta redirige permanentemente a la nueva landing oficial
export default function PreuniInfoRedirect() {
  redirect('https://itseia.ai/preuniversitario/');
}

export const metadata = {
  title: 'Preuniversitario ITSEIA Ignite',
  description: 'Redirigiendo a itseia.ai/preuniversitario',
  robots: { index: false, follow: false },
};
