'use client';

import { useState, useEffect, useCallback } from 'react';

export interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    target: string; // CSS selector or element ID
    position: 'top' | 'bottom' | 'left' | 'right';
    action?: string; // Optional action hint
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        id: 'welcome',
        title: 'Welcome to FlowMind!',
        description: 'Create beautiful architecture diagrams for AI agents and systems. Let me show you around.',
        target: '[data-onboarding="sidebar"]',
        position: 'right',
    },
    {
        id: 'sidebar',
        title: 'Component Library',
        description: 'Drag components from here to the canvas. We have AI agents, architecture elements, and general-purpose nodes.',
        target: '[data-onboarding="sidebar"]',
        position: 'right',
        action: 'Try dragging a component!',
    },
    {
        id: 'search',
        title: 'Quick Search',
        description: 'Use the search bar to quickly find the component you need.',
        target: '[data-onboarding="search"]',
        position: 'bottom',
    },
    {
        id: 'canvas',
        title: 'Your Canvas',
        description: 'This is where your diagram comes to life. Drop components, connect them, and arrange your architecture.',
        target: '[data-onboarding="canvas"]',
        position: 'left',
    },
    {
        id: 'drawing',
        title: 'Drawing Mode',
        description: 'Press D or click the pencil icon to draw freehand annotations on your diagram.',
        target: '[data-onboarding="drawing-toggle"]',
        position: 'bottom',
    },
    {
        id: 'zoom',
        title: 'Zoom Controls',
        description: 'Use these buttons to zoom in/out or fit the entire diagram in view.',
        target: '[data-onboarding="zoom-controls"]',
        position: 'top',
    },
    {
        id: 'shortcuts',
        title: 'Keyboard Shortcuts',
        description: 'Work faster with shortcuts: Cmd+S (save), Cmd+D (duplicate), Cmd+C/V (copy/paste), and more!',
        target: '[data-onboarding="help"]',
        position: 'bottom',
        action: 'Click the ? icon for all shortcuts',
    },
    {
        id: 'complete',
        title: 'You\'re Ready!',
        description: 'Start creating your first diagram. Your work is auto-saved locally and synced to the cloud.',
        target: '[data-onboarding="canvas"]',
        position: 'left',
    },
];

const STORAGE_KEY = 'flowmind-onboarding-completed';

export function useOnboarding() {
    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [hasCompleted, setHasCompleted] = useState(true); // Default true to avoid flash

    // Check if onboarding was completed
    useEffect(() => {
        const completed = localStorage.getItem(STORAGE_KEY);
        if (!completed) {
            setHasCompleted(false);
            // Auto-start onboarding for new users after a short delay
            const timer = setTimeout(() => {
                setIsActive(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const startTour = useCallback(() => {
        setCurrentStep(0);
        setIsActive(true);
    }, []);

    const nextStep = useCallback(() => {
        if (currentStep < ONBOARDING_STEPS.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            completeTour();
        }
    }, [currentStep]);

    const prevStep = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    }, [currentStep]);

    const skipTour = useCallback(() => {
        completeTour();
    }, []);

    const completeTour = useCallback(() => {
        setIsActive(false);
        setHasCompleted(true);
        localStorage.setItem(STORAGE_KEY, 'true');
    }, []);

    const resetTour = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setHasCompleted(false);
        setCurrentStep(0);
    }, []);

    return {
        isActive,
        currentStep,
        totalSteps: ONBOARDING_STEPS.length,
        step: ONBOARDING_STEPS[currentStep],
        hasCompleted,
        startTour,
        nextStep,
        prevStep,
        skipTour,
        completeTour,
        resetTour,
    };
}
