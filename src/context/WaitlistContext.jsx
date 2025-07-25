import React, { createContext, useContext, useState } from 'react';

const WaitlistContext = createContext();

export const useWaitlist = () => {
  const context = useContext(WaitlistContext);
  if (!context) {
    throw new Error('useWaitlist must be used within a WaitlistProvider');
  }
  return context;
};

export const WaitlistProvider = ({ children }) => {
  const [showWaitlist, setShowWaitlist] = useState(false);

  const triggerWaitlist = () => {
    setShowWaitlist(true);
  };

  const hideWaitlist = () => {
    setShowWaitlist(false);
  };

  return (
    <WaitlistContext.Provider value={{ showWaitlist, triggerWaitlist, hideWaitlist }}>
      {children}
    </WaitlistContext.Provider>
  );
}; 