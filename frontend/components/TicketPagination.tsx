interface TicketPaginationProps {
  page: number;
  hasMore: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export default function TicketPagination({ page, hasMore, onPrev, onNext }: TicketPaginationProps) {
  return (
    <div className="p-4 border-t dark:border-gray-700 flex justify-between">
      <button 
        disabled={page === 0} 
        onClick={onPrev}
        className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        Previous
      </button>
      <button 
        disabled={!hasMore} 
        onClick={onNext}
        className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        Next
      </button>
    </div>
  );
}
