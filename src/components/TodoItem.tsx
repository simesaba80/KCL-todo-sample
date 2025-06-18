interface TodoItemProps {
  id: number;
  text: string;
  completed: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ id, text, completed, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <span
        className={`flex-1 ${
          completed
            ? 'text-gray-500 line-through'
            : 'text-gray-800'
        }`}
      >
        {text}
      </span>
      <button
        onClick={() => onDelete(id)}
        className="px-2 py-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
      >
        削除
      </button>
    </div>
  );
}