'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Cart } from '@/lib/shopify';

type CartContextType = {
  cart: Cart | null;
  itemCount: number;
  loading: boolean;
  addToCart: (merchandiseId: string, quantity: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  checkoutUrl: string | null;
};

const CartContext = createContext<CartContextType | null>(null);

async function cartFetch(action: string, params: Record<string, unknown>): Promise<Cart> {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...params }),
  });
  const { cart, error } = await res.json();
  if (error) throw new Error(error);
  return cart;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cartId = localStorage.getItem('shopify_cart_id');
    if (cartId) {
      fetch(`/api/cart?cartId=${encodeURIComponent(cartId)}`)
        .then((r) => r.json())
        .then(({ cart: c }) => {
          if (c) setCart(c);
          else localStorage.removeItem('shopify_cart_id');
        });
    }
  }, []);

  const addToCart = useCallback(async (merchandiseId: string, quantity: number) => {
    setLoading(true);
    try {
      const cartId = localStorage.getItem('shopify_cart_id');
      let updated: Cart;
      if (cartId) {
        updated = await cartFetch('add', { cartId, merchandiseId, quantity });
      } else {
        updated = await cartFetch('create', { merchandiseId, quantity });
        localStorage.setItem('shopify_cart_id', updated.id);
      }
      setCart(updated);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    if (!cart) return;
    setLoading(true);
    try {
      const updated = await cartFetch('update', { cartId: cart.id, lineId, quantity });
      setCart(updated);
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const removeItem = useCallback(async (lineId: string) => {
    if (!cart) return;
    setLoading(true);
    try {
      const updated = await cartFetch('remove', { cartId: cart.id, lineId });
      setCart(updated);
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const itemCount = cart?.lines.reduce((sum, line) => sum + line.quantity, 0) ?? 0;

  return (
    <CartContext.Provider value={{
      cart,
      itemCount,
      loading,
      addToCart,
      updateQuantity,
      removeItem,
      checkoutUrl: cart?.checkoutUrl ?? null,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
