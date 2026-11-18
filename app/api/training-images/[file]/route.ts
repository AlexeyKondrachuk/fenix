import { serveLibraryImage } from "../../../../lib/image-library";
import { trainingDirectory } from "../../../../lib/training-storage";
import { trainingPhoto } from "../../../../lib/trainings-data";
export const runtime = "nodejs";
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  return serveLibraryImage(trainingDirectory, (await params).file, trainingPhoto);
}
