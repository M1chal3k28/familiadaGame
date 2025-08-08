import { useEffect, useRef } from "react";
import { notificationManager } from "../../Notifications/NotificationManager";
import "ajv";

export enum FileType {
    JSON = "application/json",
    TXT = "text/plain",
}

export const FileTypeExtensions = {
    [FileType.JSON]: ".json",
    [FileType.TXT]: ".txt",
};

export type ImportButtonProps = {
    className?: string,
    callback?: (fileData: string) => Promise<boolean>,
    acceptedTypes?: FileType[],
};


/**
 * ImportButton component
 * 
 * This component provides a button that allows the user to import a file.
 * When clicked, it shows a div that allows the user to drag and drop a file.
 * When the file is dropped, it is read and passed as a string to the callback.
 * If the callback returns false, the component stops there.
 * If the callback returns true or does not return anything, the component shows a success notification.
 * 
 * The component also blocks the default drag and drop behavior of the browser.
 * 
 * @param {string} [className] - The className of the button.
 * @param {(fileData: string) => Promise<boolean>} [callback] - The callback when a file is dropped.
 * @param {FileType[]} [acceptedTypes] - The accepted types of files.
 * @returns {JSX.Element}
 */
export const ImportButton: React.FC<ImportButtonProps> = ({className, callback, acceptedTypes}) => {
    // Block drag and drop default behavior
    useEffect(() => {
        const preventDefaults = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
        };

        window.addEventListener("dragover", preventDefaults);
        window.addEventListener("drop", preventDefaults);

        return () => {
            window.removeEventListener("dragover", preventDefaults);
            window.removeEventListener("drop", preventDefaults);
        };
    }, []);

    const dropZone = useRef<HTMLDivElement>(null);

    const hideImportZone = () => {
        if (dropZone.current) {
            dropZone.current.classList.add("hidden");
            dropZone.current.classList.remove("flex", "z-10");
            dropZone.current.removeEventListener('drop', handleDrop);
        }
    };

    const handleDrop = async (evt: DragEvent) => {
        evt.preventDefault(); 
        hideImportZone();
        
        if (evt.dataTransfer?.files) {
            // Use DataTransferItemList interface to access the file(s)
            // Get only the first file
            const file = evt.dataTransfer.files[0];
            // Check if it is a file
            if (!file) {
                notificationManager.error("No file selected", "ERROR", 5000, () => {}, true);
                return;
            }
            // Check if it is a accepted type
            if (acceptedTypes && !acceptedTypes.includes(file.type as FileType)) {
                notificationManager.error(`Wrong file type ! Select ${acceptedTypes.map((t) => FileTypeExtensions[t]).join(", ")}`, "ERROR", 5000, () => {}, true);
                return;
            }

            // Read the file
            const fileData = await file.text();
            // Execute the callback
            if (callback)
                callback(fileData)
        }

    };
    const handleImport = () => {
        let dropZoneElement = dropZone.current;
        if (!dropZoneElement) {
            return;
        }

        dropZoneElement.classList.remove("hidden");
        dropZoneElement.classList.add("flex");
        dropZoneElement.classList.add("z-10");


        dropZoneElement.addEventListener('drop', handleDrop, { once: true });
    };

    // TODO: Add support for mobile devices
    return (
        <>
            <button className={className || ""} onClick={handleImport}>Import</button>
            <div ref={dropZone} id="dropzone" className="hidden flex-col fixed top-0 left-0 w-screen h-screen items-center justify-center bg-white">
                <p className="blur-none">Drag file to import now</p>
                <button className="menuButton text-black" onClick={hideImportZone}>Cancel</button>
            </div>
        </>
    );
};

export default ImportButton;