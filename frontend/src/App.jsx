import { useState } from "react";
import { Box, Flex, HStack, Heading, Icon, Text, VStack } from "@chakra-ui/react";
import { FiCloud } from "react-icons/fi";
import FileUpload from "./components/FileUpload";
import FileList from "./components/FileList";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Box
      minH="100vh"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 70%, #1e40af 100%)",
      }}
    >
      {/* Navbar */}
      <Box
        px={8}
        py={4}
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <HStack maxW="1100px" mx="auto" justify="space-between">
          <HStack gap={5}>
            <Box
              p={2}
              borderRadius="lg"
              style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
            >
              <Icon as={FiCloud} color="white" boxSize={5} />
            </Box>
            <Text fontWeight="bold" fontSize="lg" color="white" letterSpacing="tight">
              AzureVault
            </Text>
          </HStack>
          <HStack gap={2}>
            <Box
              px={3}
              py={1}
              borderRadius="full"
              style={{ background: "rgba(99,102,241,0.25)", border: "1px solid rgba(99,102,241,0.5)" }}
            >
              <Text fontSize="xs" color="indigo.200" style={{ color: "#a5b4fc" }}>
                ● Live
              </Text>
            </Box>
          </HStack>
        </HStack>
      </Box>

      {/* Hero */}
      <Box textAlign="center" pt={14} pb={10} px={4}>
        <Box
          display="inline-block"
          px={4}
          py={1.5}
          borderRadius="full"
          mb={5}
          style={{
            background: "rgba(99,102,241,0.2)",
            border: "1px solid rgba(99,102,241,0.4)",
          }}
        >
              <Text fontSize="sm" style={{ color: "#c7d2fe" }} fontWeight="medium">
                Secure File Storage on Azure
          </Text>
        </Box>
        <Heading
          fontSize={{ base: "3xl", md: "5xl" }}
          fontWeight="extrabold"
          letterSpacing='wide'
          style={{
            background: "linear-gradient(135deg, #ffffff 30%, #a5b4fc 70%, #60a5fa 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
          mb={2}
        >
          Secure Cloud File Storage
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} style={{ color: "#94a3b8" }} maxW="520px" mx="auto">
          Upload any file to Azure and share it instantly with expiring SAS tokens — no public exposure.
        </Text>
      </Box>

      {/* Stat bar */}
      <Flex justify="center" gap={6} px={4} pb={10} flexWrap="wrap">
        {[
          { label: "End-to-End Encrypted", icon: "🔐" },
          { label: "SAS Tokens (10 min expiry)", icon: "⏱️" },
          { label: "Unlimited File Types", icon: "📁" },
        ].map((item) => (
          <HStack
            key={item.label}
            px={5}
            py={3}
            borderRadius="xl"
            gap={2}
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Text fontSize="sm">{item.icon}</Text>
            <Text fontSize="sm" fontWeight="medium" style={{ color: "#e2e8f0" }}>
              {item.label}
            </Text>
          </HStack>
        ))}
      </Flex>

      {/* Content */}
      <Box maxW="1100px" mx="auto" px={4} pb={16}>
        <VStack gap={8} align="stretch">
          {/* Upload card */}
          <Box
            borderRadius="2xl"
            p={8}
            style={{
              background: "rgba(255,255,255,0.97)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <HStack mb={6} gap={3}>
              <Box
                p={2}
                borderRadius="lg"
                style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
              >
                <Icon as={FiCloud} color="white" boxSize={4} />
              </Box>
              <Box>
                <Heading size="md" color="gray.800">Upload a File</Heading>
                <Text fontSize="sm" color="gray.500">Drop or browse any file to upload to Azure</Text>
              </Box>
            </HStack>
            <FileUpload onUploadSuccess={() => setRefreshKey((k) => k + 1)} />
          </Box>

          {/* File list card */}
          <Box
            borderRadius="2xl"
            p={8}
            style={{
              background: "rgba(255,255,255,0.97)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <FileList refresh={refreshKey} />
          </Box>
        </VStack>
      </Box>

      {/* Footer */}
      <Box
        textAlign="center"
        pb={8}
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        pt={6}
      >
        <Text fontSize="sm" style={{ color: "#475569" }}>
          AzureVault — Built with React, Chakra UI & Azure Blob Storage
        </Text>
      </Box>
    </Box>
  );
}

export default App;
