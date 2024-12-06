import { config } from 'dotenv';
import { resolve } from 'path';
import type { CollectionSlug, PayloadRequest } from 'payload';
import { getPayload } from 'payload';

config({
  path: resolve(import.meta.dirname, './../../.env'),
});

const collections: CollectionSlug[] = ['docs-reorder-examples'];

const docsReorderSetupScript = async () => {
  const payload = await getPayload({
    config: importConfig('../../payload.config.ts'),
  });

  payload.logger.info('Starting...');

  const req = {} as PayloadRequest;

  const transactionId = await payload.db.beginTransaction?.();

  if (transactionId !== null) req.transactionID = transactionId;

  try {
    for (const slug of collections) {
      const { docs } = await payload.find({
        collection: slug,
        pagination: false,
        req,
        sort: '-createdAt',
      });

      const promises: Promise<unknown>[] = [];

      docs.forEach((doc, index) => {
        promises.push(
          payload.update({
            collection: slug,
            data: { docOrder: index + 1 } as any,
            id: doc.id,
            req,
          }),
        );
      });

      for (const promise of promises) {
        await promise;
      }
    }

    payload.logger.info('Success');
    if (req.transactionID) await payload.db.commitTransaction?.(req.transactionID);
  } catch (e) {
    if (e instanceof Error) payload.logger.error(e);
    payload.logger.error('Rollback script changes...');
    if (req.transactionID) await payload.db.rollbackTransaction?.(req.transactionID);
  }

  process.exit(0);
};

docsReorderSetupScript();
function importConfig(arg0: string): import("payload").SanitizedConfig | Promise<import("payload").SanitizedConfig> {
    throw new Error('Function not implemented.');
}

