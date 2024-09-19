// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { clientAxios } from "@/utils/clientAxios";

interface IAuthStore {
  hydrated: boolean;
  accountLoading: boolean;
  accountName: string;
  isLoggedIn: boolean | null;

  reinstate(): Promise<void>;

  signin(
    email: string,
    password: string
  ): Promise<{
    error?: string;
  }>;

  signup(
    email: string,
    password: string,
    name: string
  ): Promise<{
    error?: string;
  }>;

  signout(): Promise<{
    error?: string;
  }>;

  setHydrated(): void;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      hydrated: false,
      accountLoading: false,
      accountName: "",
      isLoggedIn: null,
      async reinstate(){
        set({ accountLoading: true });
        try {
          await clientAxios.get("/auth/user").then(res=>{
            const data = res.data;
             const { name } = data.data;
            set({ accountName: name})
          });
          set({ isLoggedIn: true });
          set({accountLoading:false})
        } catch (e) {
            set({accountLoading:false,
            isLoggedIn: false,
            accountName: ""
            })
          // return { error: e.response.data.message };
        }
      },

      async signin(email, password) {
        set({ accountLoading: true });
        try {
          await clientAxios.post("/auth/signin", { email, password });
          set({ isLoggedIn: true, accountName: email });
          set({accountLoading:false})
        } catch (e) {
            set({accountLoading:false})
          return { error: e.response.data.message };
        }
      },

      async signup(email, password, name) {
        set({ accountLoading: true });
        try {
          await clientAxios.post("/auth/signup", { email, password, name });
          set({ isLoggedIn: true, accountName: name });
          set({accountLoading:false})
        } catch (e) {
            set({accountLoading:false})
          return { error: e.response.data.message };
        }
      },

      signout() {
        try {
          set({ accountLoading: true });
          clientAxios.post("/auth/signout");
          set({ isLoggedIn: false, accountName: "" });
          set({accountLoading:false})
        } catch (e) {
            set({accountLoading:false})
          return { error: e.response.data.message };
        }
      },

      setHydrated() {
        set({ hydrated: true });
      },
    })),
    {
      name: "auth",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    }
  )
);
