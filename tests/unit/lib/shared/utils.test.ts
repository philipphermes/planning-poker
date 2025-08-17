import {describe, it, expect} from 'vitest'
import {cn} from '../../../../src/lib/shared/utils'

describe('Utils', () => {
    describe('cn (className utility)', () => {
        it('should merge class names correctly', () => {
            const result = cn('class1', 'class2')

            expect(result).toBe('class1 class2')
        })

        it('should handle conditional classes', () => {
            const result = cn('base', true && 'conditional', false && 'hidden')

            expect(result).toBe('base conditional')
        })

        it('should handle undefined and null values', () => {
            const result = cn('base', undefined, null, 'valid')

            expect(result).toBe('base valid')
        })

        it('should handle empty strings', () => {
            const result = cn('base', '', 'valid')

            expect(result).toBe('base valid')
        })

        it('should handle array of classes', () => {
            const result = cn(['class1', 'class2'], 'class3')

            expect(result).toBe('class1 class2 class3')
        })

        it('should handle object notation', () => {
            const result = cn({
                'active': true,
                'hidden': false,
                'base': true
            })

            expect(result).toBe('active base')
        })

        it('should handle mixed inputs', () => {
            const result = cn(
                'base',
                ['array1', 'array2'],
                {
                    'conditional': true,
                    'hidden': false
                },
                undefined,
                'final'
            )

            expect(result).toBe('base array1 array2 conditional final')
        })

        it('should handle Tailwind class conflicts', () => {
            const result = cn('p-4', 'p-6') // Later class should win

            expect(result).toBe('p-6')
        })

        it('should handle complex Tailwind utilities', () => {
            const result = cn(
                'bg-red-500',
                'hover:bg-blue-500',
                'md:bg-green-500',
                'dark:bg-gray-500'
            )

            expect(result).toContain('bg-red-500')
            expect(result).toContain('hover:bg-blue-500')
            expect(result).toContain('md:bg-green-500')
            expect(result).toContain('dark:bg-gray-500')
        })

        it('should return empty string for no inputs', () => {
            const result = cn()

            expect(result).toBe('')
        })
    })
})