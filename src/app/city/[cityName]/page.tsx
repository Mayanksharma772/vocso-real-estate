'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useProjectStore } from '@/store/projectStore';
import { Project } from '@/types';
import ProjectCard from '@/components/ProjectCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProgressBar from '@/components/ProgressBar';

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <LoadingSpinner text="Loading map..." />
});

export default function CityPage() {
  const params = useParams();
  const cityName = params?.cityName as string;
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const {
    projects,
    progress,
    isLoading,
    error,
    setProjects,
    addProject,
    setProgress,
    setLoading,
    setError,
    reset
  } = useProjectStore();

  const startPolling = async () => {
    if (!cityName) return;

    setIsInitialLoading(true);
    setLoading(true);
    setError(null);
    reset();

    try {
      // Set initial progress
      setProgress({ status: 'scraping', total: 0, scraped: 0, geocoded: 0 });

      let currentOffset = 0;
      const limit = 3; // Load 3 projects at a time for real-time effect
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(`/api/scrape/${encodeURIComponent(cityName)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ offset: currentOffset, limit })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch projects');
        }

        // Add new projects to store
        data.projects.forEach((project: Project) => {
          addProject(project);
        });

        // Update progress
        setProgress({
          status: 'geocoding',
          total: data.total,
          scraped: currentOffset + data.projects.length,
          geocoded: currentOffset + data.projects.length
        });

        hasMore = data.hasMore;
        currentOffset += limit;

        // Add delay for real-time effect
        if (hasMore) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      setProgress({ status: 'completed' });

    } catch (error) {
      console.error('Polling error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      setProgress({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsInitialLoading(false);
      setLoading(false);
    }
  };

  const handleViewOnMap = (project: Project) => {
    // Scroll to map section
    const mapElement = document.getElementById('map-section');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRefresh = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
    startPolling();
  };

  useEffect(() => {
    if (cityName) {
      startPolling();
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [cityName]);

  if (!cityName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid City</h1>
          <p className="text-gray-600">Please provide a valid city name in the URL.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 capitalize">
                Real Estate Projects in {cityName}
              </h1>
              <p className="text-gray-600 mt-1">
                Discover new projects with real-time data from MagicBricks
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Loading...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        {(isLoading || progress.status !== 'idle') && (
          <ProgressBar progress={progress} />
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-medium">Error Loading Projects</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Projects List */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Projects ({projects.length})
              </h2>
            </div>

            {isInitialLoading && projects.length === 0 ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onViewOnMap={handleViewOnMap}
                  />
                ))}
              </div>
            ) : !isLoading && progress.status === 'completed' ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">
                  No projects found for {cityName}
                </div>
                <button
                  onClick={handleRefresh}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Try Again
                </button>
              </div>
            ) : null}
          </div>

          {/* Map */}
          <div className="lg:sticky lg:top-8">
            <div id="map-section" className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Project Locations</h2>
              <div className="h-96">
                <MapComponent projects={projects} city={cityName} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}