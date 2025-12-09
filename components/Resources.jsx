'use client';

import { useData } from '@/app/context/DataContext';
import Card from "./card";

const Resources = () => {
  const { programmingLanguages, loading, error } = useData();

  if (loading) {
    return (
      <div className="w-full px-4 py-4 my-1 flex flex-wrap justify-evenly mt-5">
        <p className="text-white">Loading languages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 py-4 my-1 flex flex-wrap justify-evenly mt-5">
        <p className="text-red-500">Error loading data: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full px-4 py-4 my-1 flex flex-wrap justify-evenly mt-5">
        {programmingLanguages?.map(({ lang, year, inventor, version, use, documentation, logoUrl, youtubePlaylist, frameworks, quickRef }) => (
          <Card
            key={version}
            lan={lang}
            y={year}
            cheat={quickRef}
            inven={inventor}
            vers={version}
            uses={use}
            docs={documentation}
            log={logoUrl}
            youtub={youtubePlaylist}
            frame={frameworks}
          />
        ))}
      </div>
    </>
  );
};
export default Resources;