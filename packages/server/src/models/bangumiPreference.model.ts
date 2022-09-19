import {
  BangumiPreference,
  VersionedBangumiPreference,
} from 'bangumi-list-v3-shared';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_BANGUMI_PREFERENCE: BangumiPreference = {
  watching: [],
};

class BangumiPreferenceModel {
  public async get(userID: string): Promise<VersionedBangumiPreference | null> {
    if (!userID) throw new Error('User ID missing');
    const row = await prisma.bangumiPreference.findUnique({
      where: {
        userID,
      },
    });
    if (!row) return null;
    try {
      const watching = row.watching ? row.watching.split(',') : [];
      return { watching, version: row.updatedAt.getTime() || 0 };
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
    const now = new Date();

    if (shouldCreateNew) {
      const newData = generateUpdatedData(updateData);
      await prisma.bangumiPreference.create({
        data: {
          userID,
          watching: newData.watching.join(','),
          createdAt: now,
          updatedAt: now,
        },
      });
      return { ...newData, version: now.getTime() };
    } else {
      const newData = generateUpdatedData(updateData, previousData);
      await prisma.bangumiPreference.update({
        where: {
          userID,
        },
        data: {
          watching: newData.watching.join(','),
          updatedAt: now,
        },
      });
      return { ...newData, version: now.getTime() };
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
