import { useState, useEffect, useCallback } from 'react';
import { productsAPI, Product } from '../services/api';

// Map backend Product (mrp) → app Product (mandiPrice)
export function mapProduct(p: Product): Product {
  return { ...p, mandiPrice: p.mandiPrice ?? p.mrp };
}

// Static fallback
const FALLBACK: Product[] = [
  { _id: 'p1', name: 'Fresh Tomatoes', nameHi: 'ताज़े टमाटर', price: 25, mrp: 18, mandiPrice: 18, unit: '1 kg',   category: 'veggies', isAvailable: true, comingSoon: false, stock: 99, rating: 4.8, totalSold: 240, images: ['https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400'] },
  { _id: 'p2', name: 'Potatoes',       nameHi: 'आलू',         price: 22, mrp: 15, mandiPrice: 15, unit: '1 kg',   category: 'veggies', isAvailable: true, comingSoon: false, stock: 99, rating: 4.7, totalSold: 180, images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400'] },
  { _id: 'p3', name: 'Onions',         nameHi: 'प्याज़',      price: 28, mrp: 20, mandiPrice: 20, unit: '1 kg',   category: 'veggies', isAvailable: true, comingSoon: false, stock: 99, rating: 4.6, totalSold: 160, images: ['https://images.unsplash.com/photo-1508747703725-719777637510?w=400'] },
  { _id: 'p4', name: 'Cauliflower',    nameHi: 'फूलगोभी',    price: 35, mrp: 25, mandiPrice: 25, unit: '1 piece',category: 'veggies', isAvailable: true, comingSoon: false, stock: 99, rating: 4.5, totalSold: 120, images: ['https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?w=400'] },
  { _id: 'p5', name: 'Spinach',        nameHi: 'पालक',        price: 18, mrp: 12, mandiPrice: 12, unit: '500g',   category: 'veggies', isAvailable: true, comingSoon: false, stock: 99, rating: 4.7, totalSold: 100, images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400'] },
  { _id: 'p6', name: 'Bitter Gourd',   nameHi: 'करेला',       price: 42, mrp: 30, mandiPrice: 30, unit: '500g',   category: 'veggies', isAvailable: true, comingSoon: false, stock: 99, rating: 4.4, totalSold: 80,  images: ['https://images.unsplash.com/photo-1571086430599-65c4a5ad13c1?w=400'] },
  { _id: 'p7', name: 'Ginger',         nameHi: 'अदरक',        price: 80, mrp: 60, mandiPrice: 60, unit: '250g',   category: 'spices',  isAvailable: true, comingSoon: false, stock: 99, rating: 4.8, totalSold: 90,  images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400'] },
  { _id: 'p8', name: 'Garlic',         nameHi: 'लहसुन',       price: 100,mrp: 80, mandiPrice: 80, unit: '250g',   category: 'spices',  isAvailable: true, comingSoon: false, stock: 99, rating: 4.6, totalSold: 85,  images: ['https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=400'] },
  { _id: 'p9', name: 'Green Chili',    nameHi: 'हरी मिर्च',  price: 30, mrp: 20, mandiPrice: 20, unit: '250g',   category: 'spices',  isAvailable: true, comingSoon: false, stock: 99, rating: 4.5, totalSold: 70,  images: ['https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400'] },
  { _id: 'p10',name: 'Capsicum',       nameHi: 'शिमला मिर्च', price: 40, mrp: 30, mandiPrice: 30, unit: '500g',   category: 'veggies', isAvailable: true, comingSoon: false, stock: 99, rating: 4.5, totalSold: 60,  images: ['https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400'] },
];

export { FALLBACK as FALLBACK_PRODUCTS };

export function useProducts(category?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { products: raw } = await productsAPI.getAll(
        category ? { category } : undefined
      );
      const mapped = raw
        .filter(p => p.isAvailable && !p.comingSoon)
        .map(mapProduct);
      setProducts(mapped);
      setFromCache(false);
    } catch (e: any) {
      const filtered = category
        ? FALLBACK.filter(p => p.category === category)
        : FALLBACK;
      setProducts(filtered);
      setFromCache(true);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { products, loading, error, fromCache, refetch: fetch_ };
}

export function useProductSearch(query: string) {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { products: raw } = await productsAPI.getAll({ search: query });
        setResults(raw.map(mapProduct));
      } catch {
        setResults(
          FALLBACK.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            (p.nameHi ?? '').includes(query)
          )
        );
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  return { results, loading };
}
