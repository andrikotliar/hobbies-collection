import { getTypedEntries } from '@hobbies-collection/shared';
import { and, eq } from 'drizzle-orm';
import type { PgInsertValue, PgTableWithColumns, PgTransaction } from 'drizzle-orm/pg-core';

type AnyTable = {
  name: string;
  columns: { [key: string]: any };
  schema: undefined;
  dialect: 'pg';
};

type UpdateRelationsParams<T extends PgTableWithColumns<AnyTable>, V extends PgInsertValue<T>> = {
  where: Partial<Record<keyof T, number>>;
  transaction: PgTransaction<any, any, any>;
  table: T;
  values: V[];
};

export const updateTableRelations = async <
  T extends PgTableWithColumns<AnyTable>,
  V extends PgInsertValue<T>,
>({
  transaction,
  where,
  table,
  values,
}: UpdateRelationsParams<T, V>) => {
  const condition = getTypedEntries(where).map(([key, value]) => {
    return eq(table[key], value);
  });

  await transaction.delete(table).where(and(...condition));

  if (values.length) {
    await transaction.insert(table).values(values);
  }
};
