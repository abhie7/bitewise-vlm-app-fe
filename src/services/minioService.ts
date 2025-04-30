import { toast } from 'sonner';

// Type definitions
interface MinioConfig {
  endpoint: string;
  bucket: string;
  accessKey: string;
  secretKey: string;
}

interface UploadResult {
  bucket: string;
  objectName: string;
  url: string;
  etag: string | null;
  filename?: string;
  fileSize?: number;
  contentType?: string;
}

class MinioService {
  private static instance: MinioService;
  private baseUrl: string;
  private config: MinioConfig;

  private constructor() {
    this.config = {
      endpoint: import.meta.env.VITE_MINIO_ENDPOINT || '',
      bucket: import.meta.env.VITE_MINIO_BUCKET_NAME || '',
      accessKey: import.meta.env.VITE_MINIO_ACCESS_KEY || '',
      secretKey: import.meta.env.VITE_MINIO_SECRET_KEY || '',
    };

    if (!this.config.endpoint || !this.config.bucket) {
      console.error('MinioService: Missing required configuration');
    }

    this.baseUrl = `${this.config.endpoint}/${this.config.bucket}`;
  }

  public static getInstance(): MinioService {
    if (!MinioService.instance) {
      MinioService.instance = new MinioService();
    }
    return MinioService.instance;
  }

  /**
   * Upload a single file to Minio
   * @param userId - User's UUID for organizing files
   * @param file - File to upload
   * @returns Promise with upload result
   */
  public async uploadSingleFile(userId, file: File): Promise<UploadResult> {
    try {
      const fileName = `${userId}/${Date.now()}_${file.name}`;
      const response = await fetch(`${this.baseUrl}/${fileName}`, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!response.ok) {
        throw new Error(`File upload failed with status: ${response.status}`);
      }

      return {
        bucket: this.config.bucket,
        objectName: fileName,
        url: response.url,
        etag: response.headers.get('ETag'),
        filename: file.name,
        fileSize: file.size,
        contentType: file.type,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
      toast.error(`Upload failed: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Upload multiple files to Minio with a group name
   * @param userId - User's UUID for organizing files
   * @param files - Array of files to upload
   * @param groupName - Group name for organizing files
   * @returns Promise with array of upload results
   */
  public async uploadMultipleFiles(userId: string, files: File[], groupName: string): Promise<UploadResult[]> {
    try {
      const uploadPromises = files.map(async (file) => {
        const fileName = `groupUploads/${userId}/${groupName}/${Date.now()}_${file.name}`;
        const response = await fetch(`${this.baseUrl}/${fileName}`, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name} with status: ${response.status}`);
        }

        return {
          bucket: this.config.bucket,
          objectName: fileName,
          url: response.url,
          etag: response.headers.get('ETag'),
          filename: file.name,
          fileSize: file.size,
          contentType: file.type,
        };
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
      toast.error(`Upload failed: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Download a file from Minio
   * @param objectName - Object name (path) in the bucket
   * @returns Promise with the file as a Blob
   */
  public async downloadFile(objectName: string): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/${objectName}`);

      if (!response.ok) {
        throw new Error(`Download failed with status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown download error';
      toast.error(`Download failed: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Get a direct URL to a file in Minio
   * @param objectName - Object name (path) in the bucket
   * @returns Direct URL to the file
   */
  public getFileUrl(objectName: string): string {
    return `${this.baseUrl}/${objectName}`;
  }
}

export default MinioService.getInstance();
