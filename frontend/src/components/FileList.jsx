import { useCallback, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Grid,
  HStack,
  Heading,
  Icon,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FiDownload,
  FiRefreshCw,
  FiTrash2,
  FiFile,
  FiImage,
  FiFileText,
  FiMusic,
  FiVideo,
  FiCode,
  FiArchive,
  FiInbox,
  FiLink,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import { toaster } from "./ui/toaster";

const API_BASE = "https://backend-images-upload-a3cze2dpf8endmg8.centralindia-01.azurewebsites.net/api/files";

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

// File type meta: [icon, gradient, light bg, text color, label]
const getFileMeta = (mimeType = "") => {
  if (mimeType.startsWith("image/"))
    return { icon: FiImage, grad: "linear-gradient(135deg,#10b981,#059669)", bg: "#d1fae5", color: "#065f46", label: "Image" };
  if (mimeType === "application/pdf")
    return { icon: FiFileText, grad: "linear-gradient(135deg,#ef4444,#dc2626)", bg: "#fee2e2", color: "#991b1b", label: "PDF" };
  if (mimeType.startsWith("video/"))
    return { icon: FiVideo, grad: "linear-gradient(135deg,#8b5cf6,#7c3aed)", bg: "#ede9fe", color: "#5b21b6", label: "Video" };
  if (mimeType.startsWith("audio/"))
    return { icon: FiMusic, grad: "linear-gradient(135deg,#f59e0b,#d97706)", bg: "#fef3c7", color: "#92400e", label: "Audio" };
  if (mimeType.includes("zip") || mimeType.includes("tar") || mimeType.includes("rar") || mimeType.includes("7z"))
    return { icon: FiArchive, grad: "linear-gradient(135deg,#f97316,#ea580c)", bg: "#ffedd5", color: "#9a3412", label: "Archive" };
  if (mimeType.includes("javascript") || mimeType.includes("json") || mimeType.includes("html") || mimeType.includes("css") || mimeType.includes("xml"))
    return { icon: FiCode, grad: "linear-gradient(135deg,#06b6d4,#0891b2)", bg: "#cffafe", color: "#155e75", label: "Code" };
  if (mimeType.includes("text/"))
    return { icon: FiFileText, grad: "linear-gradient(135deg,#64748b,#475569)", bg: "#f1f5f9", color: "#334155", label: "Text" };
  return { icon: FiFile, grad: "linear-gradient(135deg,#6366f1,#3b82f6)", bg: "#e0e7ff", color: "#3730a3", label: "File" };
};

function FileCard({ file, onDownload, onDelete, downloadingId, deletingId, sasUrl }) {
  const meta = getFileMeta(file.mimeType);
  const isDownloading = downloadingId === file._id;
  const isDeleting = deletingId === file._id;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sasUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Box
      className="file-card"
      borderRadius="2xl"
      overflow="hidden"
      style={{
        background: "#ffffff",
        border: "1px solid #e0e7ff",
        boxShadow: "0 2px 12px rgba(99,102,241,0.08)",
      }}
    >
      {/* Top accent bar */}
      <Box h="3px" style={{ background: meta.grad }} />

      <Box p={5}>
        {/* Icon + badge row */}
        <HStack justify="space-between" mb={4}>
          <Box
            p={3}
            borderRadius="xl"
            style={{ background: meta.grad }}
          >
            <Icon as={meta.icon} color="white" boxSize={5} />
          </Box>
          <Box
            px={2.5}
            py={1}
            borderRadius="full"
            style={{ background: meta.bg }}
          >
            <Text fontSize="xs" fontWeight="bold" style={{ color: meta.color }}>
              {meta.label}
            </Text>
          </Box>
        </HStack>

        {/* File name */}
        <Text
          fontWeight="bold"
          fontSize="sm"
          color="gray.800"
          mb={1}
          style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          title={file.fileName}
        >
          {file.fileName}
        </Text>

        {/* Meta info */}
        <VStack align="start" gap={0.5} mb={5}>
          <Text fontSize="xs" color="gray.400">
            📦 {formatSize(file.size)}
          </Text>
          <Text fontSize="xs" color="gray.400">
            🕒 {formatDate(file.uploadedAt || file.createdAt)}
          </Text>
        </VStack>

        {/* Action buttons */}
        <VStack gap={2}>
          <Button
            w="100%"
            size="sm"
            borderRadius="xl"
            fontWeight="semibold"
            disabled={isDownloading}
            onClick={() => onDownload(file)}
            style={{
              background: isDownloading ? undefined : meta.grad,
              color: isDownloading ? undefined : "white",
              boxShadow: isDownloading ? "none" : "0 2px 10px rgba(99,102,241,0.3)",
              transition: "all 0.2s",
            }}
          >
            {isDownloading ? <Spinner size="xs" /> : <Icon as={FiDownload} />}
            {isDownloading ? "Generating link…" : "Download"}
          </Button>
          <Button
            w="100%"
            size="sm"
            variant="outline"
            borderRadius="xl"
            fontWeight="semibold"
            colorPalette="red"
            disabled={isDeleting}
            onClick={() => onDelete(file)}
            style={{ transition: "all 0.2s" }}
          >
            {isDeleting ? <Spinner size="xs" /> : <Icon as={FiTrash2} />}
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </VStack>

        {/* SAS Link display */}
        {sasUrl && (
          <Box
            mt={4}
            p={3}
            borderRadius="xl"
            style={{
              background: "linear-gradient(135deg, #f0f4ff, #faf5ff)",
              border: "1px solid #c7d2fe",
            }}
          >
            <HStack mb={1.5} gap={1.5}>
              <Icon as={FiLink} boxSize={3} style={{ color: "#6366f1" }} />
              <Text fontSize="10px" fontWeight="bold" style={{ color: "#6366f1" }} letterSpacing="wide">
                SAS LINK · EXPIRES IN 10 MIN
              </Text>
            </HStack>
            <HStack gap={2}>
              <Box
                flex={1}
                px={2.5}
                py={1.5}
                borderRadius="lg"
                style={{
                  background: "white",
                  border: "1px solid #e0e7ff",
                  overflow: "hidden",
                }}
              >
                <Text
                  fontSize="10px"
                  style={{
                    color: "#4338ca",
                    fontFamily: "monospace",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={sasUrl}
                >
                  {sasUrl}
                </Text>
              </Box>
              <Button
                size="xs"
                borderRadius="lg"
                flexShrink={0}
                onClick={handleCopy}
                style={{
                  background: copied
                    ? "linear-gradient(135deg,#22c55e,#16a34a)"
                    : "linear-gradient(135deg,#6366f1,#3b82f6)",
                  color: "white",
                  transition: "all 0.2s",
                  minW: "32px",
                }}
              >
                <Icon as={copied ? FiCheck : FiCopy} boxSize={3} />
              </Button>
            </HStack>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default function FileList({ refresh }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [sasLinks, setSasLinks] = useState({});

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      if (res.status === 404) { setFiles([]); return; }
      if (!res.ok) throw new Error("Failed to fetch files");
      setFiles(await res.json());
    } catch (err) {
      toaster.create({ title: "Error fetching files", description: err.message, type: "error", duration: 4000, closable: true });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFiles(); }, [fetchFiles, refresh]);

  const handleDownload = async (file) => {
    setDownloadingId(file._id);
    try {
      const res = await fetch(`${API_BASE}/download/${file._id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate link");
      // Store SAS URL for display in the card
      setSasLinks((prev) => ({ ...prev, [file._id]: data.downloadUrl }));
      const a = document.createElement("a");
      a.href = data.downloadUrl;
      a.download = file.fileName;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toaster.create({ title: "Download started 🚀", description: `SAS link valid for 10 minutes.`, type: "success", duration: 4000, closable: true });
    } catch (err) {
      toaster.create({ title: "Download failed", description: err.message, type: "error", duration: 5000, closable: true });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (file) => {
    setDeletingId(file._id);
    try {
      const res = await fetch(`${API_BASE}/${file._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setFiles((prev) => prev.filter((f) => f._id !== file._id));
      setSasLinks((prev) => { const n = { ...prev }; delete n[file._id]; return n; });
      toaster.create({ title: "File deleted", description: `"${file.fileName}" removed.`, type: "success", duration: 3000, closable: true });
    } catch (err) {
      toaster.create({ title: "Delete failed", description: err.message, type: "error", duration: 5000, closable: true });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box w="100%">
      {/* Section header */}
      <HStack justify="space-between" mb={6}>
        <Box>
          <HStack gap={3} mb={1}>
            <Box
              p={2}
              borderRadius="lg"
              style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
            >
              <Icon as={FiInbox} color="white" boxSize={4} />
            </Box>
            <Heading size="md" color="gray.800">Your Files</Heading>
            {files.length > 0 && (
              <Box
                px={2.5}
                py={0.5}
                borderRadius="full"
                style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
              >
                <Text fontSize="xs" fontWeight="bold" color="white">
                  {files.length}
                </Text>
              </Box>
            )}
          </HStack>
          <Text fontSize="sm" color="gray.400">
            All files stored in Azure Blob Storage
          </Text>
        </Box>
        <Button
          size="sm"
          variant="outline"
          borderRadius="xl"
          onClick={fetchFiles}
          disabled={loading}
          style={{ borderColor: "#c7d2fe", color: "#6366f1" }}
          _hover={{ bg: "#f0f4ff" }}
        >
          <Icon as={FiRefreshCw} />
          Refresh
        </Button>
      </HStack>

      {/* States */}
      {loading ? (
        <Box textAlign="center" py={16}>
          <VStack gap={3}>
            <Spinner size="xl" style={{ color: "#6366f1" }} />
            <Text color="gray.400" fontSize="sm">Loading your files…</Text>
          </VStack>
        </Box>
      ) : files.length === 0 ? (
        <Box
          textAlign="center"
          py={16}
          borderRadius="2xl"
          style={{
            background: "linear-gradient(135deg, #f8faff, #f0f4ff)",
            border: "2px dashed #c7d2fe",
          }}
        >
          <VStack gap={3}>
            <Box
              p={5}
              borderRadius="2xl"
              style={{ background: "linear-gradient(135deg, #e0e7ff, #dbeafe)" }}
            >
              <Icon as={FiInbox} boxSize={8} style={{ color: "#6366f1" }} />
            </Box>
            <Text fontWeight="bold" color="gray.600" fontSize="lg">No files yet</Text>
            <Text color="gray.400" fontSize="sm">Upload your first file to see it here</Text>
          </VStack>
        </Box>
      ) : (
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
            xl: "repeat(4, 1fr)",
          }}
          gap={4}
        >
          {files.map((file) => (
            <FileCard
              key={file._id}
              file={file}
              onDownload={handleDownload}
              onDelete={handleDelete}
              downloadingId={downloadingId}
              deletingId={deletingId}
              sasUrl={sasLinks[file._id] || null}
            />
          ))}
        </Grid>
      )}
    </Box>
  );
}

