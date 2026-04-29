'use client';

interface SectionWrapperProps {
    isVisible: boolean;
    children: React.ReactNode;
}

const SectionWrapper = ({ isVisible, children }: SectionWrapperProps) => {
    if (!isVisible) return null;
    return <>{children}</>;
};

export default SectionWrapper;
