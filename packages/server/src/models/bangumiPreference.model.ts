import {
  BangumiPreference,
  VersionedBangumiPreference,
} from 'bangumi-list-v3-shared';
import db from '../db';

const DEFAULT_BANGUMI_PREFERENCE: BangumiPreference = {
  watching: [],
};

class BangumiPreferenceModel {
  private tableName = 'bangumiPreference';

  public async initDB() {
    await db.run(`
    CREATE TABLE IF NOT EXISTS ${this.tableName} (
      user_id TEXT NOT NULL,
      watching TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY (user_id)
    ) WITHOUT ROWID;`);
  }

  public async get(userID: string): Promise<VersionedBangumiPreference | null> {
    if (!userID) throw new Error('User ID missing');
    const row = await db.get(
      `
      SELECT *
      FROM ${this.tableName}
      WHERE
        user_id = $userID`,
      {
        $userID: userID,
      }
    );
    if (!row) return null;
    try {
      const watching = row.watching ? row.watching.split(',') : [];
      return { watching, version: row.updated_at || 0 };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async update(
    userID: string,
    updateData: Partial<BangumiPreference>
  ): Promise<VersionedBangumiPreference> {
    if (!userID) throw new Error('User ID missing');

    const previousData = await this.get(userID);
    const shouldCreateNew = previousData === null;
    const now = Date.now();

    if (shouldCreateNew) {
      const newData = generateUpdatedData(updateData);
      await db.run(
        `
        INSERT INTO ${this.tableName} (user_id, watching, created_at, updated_at)
        VALUES($userID, $watching, $createdAt, $updatedAt);
      `,
        {
          $userID: userID,
          $watching: newData.watching.join(','),
          $createdAt: now,
          $updatedAt: now,
        }
      );
      return { ...newData, version: now };
    } else {
      const newData = generateUpdatedData(updateData, previousData);
      await db.run(
        `
        UPDATE ${this.tableName}
        SET
          watching = $watching,
          updated_at = $updatedAt
        WHERE
          user_id = $userID
      `,
        {
          $watching: newData.watching.join(','),
          $updatedAt: now,
          $userID: userID,
        }
      );
      return { ...newData, version: now };
    }
  }

  public getDefaultPreference(): BangumiPreference {
    return { ...DEFAULT_BANGUMI_PREFERENCE };
  }
}

function generateUpdatedData(
  newData: Partial<BangumiPreference>,
  previousData?: BangumiPreference
): BangumiPreference {
  const updatedData = {
    ...(previousData || DEFAULT_BANGUMI_PREFERENCE),
    ...newData,
  };

  return updatedData;
}

export default new BangumiPreferenceModel();
