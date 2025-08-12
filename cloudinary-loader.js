/**
 * Custom Cloudinary loader for Next.js Image component
 * Provides proper image optimization and transformation
 */

export default function cloudinaryLoader({ src, width, quality = 75 }) {
  // If it's not a Cloudinary URL, return as is
  if (!src.includes('cloudinary.com')) {
    return src;
  }

  // Parse the Cloudinary URL
  const cloudinaryUrl = new URL(src);
  
  // Extract the path parts
  const pathParts = cloudinaryUrl.pathname.split('/');
  
  // Find the upload index
  const uploadIndex = pathParts.findIndex(part => part === 'upload');
  
  if (uploadIndex === -1) {
    return src; // Not a valid Cloudinary URL
  }

  // Extract the version and image path
  const version = pathParts[uploadIndex + 1];
  const imagePath = pathParts.slice(uploadIndex + 2).join('/');
  
  // Build optimized URL with transformations
  const transformations = [
    'f_auto', // Auto format (WebP, AVIF, etc.)
    'q_auto', // Auto quality
    `w_${width}`, // Width
    'c_scale', // Scale transformation
    'dpr_auto' // Auto device pixel ratio
  ].join(',');

  // Construct the optimized URL
  const optimizedUrl = `https://res.cloudinary.com/dy082ykuf/image/upload/${transformations}/${version}/${imagePath}`;
  
  return optimizedUrl;
}
