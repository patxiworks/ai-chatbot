import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "../button";
import FileUploader from "../file-uploader";
import { Input } from "../input";
import UploadImagePreview from "../upload-image-preview";
import { ChatHandler } from "./chat.interface";

export default function ChatInput(
  props: Pick<
    ChatHandler,
    | "isLoading"
    | "input"
    | "onFileUpload"
    | "onFileError"
    | "handleSubmit"
    | "handleInputChange"
  > & {
    multiModal?: boolean;
  },
) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const searchParams = useSearchParams(); // Hook to access query parameters

  // Function to handle automatic submission
  useEffect(() => {
    // Get the query parameter (e.g., 'message' or any other you want)
    const autoMessage = searchParams.get('message');
    
    if (autoMessage && !autoSubmitted) {
      // Simulate input change
      const event = {
        target: {
          name: 'message',
          value: autoMessage,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      
      props.handleInputChange(event);
      
      // Submit the form after a small delay to ensure state is updated
      const timer = setTimeout(() => {
        const submitEvent = {
          preventDefault: () => {},
        } as React.FormEvent<HTMLFormElement>;
        
        if (imageUrl) {
          props.handleSubmit(submitEvent, {
            data: { imageUrl: imageUrl },
          });
          setImageUrl(null);
        } else {
          props.handleSubmit(submitEvent);
        }
        
        setAutoSubmitted(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams, autoSubmitted, props, imageUrl]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (imageUrl) {
      props.handleSubmit(e, {
        data: { imageUrl: imageUrl },
      });
      setImageUrl(null);
      return;
    }
    props.handleSubmit(e);
  };

  const onRemovePreviewImage = () => setImageUrl(null);

  const handleUploadImageFile = async (file: File) => {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
    setImageUrl(base64);
  };

  const handleUploadFile = async (file: File) => {
    try {
      if (props.multiModal && file.type.startsWith("image/")) {
        return await handleUploadImageFile(file);
      }
      props.onFileUpload?.(file);
    } catch (error: any) {
      props.onFileError?.(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-4 space-b-0 border-t border-neutral-200"
    >
      {imageUrl && (
        <UploadImagePreview url={imageUrl} onRemove={onRemovePreviewImage} />
      )}
      <div className="flex w-full items-start justify-between gap-4">
        <Input
          autoFocus
          name="message"
          placeholder="Type a message"
          className="flex-1"
          value={props.input}
          onChange={props.handleInputChange}
        />
        {/* <FileUploader
          onFileUpload={handleUploadFile}
          onFileError={props.onFileError}
        /> */}
        <Button type="button" disabled={props.isLoading}>
          Send message
        </Button>
      </div>
    </form>
  );
}
