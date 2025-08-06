import { useSettings } from "../../../SettingsContext";
import { useEffect, useRef } from "react";
import { notificationManager } from "../../Notifications/NotificationManager";

const ImportButton: React.FC<{className?: string}> = ({className}) => {
    const { setQuestions } = useSettings()!;

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

    const handleImport = () => {
        let dropZoneElement = dropZone.current;
        if (!dropZoneElement) {
            return;
        }

        dropZoneElement.classList.remove("hidden");
        dropZoneElement.classList.add("flex");
        dropZoneElement.classList.add("z-10");

        const handleDrop = async (evt: DragEvent) => {
            evt.preventDefault();
            dropZoneElement.classList.add("hidden");
            dropZoneElement.classList.remove("flex", "z-10");

            dropZoneElement.removeEventListener('drop', handleDrop);
            
            if (evt.dataTransfer?.files) {
                const file = evt.dataTransfer.files[0];
                if (!file) {
                    // TODO: show error message
                    notificationManager.error("No file selected", "ERROR", 5000, () => {}, true);
                    return;
                }

                if (file.type !== "application/json") {
                    console.log(file.type)
                    // TODO: show error message
                    notificationManager.error("Wrong file type ! Select .json", "ERROR", 5000, () => {}, true);
                    return;
                }
                const text = await file.text();

                // TODO: validate

                setQuestions(JSON.parse(text));
                // TODO: show success message
                notificationManager.success(`Successfully imported file ${file.name}`, "Success", 5000, () => {}, true);
            }

        };

        dropZoneElement.addEventListener('drop', handleDrop, { once: true });
    };

    return (
        <>
            <button className={className || ""} onClick={handleImport}>Import</button>
            <div ref={dropZone} id="dropzone" className="hidden flex-col fixed top-0 left-0 w-screen h-screen items-center justify-center bg-white">
                <p className="blur-none">Drag JSON file with questions now</p>
            </div>
        </>
    );
};

export default ImportButton;