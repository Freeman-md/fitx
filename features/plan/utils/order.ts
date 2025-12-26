export type OrderedItem = {
  order: number;
};

export const sortByOrder = <T extends OrderedItem>(items: T[]) => {
  return [...items].sort((a, b) => a.order - b.order);
};

export const normalizeOrder = <T extends OrderedItem>(items: T[]) => {
  return items.map((item, index) => ({ ...item, order: index + 1 }));
};

export const getNextOrder = (items: OrderedItem[]) => {
  return items.length > 0 ? items[items.length - 1].order + 1 : 1;
};
