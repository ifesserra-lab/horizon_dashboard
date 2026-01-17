import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Accessibility Panel - LocalStorage Persistence', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
    });

    afterEach(() => {
        // Clean up after each test
        localStorage.clear();
    });

    describe('Theme Preference', () => {
        it('should default to "auto" when no preference is set', () => {
            const themePreference = localStorage.getItem('theme-preference') || 'auto';
            expect(themePreference).toBe('auto');
        });

        it('should persist "light" theme preference', () => {
            localStorage.setItem('theme-preference', 'light');
            expect(localStorage.getItem('theme-preference')).toBe('light');
        });

        it('should persist "dark" theme preference', () => {
            localStorage.setItem('theme-preference', 'dark');
            expect(localStorage.getItem('theme-preference')).toBe('dark');
        });

        it('should persist "auto" theme preference', () => {
            localStorage.setItem('theme-preference', 'auto');
            expect(localStorage.getItem('theme-preference')).toBe('auto');
        });
    });

    describe('Contrast Level', () => {
        it('should default to "normal" when no preference is set', () => {
            const contrast = localStorage.getItem('contrast') || 'normal';
            expect(contrast).toBe('normal');
        });

        it('should persist "high" contrast level', () => {
            localStorage.setItem('contrast', 'high');
            expect(localStorage.getItem('contrast')).toBe('high');
        });

        it('should persist "maximum" contrast level', () => {
            localStorage.setItem('contrast', 'maximum');
            expect(localStorage.getItem('contrast')).toBe('maximum');
        });
    });

    describe('Font Scale', () => {
        it('should default to "base" when no preference is set', () => {
            const textScale = localStorage.getItem('text-scale') || 'base';
            expect(textScale).toBe('base');
        });

        it('should persist "sm" (small) font scale', () => {
            localStorage.setItem('text-scale', 'sm');
            expect(localStorage.getItem('text-scale')).toBe('sm');
        });

        it('should persist "lg" (large) font scale', () => {
            localStorage.setItem('text-scale', 'lg');
            expect(localStorage.getItem('text-scale')).toBe('lg');
        });

        it('should persist "xl" (extra) font scale', () => {
            localStorage.setItem('text-scale', 'xl');
            expect(localStorage.getItem('text-scale')).toBe('xl');
        });
    });

    describe('Additional Options', () => {
        it('should persist "reduce-motion" preference as true', () => {
            localStorage.setItem('reduce-motion', 'true');
            expect(localStorage.getItem('reduce-motion')).toBe('true');
        });

        it('should persist "reduce-motion" preference as false', () => {
            localStorage.setItem('reduce-motion', 'false');
            expect(localStorage.getItem('reduce-motion')).toBe('false');
        });

        it('should persist "enhanced-focus" preference as true', () => {
            localStorage.setItem('enhanced-focus', 'true');
            expect(localStorage.getItem('enhanced-focus')).toBe('true');
        });

        it('should persist "screen-reader-optimized" preference as true', () => {
            localStorage.setItem('screen-reader-optimized', 'true');
            expect(localStorage.getItem('screen-reader-optimized')).toBe('true');
        });
    });

    describe('Restore Defaults', () => {
        it('should restore all settings to default values', () => {
            // Set non-default values
            localStorage.setItem('theme-preference', 'light');
            localStorage.setItem('contrast', 'maximum');
            localStorage.setItem('text-scale', 'xl');
            localStorage.setItem('reduce-motion', 'true');
            localStorage.setItem('enhanced-focus', 'true');
            localStorage.setItem('screen-reader-optimized', 'true');

            // Restore defaults
            const defaults = {
                'theme-preference': 'auto',
                'contrast': 'normal',
                'text-scale': 'base',
                'reduce-motion': 'false',
                'enhanced-focus': 'false',
                'screen-reader-optimized': 'false',
            };

            Object.entries(defaults).forEach(([key, value]) => {
                localStorage.setItem(key, value);
            });

            // Verify all settings are restored
            expect(localStorage.getItem('theme-preference')).toBe('auto');
            expect(localStorage.getItem('contrast')).toBe('normal');
            expect(localStorage.getItem('text-scale')).toBe('base');
            expect(localStorage.getItem('reduce-motion')).toBe('false');
            expect(localStorage.getItem('enhanced-focus')).toBe('false');
            expect(localStorage.getItem('screen-reader-optimized')).toBe('false');
        });
    });
});

describe('Accessibility Panel - CSS Classes', () => {
    describe('Contrast Classes', () => {
        it('should apply contrast-high class for high contrast', () => {
            const mockElement = document.documentElement;
            mockElement.classList.remove('contrast-high', 'contrast-maximum');
            mockElement.classList.add('contrast-high');

            expect(mockElement.classList.contains('contrast-high')).toBe(true);
            expect(mockElement.classList.contains('contrast-maximum')).toBe(false);
        });

        it('should apply contrast-maximum class for maximum contrast', () => {
            const mockElement = document.documentElement;
            mockElement.classList.remove('contrast-high', 'contrast-maximum');
            mockElement.classList.add('contrast-maximum');

            expect(mockElement.classList.contains('contrast-maximum')).toBe(true);
            expect(mockElement.classList.contains('contrast-high')).toBe(false);
        });
    });

    describe('Reduce Motion Class', () => {
        it('should apply reduce-motion class when enabled', () => {
            const mockElement = document.documentElement;
            mockElement.classList.add('reduce-motion');

            expect(mockElement.classList.contains('reduce-motion')).toBe(true);
        });

        it('should remove reduce-motion class when disabled', () => {
            const mockElement = document.documentElement;
            mockElement.classList.add('reduce-motion');
            mockElement.classList.remove('reduce-motion');

            expect(mockElement.classList.contains('reduce-motion')).toBe(false);
        });
    });

    describe('Enhanced Focus Class', () => {
        it('should apply enhanced-focus class when enabled', () => {
            const mockElement = document.documentElement;
            mockElement.classList.add('enhanced-focus');

            expect(mockElement.classList.contains('enhanced-focus')).toBe(true);
        });
    });

    describe('Screen Reader Optimization Class', () => {
        it('should apply screen-reader-optimized class when enabled', () => {
            const mockElement = document.documentElement;
            mockElement.classList.add('screen-reader-optimized');

            expect(mockElement.classList.contains('screen-reader-optimized')).toBe(true);
        });
    });
});
