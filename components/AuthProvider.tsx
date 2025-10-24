import { useState, useEffect } from "react";
import AuthModal from "./AuthModal";

export default function AuthProvider() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    const handleOpenAuth = (event: CustomEvent) => {
      console.log('🔐 Auth modal requested:', event.detail);
      setModalMode(event.detail.mode || 'signin');
      setIsModalOpen(true);
    };

    // Listen for auth events
    window.addEventListener('openAuth', handleOpenAuth as EventListener);
    
    return () => {
      window.removeEventListener('openAuth', handleOpenAuth as EventListener);
    };
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <AuthModal 
      isOpen={isModalOpen}
      onClose={closeModal}
      mode={modalMode}
    />
  );
}