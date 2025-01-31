export const updateNavigationState = (step: string) => {
  localStorage.setItem('currentStep', step);
};

export const canAccess = (step: string): boolean => {
  const currentStep = localStorage.getItem('currentStep') || 'flights';
  const steps = ['flights', 'accommodations', 'activities', 'itinerary'];
  const currentIndex = steps.indexOf(currentStep);
  const targetIndex = steps.indexOf(step);
  
  // Always allow navigation to previous steps
  return targetIndex <= currentIndex;
};

// Add this new function
export const getLastCompletedStep = (): string => {
  return localStorage.getItem('currentStep') || 'flights';
}; 