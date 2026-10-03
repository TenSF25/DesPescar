import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ProfileAvatar } from './ProfileAvatar';

const TAMANO_MAX_PX = 256;
const TIPOS_VALIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const PESO_MAX_BYTES = 5 * 1024 * 1024;

/** Recorta al cuadrado y reduce la imagen para que entre cómoda en localStorage. */
const procesarImagen = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const lado = Math.min(img.width, img.height);
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = TAMANO_MAX_PX;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('canvas'));
        return;
      }
      ctx.drawImage(
        img,
        (img.width - lado) / 2,
        (img.height - lado) / 2,
        lado,
        lado,
        0,
        0,
        TAMANO_MAX_PX,
        TAMANO_MAX_PX,
      );
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('imagen'));
    };
    img.src = url;
  });

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  foto: string;
  iniciales: string;
  onPhotoChange: (foto: string) => void;
}

export const ProfilePhotoModal = ({ isOpen, ...props }: ProfilePhotoModalProps) =>
  isOpen ? <ModalContent {...props} /> : null;

/** Se monta al abrir el modal, así el preview y el error arrancan limpios cada vez. */
const ModalContent = ({
  onClose,
  foto,
  iniciales,
  onPhotoChange,
}: Omit<ProfilePhotoModalProps, 'isOpen'>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(foto);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [onClose]);

  const elegir = async (file: File | undefined) => {
    if (!file) return;
    if (!TIPOS_VALIDOS.includes(file.type)) {
      setError('Elegí una imagen JPG, PNG o WebP.');
      return;
    }
    if (file.size > PESO_MAX_BYTES) {
      setError('La imagen no puede pesar más de 5 MB.');
      return;
    }
    try {
      setPreview(await procesarImagen(file));
      setError(null);
    } catch {
      setError('No pudimos leer esa imagen. Probá con otra.');
    }
  };

  const aplicar = () => {
    onPhotoChange(preview);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="foto-modal-titulo"
        className="flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl bg-white p-6"
      >
        <h2 id="foto-modal-titulo" className="text-secondary text-lg font-extrabold">
          Foto de perfil
        </h2>

        <ProfileAvatar foto={preview} iniciales={iniciales} className="h-36 w-36 text-5xl" />

        <p className="text-neutral text-center text-sm">JPG, PNG o WebP. Máximo 5 MB.</p>
        {error && (
          <p role="alert" className="text-alert text-center text-sm">
            {error}
          </p>
        )}

        <div className="flex w-full flex-col gap-2">
          <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
            {preview ? 'Elegir otra imagen' : 'Elegir imagen'}
          </Button>
          {preview && (
            <Button
              type="button"
              variant="secondary"
              className="text-alert"
              onClick={() => setPreview('')}
            >
              Quitar foto
            </Button>
          )}
        </div>

        <div className="flex w-full gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            className="bg-primary text-white"
            onClick={aplicar}
          >
            Aplicar
          </Button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={TIPOS_VALIDOS.join(',')}
          className="hidden"
          onChange={(e) => {
            void elegir(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
};
