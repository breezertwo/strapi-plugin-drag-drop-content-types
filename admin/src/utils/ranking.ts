import type { GetPageEntriesResponse } from '../components/types';

export const rankedBlockSize = (
  data: GetPageEntriesResponse[],
  rankField: string,
  movedIndex: number
) =>
  data.filter((item, index) => index !== movedIndex && typeof item[rankField] === 'number').length;

export const resolveDropIndex = (
  data: GetPageEntriesResponse[],
  rankField: string,
  oldIndex: number,
  newIndex: number
): number | null => {
  const blockSize = rankedBlockSize(data, rankField, oldIndex);
  const isRanked = typeof data[oldIndex]?.[rankField] === 'number';

  const dropIndex = newIndex <= blockSize ? newIndex : isRanked ? blockSize : null;

  return dropIndex === oldIndex ? null : dropIndex;
};
