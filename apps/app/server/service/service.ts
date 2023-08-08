export interface Service<T> {
    getAll(): Promise<T[]>;
    getById(id: number): Promise<T | null>;
}
