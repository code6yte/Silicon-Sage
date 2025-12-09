'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [roadmapRoles, setRoadmapRoles] = useState(null);
  const [programmingLanguages, setProgrammingLanguages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);

        // Check localStorage first
        const cachedRoles = localStorage.getItem('roadmapRoles');
        const cachedLanguages = localStorage.getItem('programmingLanguages');
        const cacheTimestamp = localStorage.getItem('dataCacheTimestamp');

        // If cache exists and is less than 24 hours old, use it
        if (
          cachedRoles &&
          cachedLanguages &&
          cacheTimestamp &&
          Date.now() - parseInt(cacheTimestamp) < 24 * 60 * 60 * 1000
        ) {
          setRoadmapRoles(JSON.parse(cachedRoles));
          setProgrammingLanguages(JSON.parse(cachedLanguages));
          setLoading(false);
          return;
        }

        // Fetch from server if not cached
        const [rolesRes, languagesRes] = await Promise.all([
          fetch('/api/roadmap-roles'),
          fetch('/api/programming-languages'),
        ]);

        if (!rolesRes.ok || !languagesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const roles = await rolesRes.json();
        const languages = await languagesRes.json();

        // Store in localStorage
        localStorage.setItem('roadmapRoles', JSON.stringify(roles));
        localStorage.setItem('programmingLanguages', JSON.stringify(languages));
        localStorage.setItem('dataCacheTimestamp', Date.now().toString());

        setRoadmapRoles(roles);
        setProgrammingLanguages(languages);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        roadmapRoles,
        programmingLanguages,
        loading,
        error,
        clearCache: () => {
          localStorage.removeItem('roadmapRoles');
          localStorage.removeItem('programmingLanguages');
          localStorage.removeItem('dataCacheTimestamp');
          setRoadmapRoles(null);
          setProgrammingLanguages(null);
        },
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
