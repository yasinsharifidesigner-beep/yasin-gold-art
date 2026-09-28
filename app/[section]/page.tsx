import App from '@/components/App';
export function generateStaticParams() { return ['courses','marketplace','orders','journal','about','contact','challenges','profile','auth'].map(section => ({ section })); }
export default function Section({ params }: { params: { section: string } }) { return <App section={params.section} />; }
