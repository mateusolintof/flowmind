'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useOnboarding, OnboardingStep } from '@/hooks/useOnboarding';
import { cn } from '@/lib/utils';

interface TooltipPosition {
    top: number;
    left: number;
    arrowPosition: 'top' | 'bottom' | 'left' | 'right';
}

function calculatePosition(
    targetRect: DOMRect,
    tooltipWidth: number,
    tooltipHeight: number,
    position: OnboardingStep['position']
): TooltipPosition {
    const padding = 16;
    const arrowSize = 8;

    switch (position) {
        case 'right':
            return {
                top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
                left: targetRect.right + padding + arrowSize,
                arrowPosition: 'left',
            };
        case 'left':
            return {
                top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
                left: targetRect.left - tooltipWidth - padding - arrowSize,
                arrowPosition: 'right',
            };
        case 'bottom':
            return {
                top: targetRect.bottom + padding + arrowSize,
                left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
                arrowPosition: 'top',
            };
        case 'top':
            return {
                top: targetRect.top - tooltipHeight - padding - arrowSize,
                left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
                arrowPosition: 'bottom',
            };
        default:
            return { top: 100, left: 100, arrowPosition: 'top' };
    }
}

function Spotlight({ targetRect }: { targetRect: DOMRect | null }) {
    if (!targetRect) return null;

    const padding = 8;
    return (
        <div className="fixed inset-0 z-[9998] pointer-events-none">
            {/* Overlay with cutout */}
            <svg className="w-full h-full">
                <defs>
                    <mask id="spotlight-mask">
                        <rect width="100%" height="100%" fill="white" />
                        <rect
                            x={targetRect.left - padding}
                            y={targetRect.top - padding}
                            width={targetRect.width + padding * 2}
                            height={targetRect.height + padding * 2}
                            rx={8}
                            fill="black"
                        />
                    </mask>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill="rgba(0, 0, 0, 0.5)"
                    mask="url(#spotlight-mask)"
                />
            </svg>
            {/* Highlight border */}
            <div
                className="absolute border-2 border-primary rounded-lg ring-4 ring-primary/20 animate-pulse"
                style={{
                    top: targetRect.top - padding,
                    left: targetRect.left - padding,
                    width: targetRect.width + padding * 2,
                    height: targetRect.height + padding * 2,
                }}
            />
        </div>
    );
}

function TooltipArrow({ position }: { position: 'top' | 'bottom' | 'left' | 'right' }) {
    const baseClasses = "absolute w-0 h-0 border-solid";

    switch (position) {
        case 'left':
            return (
                <div
                    className={cn(baseClasses, "border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-card -left-2 top-1/2 -translate-y-1/2")}
                />
            );
        case 'right':
            return (
                <div
                    className={cn(baseClasses, "border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-card -right-2 top-1/2 -translate-y-1/2")}
                />
            );
        case 'top':
            return (
                <div
                    className={cn(baseClasses, "border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-card -top-2 left-1/2 -translate-x-1/2")}
                />
            );
        case 'bottom':
            return (
                <div
                    className={cn(baseClasses, "border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-card -bottom-2 left-1/2 -translate-x-1/2")}
                />
            );
    }
}

export default function OnboardingTour() {
    const {
        isActive,
        currentStep,
        totalSteps,
        step,
        nextStep,
        prevStep,
        skipTour,
    } = useOnboarding();

    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Find and track target element
    useEffect(() => {
        if (!isActive || !step) return;

        const findTarget = () => {
            const target = document.querySelector(step.target);
            if (target) {
                const rect = target.getBoundingClientRect();
                setTargetRect(rect);
            } else {
                // If target not found, center the tooltip
                setTargetRect(null);
            }
        };

        findTarget();

        // Recalculate on resize
        window.addEventListener('resize', findTarget);
        return () => window.removeEventListener('resize', findTarget);
    }, [isActive, step, currentStep]);

    // Calculate tooltip position
    useEffect(() => {
        if (!targetRect || !tooltipRef.current || !step) return;

        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const position = calculatePosition(
            targetRect,
            tooltipRect.width,
            tooltipRect.height,
            step.position
        );

        // Clamp to viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        position.left = Math.max(16, Math.min(position.left, viewportWidth - tooltipRect.width - 16));
        position.top = Math.max(16, Math.min(position.top, viewportHeight - tooltipRect.height - 16));

        setTooltipPosition(position);
    }, [targetRect, step]);

    if (!mounted || !isActive || !step) return null;

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === totalSteps - 1;

    return createPortal(
        <>
            <Spotlight targetRect={targetRect} />

            {/* Tooltip */}
            <Card
                ref={tooltipRef}
                className="fixed z-[9999] w-80 p-4 shadow-2xl border-2"
                style={{
                    top: tooltipPosition?.top ?? '50%',
                    left: tooltipPosition?.left ?? '50%',
                    transform: tooltipPosition ? 'none' : 'translate(-50%, -50%)',
                }}
            >
                {tooltipPosition && <TooltipArrow position={tooltipPosition.arrowPosition} />}

                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-base">{step.title}</h3>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 -mr-2 -mt-1"
                        onClick={skipTour}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Content */}
                <p className="text-sm text-muted-foreground mb-2">
                    {step.description}
                </p>

                {step.action && (
                    <p className="text-xs text-primary font-medium mb-3">
                        💡 {step.action}
                    </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                        {currentStep + 1} of {totalSteps}
                    </span>
                    <div className="flex gap-2">
                        {!isFirstStep && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={prevStep}
                                className="h-8"
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back
                            </Button>
                        )}
                        <Button
                            size="sm"
                            onClick={nextStep}
                            className="h-8"
                        >
                            {isLastStep ? (
                                'Get Started'
                            ) : (
                                <>
                                    Next
                                    <ArrowRight className="h-4 w-4 ml-1" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </Card>
        </>,
        document.body
    );
}
