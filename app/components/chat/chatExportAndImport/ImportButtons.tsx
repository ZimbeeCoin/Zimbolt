// app/components/chat/chatExportAndImport/ImportButtons.tsx

import React from 'react';
import type { Message } from 'ai';
import { toast } from 'react-toastify';
import { ImportFolderButton } from '~/components/chat/ImportFolderButton';
import withErrorBoundary from '~/components/ui/withErrorBoundary'; // Import the HOC

// Step 2: Define the original component separately
const ImportButtonsComponent = (
  importChat: ((description: string, messages: Message[]) => Promise<void>) | undefined,
) => {
  return (
    <div className="flex flex-col items-center justify-center w-auto">
      <input
        type="file"
        id="chat-import"
        className="hidden"
        accept=".json"
        onChange={async (e) => {
          const file = e.target.files?.[0];

          if (file && importChat) {
            try {
              const reader = new FileReader();

              reader.onload = async (e) => {
                try {
                  const content = e.target?.result as string;
                  const data = JSON.parse(content);

                  if (!Array.isArray(data.messages)) {
                    toast.error('Invalid chat file format');
                  }

                  await importChat(data.description, data.messages);
                  toast.success('Chat imported successfully');
                } catch (error: unknown) {
                  if (error instanceof Error) {
                    toast.error('Failed to parse chat file: ' + error.message);
                  } else {
                    toast.error('Failed to parse chat file');
                  }
                }
              };
              reader.onerror = () => toast.error('Failed to read chat file');
              reader.readAsText(file);
            } catch (error) {
              toast.error(error instanceof Error ? error.message : 'Failed to import chat');
            }
            e.target.value = ''; // Reset file input
          } else {
            toast.error('Something went wrong');
          }
        }}
      />
      <div className="flex flex-col items-center gap-4 max-w-2xl text-center">
        <div className="flex gap-2">
          <button
            onClick={() => {
              const input = document.getElementById('chat-import');
              input?.click();
            }}
            className="px-4 py-2 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-prompt-background text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-3 transition-all flex items-center gap-2"
          >
            <div className="i-ph:upload-simple" />
            Import Chat
          </button>
          <ImportFolderButton
            importChat={importChat}
            className="px-4 py-2 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-prompt-background text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-3 transition-all flex items-center gap-2"
          />
        </div>
      </div>
    </div>
  );
};

// Step 3: Create a fallback UI specific to this component
const importButtonsFallback = (
  <div className="error-fallback p-4 bg-red-100 text-red-700 rounded">
    <p>Import functionality is currently unavailable.</p>
  </div>
);

// Step 4: Define an error handler (optional)
const handleImportButtonsError = (error: Error, errorInfo: React.ErrorInfo) => {
  console.error('Error in ImportButtons:', error, errorInfo);
  // Optionally, report to an external service like Sentry
  // Sentry.captureException(error, { extra: errorInfo });
};

// Step 5: Wrap the component with the HOC
const ImportButtons = withErrorBoundary(ImportButtonsComponent, {
  fallback: importButtonsFallback,
  onError: handleImportButtonsError,
});

// Step 6: Export the wrapped component
export default ImportButtons;
