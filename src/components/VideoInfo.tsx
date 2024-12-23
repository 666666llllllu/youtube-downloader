'use client'

interface Format {
  formatId: string;
  quality: string;
  extension: string;
  filesize: number;
  downloadUrl: string;
}

interface VideoInfoProps {
  title: string;
  thumbnail: string;
  duration: string;
  author: string;
  formats: Format[];
  onDownload: (url: string) => void;
}

export default function VideoInfo({
  title,
  thumbnail,
  duration,
  author,
  formats,
  onDownload
}: VideoInfoProps) {
  return (
    <div className="mt-8 bg-white shadow rounded-lg p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full rounded-lg shadow-sm"
          />
        </div>
        <div className="w-full md:w-2/3">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-2">Author: {author}</p>
          <p className="text-gray-600">Duration: {duration}</p>
          
          <div className="mt-4">
            <h3 className="font-semibold text-gray-900">Available Formats</h3>
            <div className="mt-2 space-y-2">
              {formats.map((format) => (
                <div 
                  key={format.formatId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {format.quality} ({format.extension})
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {(format.filesize / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </div>
                  <button
                    onClick={() => onDownload(format.downloadUrl)}
                    className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 