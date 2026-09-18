import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Check, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { processUploadedImage, ProcessImageOptions } from '../utils/imageUpload';

interface ImageUploadDropzoneProps {
  label: string;
  sublabel?: string;
  aspectType: 'avatar' | 'banner';
  processOptions?: ProcessImageOptions;
  onImageReady: (dataUrl: string) => void;
  currentPreviewUrl?: string;
}

export const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({
  label,
  sublabel = 'Arrastra y suelta tu archivo aquí o haz clic para explorar',
  aspectType,
  processOptions,
  onImageReady,
  currentPreviewUrl,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const options: ProcessImageOptions = {
        maxWidth: aspectType === 'avatar' ? 512 : 1600,
        maxHeight: aspectType === 'avatar' ? 512 : 800,
        quality: 0.88,
        ...processOptions,
      };

      const processedDataUrl = await processUploadedImage(file, options);
      setPreviewUrl(processedDataUrl);
      setFileName(file.name);
      onImageReady(processedDataUrl);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error al procesar la imagen seleccionada.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  return (
    <div className="w-full space-y-2">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-purple-400 bg-purple-500/15 shadow-lg shadow-purple-500/20 scale-[1.01]'
            : 'border-[#2d3858] hover:border-purple-400/60 bg-[#121626]/80 hover:bg-[#151a30]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
          onChange={onFileChange}
          className="hidden"
        />

        {isProcessing ? (
          <div className="py-4 flex flex-col items-center gap-2">
            <Loader2 className="w-7 h-7 text-purple-400 animate-spin" />
            <span className="text-xs font-semibold text-purple-200">Optimizando imagen...</span>
          </div>
        ) : previewUrl ? (
          <div className="w-full flex flex-col items-center gap-3">
            <div
              className={`overflow-hidden border-2 border-purple-500 shadow-xl ${
                aspectType === 'avatar'
                  ? 'w-20 h-20 sm:w-24 sm:h-24 rounded-full'
                  : 'w-full h-24 sm:h-28 rounded-xl'
              }`}
            >
              <img
                src={previewUrl}
                alt="Vista previa"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="truncate max-w-[200px] text-slate-200">{fileName || 'Imagen cargada'}</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-3 py-1 bg-[#1d243a] hover:bg-[#283252] text-purple-300 hover:text-white rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors border border-purple-500/30"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Elegir otra imagen</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-indigo-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-wide">{label}</p>
              <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs">{sublabel}</p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-semibold text-purple-300/80 bg-purple-900/30 px-2 py-0.5 rounded-md border border-purple-500/20">
                PNG, JPG, WEBP, GIF
              </span>
              <span className="text-[10px] text-slate-500">Hasta 15 MB</span>
            </div>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
