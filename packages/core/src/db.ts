import Dexie, { type EntityTable } from "dexie";
import type { Track, Loop, Transcript } from "./types";

export class EchoShadowDB extends Dexie {
  tracks!: EntityTable<Track, "id">;
  loops!: EntityTable<Loop, "id">;
  transcripts!: EntityTable<Transcript, "id">;

  constructor() {
    super("echoshadow");
    this.version(1).stores({
      tracks: "++id, source, createdAt",
      loops: "++id, trackId, createdAt",
      transcripts: "++id, trackId",
    });
    // v2: YouTube support was removed; tracks are local files only.
    this.version(2)
      .stores({
        tracks: "++id, createdAt",
      })
      .upgrade(async (tx) => {
        await tx
          .table("tracks")
          .filter((t) => t.source === "youtube" || !t.blob)
          .delete();
      });
  }
}

export const db = new EchoShadowDB();

export async function deleteTrack(trackId: number): Promise<void> {
  await db.transaction("rw", db.tracks, db.loops, db.transcripts, async () => {
    await db.loops.where("trackId").equals(trackId).delete();
    await db.transcripts.where("trackId").equals(trackId).delete();
    await db.tracks.delete(trackId);
  });
}
