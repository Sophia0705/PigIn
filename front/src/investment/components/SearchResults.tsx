import React from "react";

interface SearchResultsProps<T> {
  filteredItems: T[];
  ItemComponent: React.FC<T>;
}

const SearchResults = <T extends { name: string }>({
  filteredItems,
  ItemComponent,
}: SearchResultsProps<T>) => {
  return (
    <div className="bg-white rounded-2xl p-4 mt-4 shadow-md w-full max-w-md">
      {filteredItems.length === 0 ? (
        <p className="text-gray-500">검색 결과가 없습니다.</p>
      ) : (
        filteredItems.map((item, index) => (
          <ItemComponent key={index} {...item} />
        ))
      )}
    </div>
  );
};

export default SearchResults;
