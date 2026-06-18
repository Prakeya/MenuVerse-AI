import React from 'react'

export default function SearchBar({ placeholder = 'Search dishes...' }: { placeholder?: string }) {
  return (
    <div className="w-full">
      <input
        type="search"
        placeholder={placeholder}
        className="input-base w-full px-4 py-3 text-sm text-primary placeholder:text-muted"
      />
    </div>
  )
}
