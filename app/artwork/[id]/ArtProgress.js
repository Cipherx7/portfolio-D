'use client';
import { useState } from 'react';
import Image from 'next/image';
import styles from './ArtProgress.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ArtProgress({ artwork }) {
    const [currentStepIndex, setCurrentStepIndex] = useState(artwork.steps.length - 1);
    const steps = artwork.steps;
    const currentStep = steps[currentStepIndex];

    const handlePrev = () => {
        if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
    };

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) setCurrentStepIndex(currentStepIndex + 1);
    };

    return (
        <div className={styles.wrapper}>
            <div className={`glass-panel ${styles.viewer}`}>
                <div className={styles.imageContainer}>
                    <Image
                        src={currentStep.image}
                        alt={`${artwork.title} - ${currentStep.stage}`}
                        fill
                        className={styles.image}
                        style={{ objectFit: 'contain' }}
                    />
                </div>

                <div className={styles.controls}>
                    <button
                        className={styles.navBtn}
                        onClick={handlePrev}
                        disabled={currentStepIndex === 0}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div className={styles.meta}>
                        <span className={styles.stageName}>{currentStep.stage}</span>
                        <span className={styles.stageDate}>{new Date(currentStep.date).toLocaleDateString()}</span>
                    </div>

                    <button
                        className={styles.navBtn}
                        onClick={handleNext}
                        disabled={currentStepIndex === steps.length - 1}
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            <div className={styles.timeline}>
                {steps.map((step, index) => (
                    <button
                        key={index}
                        className={`${styles.dot} ${index === currentStepIndex ? styles.activeDot : ''}`}
                        onClick={() => setCurrentStepIndex(index)}
                        title={step.stage}
                    />
                ))}
            </div>
        </div>
    );
}
