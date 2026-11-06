'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { articles as seedArticles, courses as seedCourses, products as seedProducts, tiers as seedTiers } from '@/lib/data';

type Catalog = {
  products: typeof seedProducts;
  courses: typeof seedCourses;
  articles: typeof seedArticles;
  tiers: typeof seedTiers;
};

const seed: Catalog = { products: seedProducts, courses: seedCourses, articles: seedArticles, tiers: seedTiers };
const CatalogContext = createContext<Catalog>(seed);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [catalog, setCatalog] = useState<Catalog>(seed);
  useEffect(() => {
    fetch('/api/catalog')
      .then(response => (response.ok ? response.json() : Promise.reject()))
      .then(data => setCatalog({ products: data.products, courses: data.courses, articles: data.articles, tiers: data.tiers }))
      .catch(() => setCatalog(seed));
  }, []);
  return <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}
