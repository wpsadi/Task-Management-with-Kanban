// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { $Enums } from "@prisma/client";
import { clientAxios } from "@/utils/clientAxios";

interface TaskStore {
  hydrated: boolean;

  taskData :{
    status: $Enums.Status;
    priority: $Enums.Priority;
    id: string;
    title: string;
    description: string;
    dueDate?: Date;
}[];
  getAllTasks(): Promise<{
    error?: string;
    data?:{
      status:boolean,
      data:{
        status: $Enums.Status;
        priority: $Enums.Priority;
        id: string;
        title: string;
        description: string;
        dueDate?: Date;
    }[]
  }
  }>;

  setTaskData(data:{
    status: $Enums.Status;
    priority: $Enums.Priority;
    id: string;
    title: string;
    description: string;
    dueDate?: Date;
}[]): void

  createTask(
    title: string,
    description: string,
    priority: $Enums.Priority,
    status: $Enums.Status,
    dueDate?: Date
  ): Promise<{
    error?: string;
  }>;

  editTask(
    taskId: string,
    title: string,
    description: string,
    priority: $Enums.Priority,
    status: $Enums.Status,
    dueDate?: Date
  ): Promise<{
    error?: string;
  }>;

  deleteTask(taskId: string): Promise<{
    error?: string;
  }>;
  

  setHydrated(): void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    immer((set) => ({
      hydrated: false,

      async getAllTasks() {
        try {
          const response = await clientAxios.get("/task/all");
          const data = await response.data;
          // set((state)=>{
          //   state!.taskData = data.data;
          // })
          // console.log(data.data);
          set({
            taskData: data.data,
          })
          return { data };
        } catch (e) {
          return { error: e.response.data.message };
        }
      },

      async createTask(title, description, priority, status, dueDate="") {
        try {
          if (dueDate=="") {
            await clientAxios.post("/task/new", {
              title,
              description,
              priority,
              status,
            });
          }
          else{
            await clientAxios.post("/task/new", {
              title,
              description,
              priority,
              status,
              dueDate,
            });
          }
         
          return {};
        } catch (e) {
          return { error: e.response.data.message };
        }
      },

      async editTask(taskId, title, description, priority, status, dueDate="") {
        try {
          if (dueDate=="") {
            await clientAxios.put("/task/edit", {
              taskId,
              title,
              description,
              priority,
              status,
            });
          }
          else{
            await clientAxios.put("/task/edit", {
              taskId,
              title,
              description,
              priority,
              status,
              dueDate,
            });
          }
          
          
          return {};
        } catch (e) {
          return { error: e.response.data.message };
        }
      },


      async deleteTask(taskId) {
        try {
            await clientAxios.delete("/task/delete", {
            data: { taskId },
            });
          return {};
        } catch (e) {
          return { error: e.response.data.message };
        }
      },

      setTaskData(data){
        set({taskData:data})
      },



      setHydrated() {
        set({ hydrated: true });
      },
    })),
    {
      name: "task",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    }
  )
);
