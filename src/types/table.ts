/**
 * Table Related Types
 */

export type TableStatus = 'available' | 'occupied' | 'billing';

export type Table = {
  id: string;
  label: string;
  seats: number;
  status: TableStatus;
  guests?: number;
  elapsedMinutes?: number;
  currentOrderId?: string;
};

export type FloorSection = {
  id: string;
  name: string;
  tables: Table[];
};
