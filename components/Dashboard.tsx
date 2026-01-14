import React, { useRef, useState } from 'react';
import { StudyFile, FileCategory } from '../types';
import { 
  FileText, 
  Upload, 
  Search, 
  File, 
  Download, 
  Trash2,
  Filter
} from 'lucide-react';

interface DashboardProps {
  files: StudyFile[];
  onUpload: (file: File) => void;
  onDelete: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ files, onUpload, onDelete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<FileCategory | 'All'>('All');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || file.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories: (FileCategory | 'All')[] = ['All', 'Assignment', 'Lecture Notes', 'Reference', 'Exam Paper'];

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="text-red-400" />;
    if (type.includes('word') || type.includes('doc')) return <FileText className="text-blue-400" />;
    if (type.includes('image')) return <FileText className="text-purple-400" />;
    return <File className="text-slate-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">My Files</h2>
          <p className="text-slate-400">Manage your university documents.</p>
        </div>
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-brand-600/20 active:transform active:scale-95"
        >
          <Upload size={18} />
          <span>Upload File</span>
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange}
        />
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none placeholder:text-slate-600"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterCategory === cat 
                  ? 'bg-brand-900/50 text-brand-300 border border-brand-800' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* File Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredFiles.length > 0 ? (
          filteredFiles.map(file => (
            <div key={file.id} className="group bg-slate-900 p-5 rounded-xl border border-slate-800 hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-900/10 transition-all duration-200 flex flex-col justify-between h-48 relative">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex space-x-1">
                   {/* In a real app, this would be a real download link */}
                   <a 
                    href={file.url} 
                    download={file.name}
                    className="p-2 text-slate-500 hover:text-brand-400 hover:bg-brand-900/30 rounded-full transition-colors"
                  >
                    <Download size={16} />
                  </a>
                  <button 
                    onClick={() => onDelete(file.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/30 rounded-full transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-200 truncate mb-1" title={file.name}>{file.name}</h3>
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <span className="bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">{file.category}</span>
                  <span>•</span>
                  <span>{file.size}</span>
                </div>
              </div>

              {/* Decorative gradient line at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-800">
              <Filter size={32} />
            </div>
            <p className="text-lg font-medium text-slate-400">No files found</p>
            <p className="text-sm">Try adjusting your filters or upload a new file.</p>
          </div>
        )}
      </div>
    </div>
  );
};