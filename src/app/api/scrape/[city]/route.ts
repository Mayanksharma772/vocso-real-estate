import { NextRequest, NextResponse } from 'next/server';
import { MagicBricksScraper } from '@/utils/scraper';
import GeocodingService from '@/utils/geocoding';
import { Project } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { city: string } }
) {
  const { city } = params;

  if (!city) {
    return NextResponse.json(
      { error: 'City parameter is required' },
      { status: 400 }
    );
  }

  let scraper: MagicBricksScraper | null = null;

  try {
    // Initialize scraper
    scraper = new MagicBricksScraper();
    await scraper.init();

    // Initialize geocoding service
    const geocodingService = new GeocodingService(
      process.env.POSITIONSTACK_API_KEY || ''
    );

    const scrapedProjects: Project[] = [];

    // Scrape projects
    const projects = await scraper.scrapeProjects(city, (project) => {
      scrapedProjects.push(project);
    });

    // Geocode locations for all projects
    const projectsWithCoordinates = await Promise.all(
      projects.map(async (project) => {
        const coordinates = await geocodingService.geocodeLocation(
          `${project.location}, ${city}, India`
        );

        return {
          ...project,
          coordinates
        };
      })
    );

    return NextResponse.json({
      success: true,
      city,
      count: projectsWithCoordinates.length,
      projects: projectsWithCoordinates
    });

  } catch (error) {
    console.error('Scraping API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to scrape projects',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    // Always close the browser
    if (scraper) {
      await scraper.close();
    }
  }
}

// For real-time updates via polling
export async function POST(
  request: NextRequest,
  { params }: { params: { city: string } }
) {
  const { city } = params;
  const { offset = 0, limit = 5 } = await request.json();

  let scraper: MagicBricksScraper | null = null;

  try {
    scraper = new MagicBricksScraper();
    await scraper.init();

    const geocodingService = new GeocodingService(
      process.env.POSITIONSTACK_API_KEY || ''
    );

    // Scrape all projects first
    const allProjects = await scraper.scrapeProjects(city);

    // Return paginated results for real-time effect
    const paginatedProjects = allProjects.slice(offset, offset + limit);

    // Geocode the paginated projects
    const projectsWithCoordinates = await Promise.all(
      paginatedProjects.map(async (project) => {
        const coordinates = await geocodingService.geocodeLocation(
          `${project.location}, ${city}, India`
        );

        return {
          ...project,
          coordinates
        };
      })
    );

    return NextResponse.json({
      success: true,
      projects: projectsWithCoordinates,
      hasMore: offset + limit < allProjects.length,
      total: allProjects.length
    });

  } catch (error) {
    console.error('Polling API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch projects',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    if (scraper) {
      await scraper.close();
    }
  }
}