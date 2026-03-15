import { useRef, useState } from "react";
import { Box, Button, HStack, Icon, Spinner, Text, VStack } from "@chakra-ui/react";
import { FiUploadCloud, FiFile, FiX, FiCheckCircle } from "react-icons/fi";
import { toaster } from "./ui/toaster";

const API_BASE = "https://backend-images-upload-a3cze2dpf8endmg8.centralindia-01.azurewebsites.net/api/files";

export default function FileUpload({ onUploadSuccess }) {
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setProgress(0);

    // Animate fake progress for UX feel
    const interval = setInterval(() => {
      setProgress((p) => (p < 85 ? p + Math.random() * 12 : p));
    }, 200);

    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const res = await fetch(`${API_BASE}/upload`, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      clearInterval(interval);
      setProgress(100);
      toaster.create({
        title: "Upload complete! 🎉",
        description: `"${selectedFile.name}" is now stored in Azure.`,
        type: "success",
        duration: 4000,
        closable: true,
      });
      setTimeout(() => {
        setSelectedFile(null);
        setProgress(0);
        onUploadSuccess?.();
      }, 600);
    } catch (err) {
      clearInterval(interval);
      setProgress(0);
      toaster.create({
        title: "Upload failed",
        description: err.message,
        type: "error",
        duration: 5000,
        closable: true,
      });
    } finally {
      setUploading(false);
    }
  };

  const fileExt = selectedFile?.name.split(".").pop()?.toUpperCase() || "";

  return (
    <Box w="100%">
      {/* Drop zone */}
      <Box
        className={isDragging ? "drag-active" : ""}
        borderRadius="2xl"
        p={12}
        textAlign="center"
        cursor="pointer"
        position="relative"
        overflow="hidden"
        transition="all 0.25s"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          background: isDragging
            ? "linear-gradient(135deg, #ede9fe, #dbeafe)"
            : "linear-gradient(135deg, #f8faff, #f0f4ff)",
          border: isDragging
            ? "2px dashed #6366f1"
            : "2px dashed #c7d2fe",
          boxShadow: isDragging ? "0 0 0 4px rgba(99,102,241,0.12)" : "none",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          style={{ display: "none" }}
          onChange={(e) => setSelectedFile(e.target.files[0] || null)}
        />

        {/* Background decoration circles */}
        <Box
          position="absolute" top="-30px" right="-30px"
          w="120px" h="120px" borderRadius="full"
          style={{ background: "rgba(99,102,241,0.06)" }}
          pointerEvents="none"
        />
        <Box
          position="absolute" bottom="-20px" left="-20px"
          w="80px" h="80px" borderRadius="full"
          style={{ background: "rgba(59,130,246,0.06)" }}
          pointerEvents="none"
        />

        <VStack gap={3} position="relative">
          <Box
            p={4}
            borderRadius="2xl"
            style={{
              background: isDragging
                ? "linear-gradient(135deg, #6366f1, #3b82f6)"
                : "linear-gradient(135deg, #e0e7ff, #dbeafe)",
              transition: "all 0.25s",
            }}
          >
            <Icon
              as={FiUploadCloud}
              boxSize={8}
              style={{ color: isDragging ? "#ffffff" : "#6366f1" }}
            />
          </Box>
          <Box>
            <Text fontWeight="bold" fontSize="lg" color="gray.700">
              {isDragging ? "Release to drop!" : "Drop your file here"}
            </Text>
            <Text fontSize="sm" color="gray.400" mt={1}>
              or{" "}
              <Text as="span" style={{ color: "#6366f1" }} fontWeight="semibold">
                click to browse
              </Text>{" "}
              — any file type supported
            </Text>
          </Box>
        </VStack>
      </Box>

      {/* Selected file card */}
      {selectedFile && (
        <Box
          mt={4}
          p={4}
          borderRadius="xl"
          style={{
            background: "linear-gradient(135deg, #fafbff, #f0f4ff)",
            border: "1px solid #c7d2fe",
          }}
        >
          <HStack justify="space-between">
            <HStack gap={3} flex={1} minW={0}>
              <Box
                p={2.5}
                borderRadius="lg"
                flexShrink={0}
                style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
              >
                <Icon as={FiFile} color="white" boxSize={4} />
              </Box>
              <Box flex={1} minW={0}>
                <Text
                  fontWeight="semibold"
                  fontSize="sm"
                  color="gray.800"
                  style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  title={selectedFile.name}
                >
                  {selectedFile.name}
                </Text>
                <HStack gap={2} mt={0.5}>
                  <Text fontSize="xs" color="gray.400">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </Text>
                  {fileExt && (
                    <Box
                      px={1.5}
                      py={0.5}
                      borderRadius="sm"
                      style={{ background: "#e0e7ff" }}
                    >
                      <Text fontSize="10px" fontWeight="bold" style={{ color: "#6366f1" }}>
                        {fileExt}
                      </Text>
                    </Box>
                  )}
                </HStack>
              </Box>
            </HStack>
            <Button
              size="xs"
              variant="ghost"
              borderRadius="lg"
              _hover={{ bg: "red.50" }}
              onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setProgress(0); }}
            >
              <Icon as={FiX} color="gray.400" />
            </Button>
          </HStack>

          {/* Progress bar */}
          {uploading && (
            <Box mt={3} borderRadius="full" h="4px" bg="gray.100" overflow="hidden">
              <Box
                h="100%"
                borderRadius="full"
                transition="width 0.2s ease"
                style={{
                  width: `${progress}%`,
                  background: progress === 100
                    ? "linear-gradient(90deg, #22c55e, #16a34a)"
                    : "linear-gradient(90deg, #6366f1, #3b82f6)",
                }}
              />
            </Box>
          )}
        </Box>
      )}

      {/* Upload button */}
      <Button
        mt={4}
        w="100%"
        size="lg"
        borderRadius="xl"
        fontWeight="bold"
        disabled={!selectedFile || uploading}
        onClick={handleUpload}
        style={{
          background:
            !selectedFile || uploading
              ? undefined
              : "linear-gradient(135deg, #6366f1, #3b82f6)",
          color: !selectedFile || uploading ? undefined : "white",
          boxShadow:
            !selectedFile || uploading
              ? "none"
              : "0 4px 20px rgba(99,102,241,0.4)",
          transition: "all 0.2s",
        }}
        _hover={
          selectedFile && !uploading
            ? { transform: "translateY(-1px)", boxShadow: "0 6px 24px rgba(99,102,241,0.5)" }
            : {}
        }
      >
        {uploading ? (
          <HStack gap={2}>
            <Spinner size="sm" />
            <Text>Uploading… {Math.round(progress)}%</Text>
          </HStack>
        ) : (
          <HStack gap={2}>
            <Icon as={progress === 100 ? FiCheckCircle : FiUploadCloud} />
            <Text>Upload to Azure</Text>
          </HStack>
        )}
      </Button>
    </Box>
  );
}
