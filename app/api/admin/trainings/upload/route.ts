import { uploadLibraryImage } from "../../../../../lib/image-library";
import { trainingDirectory } from "../../../../../lib/training-storage";
export const runtime = "nodejs";
export async function POST(request: Request) { return uploadLibraryImage(request, trainingDirectory); }
