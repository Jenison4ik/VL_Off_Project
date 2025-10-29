"use client";
import searchAddress from "@/services/searchAddress";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import style from "./Search.module.scss";

function useDeounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    Array<{ full_address: string; building_id: string }>
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const debouncedQuery = useDeounce(query, 0);

  useEffect(() => {
    let isCancelled = false;
    async function run() {
      if (!debouncedQuery || debouncedQuery.trim().length < 2) {
        setResults([]);
        setActiveIndex(-1);
        return;
      }
      setIsLoading(true);
      try {
        const data = await searchAddress(debouncedQuery.trim());
        if (!isCancelled) {
          setResults(data ?? []);
          setActiveIndex(data && data.length > 0 ? 0 : -1);
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }
    run();
    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery]);

  return {
    query,
    setQuery,
    results,
    isOpen,
    setIsOpen,
    isLoading,
    activeIndex,
    setActiveIndex,
  };
}

export default function Search() {
  const {
    query,
    setQuery,
    results,
    isOpen,
    setIsOpen,
    isLoading,
    activeIndex,
    setActiveIndex,
  } = useSearch();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [setIsOpen]);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "Enter")) {
      setIsOpen(true);
      return;
    }
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        const picked = results[activeIndex];
        router.push(`/address/${picked.building_id}`);
        setIsOpen(false);
      }
    }
  }

  function onPick(index: number) {
    const picked = results[index];
    router.push(`/address/${picked.building_id}`);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className={style.searchContainer}>
      <input
        className={style.input}
        type="text"
        placeholder="Поиск по адресу"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!isOpen) setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={onKeyDown}
      />

      {isOpen && (
        <div className={style.dropdown}>
          {isLoading && <div className={style.loading}>Загрузка…</div>}
          {!isLoading && results.length === 0 && query.trim().length >= 2 && (
            <div className={style.empty}>Ничего не найдено</div>
          )}
          {!isLoading &&
            results.map((item, idx) => (
              <div
                key={item.building_id + idx}
                className={
                  idx === activeIndex
                    ? `${style.item} ${style.itemActive}`
                    : style.item
                }
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onPick(idx);
                }}
              >
                {item.full_address}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
