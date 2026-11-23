import { FileText, Download, FileArchive, FileSpreadsheet } from 'lucide-react';
import { DocumentItem } from '@/types';
import { formatShortDate } from '@/lib/utils';

export default function DocumentCard({ document }: { document: DocumentItem }) {
  const getFileIcon = (url: string) => {
    if (url.endsWith('.pdf')) return <FileText className="w-8 h-8 text-red-500" />;
    if (url.endsWith('.zip') || url.endsWith('.rar')) return <FileArchive className="w-8 h-8 text-amber-500" />;
    if (url.endsWith('.xlsx') || url.endsWith('.xls')) return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
    return <FileText className="w-8 h-8 text-blue-500" />;
  };

  return (
    <div className="">
      <div className="w-14 h-14 rounded-xl bg-(--color-rw-primary-pale) flex items-center justify-center shrink-0 border border-(--color-rw-border)">
        {getFileIcon(document.fileUrl)}
      </div>
      
      <div className="grow min-w-0">
        <h3 className="text-base sm:text-lg font-bold text-(--color-rw-text) mb-1 truncate group-hover:text-(--color-rw-primary) transition-colors">
          {document.name}
        </h3>
        <p className="text-sm text-(--color-rw-text) line-clamp-2 mb-3">
          {document.description}
        </p>
        
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
          <span className="px-2.5 py-1 bg-(--color-rw-primary-pale) text-(--color-rw-text) rounded-md border border-(--color-rw-border)">
            {document.category}
          </span>
          <span className="text-(--color-rw-text)">
            {document.fileSize}
          </span>
          <span className="text-(--color-rw-text)">
            {formatShortDate(document.publishedAt)}
          </span>
        </div>
      </div>
      
      <a 
        href={document.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-(--color-rw-primary-pale) text-(--color-rw-text) hover:bg-(--color-rw-primary-pale) hover:text-white flex items-center justify-center shrink-0 transition-colors duration-200"
        aria-label={`Unduh ${document.name}`}
      >
        <Download className="w-4 h-4" />
      </a>
    </div>
  );
}
