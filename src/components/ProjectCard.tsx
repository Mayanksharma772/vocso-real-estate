'use client';

import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  onViewOnMap?: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onViewOnMap }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
      {project.image && (
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}

      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>

        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <span className="font-medium text-gray-700 w-20">Location:</span>
            <span className="text-gray-600">{project.location}</span>
          </div>

          <div className="flex items-center">
            <span className="font-medium text-gray-700 w-20">Price:</span>
            <span className="text-green-600 font-semibold">{project.priceRange}</span>
          </div>

          <div className="flex items-center">
            <span className="font-medium text-gray-700 w-20">Builder:</span>
            <span className="text-gray-600">{project.builderName}</span>
          </div>

          {project.coordinates && (
            <div className="flex items-center">
              <span className="font-medium text-gray-700 w-20">Coords:</span>
              <span className="text-xs text-gray-500">
                {project.coordinates.latitude.toFixed(4)}, {project.coordinates.longitude.toFixed(4)}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4">
          {project.coordinates && onViewOnMap && (
            <button
              onClick={() => onViewOnMap(project)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
            >
              View on Map
            </button>
          )}

          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
            >
              View Details
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;