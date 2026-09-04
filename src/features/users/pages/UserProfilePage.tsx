import { useState } from 'react';
import { ProfileHeader } from '../components/ProfileHeader';
import { PersonalInfoForm } from '../components/PersonalInfoForm';
import { ProfilePhotoModal } from '../components/ProfilePhotoModal';
import { SaveSuccessModal } from '../components/SaveSuccessModal';
import { UserSidebar } from '../components/UserSidebar';
import { FlightHistoryCard } from '../components/FlightHistoryCard';

export const UserProfilePage = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-6">
      <div className="mx-auto flex max-w-5xl gap-5">
        <UserSidebar />

        <div className="min-w-0 flex-1">
          <ProfileHeader photo={photo} onEditPhoto={() => setPhotoModalOpen(true)} />

          <PersonalInfoForm onSave={() => setSuccessModalOpen(true)} />

          <FlightHistoryCard />
        </div>
      </div>

      <ProfilePhotoModal
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        photo={photo}
        onPhotoChange={setPhoto}
      />

      <SaveSuccessModal isOpen={successModalOpen} onClose={() => setSuccessModalOpen(false)} />
    </main>
  );
};
