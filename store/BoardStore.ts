import { ID, databases } from '@/appwrite';
import { getTodosGroupByColumn } from '@/lib/getTodosGroupedByColumns';
import uploadImage from '@/lib/uploadImage';
import { Board, Column, Image, Todo, TypedColumn } from '@/typings';
import { create } from 'zustand'

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  newTaskInput: string;
  setNewTaskInput: (input: string) => void;
  image: File | null;
  setImage: (image: File | null) => void;

   searchString: string;
  setSearchString: (searchString: string) => void;
  newTaskType: TypedColumn;
  setNewTaskType: (columnId: TypedColumn) => void;
  
  // Database functions
  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  board: {
    columns: new Map<TypedColumn, Column>()
  },
  searchString: "",
  setSearchString: (searchString) => set({ searchString }),

  getBoard: async () => {
    const board = await getTodosGroupByColumn();
    set({ board })
  },

  image: null,
  setImage: (image) => set({image}),

  newTaskInput: "",
  setNewTaskInput: (input) => set({newTaskInput: input}),
  setBoardState: (board) => set({ board }),

  updateTodoInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId
      })
  },

  newTaskType: "done",
  setNewTaskType: (columnId) => set({newTaskType: columnId}),

  addTask: async (todo: string, columnId: TypedColumn, image?: File | null)  => {
    let file: Image | undefined;
    if(image) {
      const fileUploaded = await uploadImage(image);
      if(fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id
        }
      }
    }

    const {$id} = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ... (file && {image: JSON.stringify(file)})
      }
    );

    set({newTaskInput: ""});
    
    set((state) => {
      const newColumns = new Map(state.board.columns);
      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(file && {image: file})
      }

      const column = newColumns.get(columnId);

      if(!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo]
        })
      } else {
        newColumns.get(columnId)?.todos.push(newTodo)
      }

      return {
        board: {
          columns: newColumns
        }
      }
    })


  }

}))