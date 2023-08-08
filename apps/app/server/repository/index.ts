import { InferModel, Table } from "drizzle-orm";

export interface Repository<
    T extends Table,
    InsertType = InferModel<T, "insert">,
    SelectType = InferModel<T>,
> {
    getAll(): Promise<SelectType[]>;
    getById(id: string | number): Promise<SelectType | null>;
    createOne(data: InsertType): Promise<SelectType | null>;
}
