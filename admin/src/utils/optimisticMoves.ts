import { reorderDocuments, type MoveDestination } from '../../../shared/ordering';
import type { GetPageEntriesResponse } from '../components/types';

export type OptimisticMove = MoveDestination & {
  id: number;
  rankField: string;
  optimisticData: GetPageEntriesResponse[];
};

// Keep successful moves as the baseline so a failed save does not undo newer user actions.
export class OptimisticMoves {
  private baseline: GetPageEntriesResponse[] = [];
  private pending: OptimisticMove[] = [];

  add(move: OptimisticMove, current: GetPageEntriesResponse[]) {
    if (!this.pending.length) this.baseline = current;
    this.pending.push(move);
    return this.project();
  }

  settle(move: OptimisticMove, succeeded: boolean) {
    if (!this.pending.includes(move)) return this.project();
    if (succeeded) {
      this.baseline = reorderDocuments(this.baseline, move.rankField, move.id, move);
    }
    this.pending = this.pending.filter((item) => item !== move);
    return this.project();
  }

  private project() {
    return this.pending.reduce((items, move) => {
      try {
        return reorderDocuments(items, move.rankField, move.id, move);
      } catch {
        // A failed earlier promotion may invalidate a later target. The server will reject it.
        return items;
      }
    }, this.baseline);
  }
}
