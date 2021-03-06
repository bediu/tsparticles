import type { ICoordinates } from "../../Interfaces/ICoordinates";
import { MoveDirection } from "../../Enums/MoveDirection";
import type { IOptions } from "../../Interfaces/Options/IOptions";
import type { ICharacterShape } from "../../Interfaces/Options/Particles/Shape/ICharacterShape";
import { IBounds } from "../../Interfaces/IBounds";
import { IDimension } from "../../Interfaces/IDimension";

type CSSOMString = string;
type FontFaceLoadStatus = 'unloaded' | 'loading' | 'loaded' | 'error';
type FontFaceSetStatus = 'loading' | 'loaded';

interface FontFace {
    family: CSSOMString;
    style: CSSOMString;
    weight: CSSOMString;
    stretch: CSSOMString;
    unicodeRange: CSSOMString;
    variant: CSSOMString;
    featureSettings: CSSOMString;
    variationSettings: CSSOMString;
    display: CSSOMString;
    readonly status: FontFaceLoadStatus;
    readonly loaded: Promise<FontFace>;

    load(): Promise<FontFace>;
}

interface FontFaceSet {
    readonly status: FontFaceSetStatus;
    readonly ready: Promise<FontFaceSet>;

    check(font: string, text?: string): Boolean;

    load(font: string, text?: string): Promise<FontFace[]>
}

declare global {
    interface Document {
        fonts: FontFaceSet
    }
}

/* ---------- global functions - vendors ------------ */
export class Utils {
    /**
     * Clamps a number between a minimum and maximum value
     * @param num the source number
     * @param min the minimum value
     * @param max the maximum value
     */
    public static clamp(num: number, min: number, max: number): number {
        return Math.min(Math.max(num, min), max);
    }

    /**
     * Check if a value is equal to the destination, if same type, or is in the provided array
     * @param value the value to check
     * @param array the data array or single value
     */
    public static isInArray<T>(value: T, array: T[] | T): boolean {
        return value === array || (array as T[]).indexOf(value) > -1;
    }

    /**
     *
     * @param comp1
     * @param comp2
     * @param weight1
     * @param weight2
     */
    public static mix(comp1: number, comp2: number, weight1: number, weight2: number): number {
        return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2);
    }

    /**
     * Get Particle base velocity
     * @param options the options to use for calculating the velocity
     */
    public static getParticleBaseVelocity(options: IOptions): ICoordinates {
        let velocityBase: ICoordinates;

        switch (options.particles.move.direction) {
            case MoveDirection.top:
                velocityBase = { x: 0, y: -1 };
                break;
            case MoveDirection.topRight:
                velocityBase = { x: 0.5, y: -0.5 };
                break;
            case MoveDirection.right:
                velocityBase = { x: 1, y: -0 };
                break;
            case MoveDirection.bottomRight:
                velocityBase = { x: 0.5, y: 0.5 };
                break;
            case MoveDirection.bottom:
                velocityBase = { x: 0, y: 1 };
                break;
            case MoveDirection.bottomLeft:
                velocityBase = { x: -0.5, y: 1 };
                break;
            case MoveDirection.left:
                velocityBase = { x: -1, y: 0 };
                break;
            case MoveDirection.topLeft:
                velocityBase = { x: -0.5, y: -0.5 };
                break;
            default:
                velocityBase = { x: 0, y: 0 };
                break;
        }

        return velocityBase;
    }

    /**
     * Gets the distance between two coordinates
     * @param pointA the first coordinate
     * @param pointB the second coordinate
     */
    public static getDistanceBetweenCoordinates(pointA: ICoordinates, pointB: ICoordinates): number {
        const dx = pointA.x - pointB.x;
        const dy = pointA.y - pointB.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    public static async loadFont(character: ICharacterShape): Promise<void> {
        try {
            await document.fonts.load(`${character.weight} 36px '${character.font}'`);
        } catch {
        }
    }

    public static arrayRandomIndex<T>(array: T[]): number {
        return Math.floor(Math.random() * array.length);
    }

    public static itemFromArray<T>(array: T[], index?: number): T {
        return array[index !== undefined ? index : this.arrayRandomIndex(array)];
    }

    public static randomInRange(min: number, max: number): number {
        return (Math.random() * (max - min)) + min;
    }

    public static isPointInside(point: ICoordinates, size: IDimension, radius?: number): boolean {
        return this.areBoundsInside(this.calculateBounds(point, radius ?? 0), size);
    }

    public static areBoundsInside(bounds: IBounds, size: IDimension): boolean {
        return bounds.left >= 0 && bounds.right <= size.width
            && bounds.top >= 0 && bounds.bottom <= size.height;
    }

    public static calculateBounds(point: ICoordinates, radius: number): IBounds {
        return {
            bottom: point.y + radius,
            left: point.x - radius,
            right: point.x + radius,
            top: point.y - radius,
        };
    }
}
