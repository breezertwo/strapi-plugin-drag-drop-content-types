export interface OrderedDocument {
  id: number;
  documentId: string;
  isPlaceholder?: boolean;
  [key: string]: unknown;
}

export interface MoveDestination {
  newIndex?: number;
  position?: 'top' | 'bottom';
  target?: { documentId: string; placement: 'before' | 'after' };
}

export class InvalidMoveError extends Error {}

// Resolve against the complete list, never against filtered row indexes.
export function reorderDocuments<T extends OrderedDocument>(
  items: T[],
  rankField: string,
  id: number,
  destination: MoveDestination
): T[] {
  const oldIndex = items.findIndex((item) => item.id === id);
  const moved = items[oldIndex];
  if (!moved || moved.isPlaceholder) {
    throw new InvalidMoveError('The moved entry is no longer available.');
  }

  const remaining = items.filter((_, index) => index !== oldIndex);
  const rankedCount = remaining.filter((item) => typeof item[rankField] === 'number').length;

  let index: number;
  if (destination.target) {
    const targetIndex = remaining.findIndex(
      (item) => item.documentId === destination.target!.documentId
    );

    if (targetIndex < 0 || typeof remaining[targetIndex][rankField] !== 'number') {
      throw new InvalidMoveError('The target entry is no longer ranked or available.');
    }

    index = targetIndex + (destination.target.placement === 'after' ? 1 : 0);
  } else {
    index =
      destination.position === 'top'
        ? 0
        : destination.position === 'bottom'
          ? rankedCount
          : (destination.newIndex ?? oldIndex);

    if (index > rankedCount && typeof moved[rankField] !== 'number') {
      throw new InvalidMoveError('Entries cannot be moved into the unranked tail.');
    }

    index = Math.min(Math.max(index, 0), rankedCount);
  }

  remaining.splice(index, 0, moved);

  // Only the explicitly moved document may be promoted from the unranked tail.
  return remaining.map((item, index) => ({
    ...item,
    [rankField]: item.id === id || typeof item[rankField] === 'number' ? index : null,
  }));
}
