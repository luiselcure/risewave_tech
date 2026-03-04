import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // Auth State
      user: null,
      token: null,
      isAuthenticated: false,
      
      // Cart State
      cart: [],
      
      // Auth Actions
      setUser: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),
      
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
      
      // Cart Actions
      addToCart: (product) => {
        const { cart } = get();
        // Generar un ID único para la línea del carrito: id producto + color seleccionado
        const cartItemId = `${product.id}-${product.color || 'default'}`;
        const existingItemIndex = cart.findIndex((item) => item.cartItemId === cartItemId);
        
        if (existingItemIndex >= 0) {
          const newCart = [...cart];
          newCart[existingItemIndex] = {
            ...newCart[existingItemIndex],
            quantity: newCart[existingItemIndex].quantity + 1
          };
          set({ cart: newCart });
        } else {
          set({
            cart: [...cart, { ...product, cartItemId, quantity: 1 }],
          });
        }
      },
      
      removeFromCart: (cartItemId) =>
        set({
          cart: get().cart.filter((item) => item.cartItemId !== cartItemId),
        }),
      
      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(cartItemId);
          return;
        }
        
        set({
          cart: get().cart.map((item) =>
            item.cartItemId === cartItemId ? { ...item, quantity } : item
          ),
        });
      },
      
      clearCart: () => set({ cart: [] }),
      
      // Cart Getters
      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.precio * item.quantity, 0);
      },
      
      getCartCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'risewave-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        cart: state.cart,
      }),
    }
  )
);

export default useStore;
