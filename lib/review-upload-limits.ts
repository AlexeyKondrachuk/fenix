const megabyte = 1024 * 1024;

export const reviewPhotoLimit = 2 * megabyte;
export const reviewVideoLimit = 50 * megabyte;
export const reviewBodyLimit = reviewPhotoLimit + reviewVideoLimit + megabyte;
