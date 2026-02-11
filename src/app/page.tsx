'use client';

import { useState } from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  HStack,
  Alert,
  Input,
  Image
} from "@chakra-ui/react";
import { analyzeImage } from "./actions";
import { IAnalysisResult } from "./app";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<IAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setAnalysisResult(null);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select a chart image first');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Convert file to base64 data URL
      const reader = new FileReader();
      const fileDataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const resp = await analyzeImage({
        metadatas: {
          imageUrl: fileDataUrl,
          accountBalance: 1000,
          symbol: 'GBP/JPY',
          timeframe: '15m',
        }
      });
      setAnalysisResult(resp.json);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to analyze chart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.900" py={16} px={16} justifyContent={'center'} display={'flex'}>
      <Container maxW="container.xl">
        <VStack gap={8} align="stretch">
          {/* Header */}
          <VStack gap={2} textAlign="center">
            <Heading
              size="2xl"
              bgGradient="linear(to-r, purple.400, purple.600)"
              bgClip="text"
            >
              Chart Analysis
            </Heading>
            <Text fontSize="lg" color="gray.400">
              AI-Powered Trading Analysis
            </Text>
          </VStack>

          {/* File Input */}
          <Card>
            <VStack gap={4} align="stretch">
              <Text fontWeight="semibold" color="gray.300">
                Upload Chart Image
              </Text>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                p={2}
                border="2px dashed"
                borderColor="gray.600"
                _hover={{ borderColor: "purple.500" }}
                cursor="pointer"
              />
              {previewUrl && (
                <Box mt={4}>
                  <Image
                    src={previewUrl}
                    alt="Chart preview"
                    maxH="400px"
                    objectFit="contain"
                    borderRadius="md"
                    mx="auto"
                  />
                </Box>
              )}
            </VStack>
          </Card>

          {/* Analyze Button */}
          <Button 
            w="full"
            onClick={handleAnalyze} 
            loading={loading}
            disabled={!selectedFile}
          >
            {loading ? 'Analyzing...' : 'Analyze Chart'}
          </Button>

          {/* Error Alert */}
          {error && (
            <Alert.Root status="error" borderRadius="xl">
              <Alert.Indicator />
              <Alert.Title>{error}</Alert.Title>
            </Alert.Root>
          )}

          {/* Results */}
          {analysisResult && (
            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
              {/* Trade Signal Card */}
              <Card
                gridColumn={{ base: 1, lg: "1 / -1" }}
                borderWidth="2px"
                borderColor={analysisResult.tradeDirection === 'LONG' ? 'green.500' : 'red.500'}
                bgGradient={
                  analysisResult.tradeDirection === 'LONG'
                    ? 'linear(to-br, green.900/20, gray.800)'
                    : 'linear(to-br, red.900/20, gray.800)'
                }
              >
                <Flex justify="space-between" align="center" mb={5}>
                  <Heading size="lg">Trade Signal</Heading>
                  <Badge
                    colorScheme={analysisResult.tradeDirection === 'LONG' ? 'green' : 'red'}
                  >
                    {analysisResult.tradeDirection}
                  </Badge>
                </Flex>
                <VStack align="stretch" gap={2}>
                  <Text fontSize="sm" color="gray.400">
                    Confidence: {(analysisResult.confidence * 100).toFixed(0)}%
                  </Text>
                  <Progress value={analysisResult.confidence * 100} />
                </VStack>
              </Card>

              {/* Price Levels Card */}
              <Card>
                <Heading size="lg" mb={4}>Price Levels</Heading>
                <SimpleGrid columns={analysisResult.entryPrice ? 3 : 2} gap={4}>
                  {analysisResult.entryPrice && (
                    <VStack align="start" gap={2}>
                      <Text fontSize="sm" color="gray.400" textTransform="uppercase">
                        Entry Price
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="blue.400">
                        {analysisResult.entryPrice.toFixed(3)}
                      </Text>
                    </VStack>
                  )}
                  {analysisResult.takeProfit && (
                    <VStack align="start" gap={2}>
                      <Text fontSize="sm" color="gray.400" textTransform="uppercase">
                        Take Profit
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="green.400">
                        {analysisResult.takeProfit.toFixed(3)}
                      </Text>
                    </VStack>
                  )}
                  {analysisResult.stopLoss && (
                    <VStack align="start" gap={2}>
                      <Text fontSize="sm" color="gray.400" textTransform="uppercase">
                        Stop Loss
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="red.400">
                        {analysisResult.stopLoss.toFixed(3)}
                      </Text>
                    </VStack>
                  )}
                </SimpleGrid>
              </Card>

              {/* Metrics Card */}
              <Card>
                <Heading size="lg" mb={4}>Metrics</Heading>
                <SimpleGrid columns={2} gap={4}>
                  {analysisResult.riskRewardRatio && (
                    <VStack align="start" gap={2}>
                      <Text fontSize="sm" color="gray.400" textTransform="uppercase">
                        Risk/Reward
                      </Text>
                      <Text fontSize="xl" fontWeight="bold" color="blue.400">
                        {analysisResult.riskRewardRatio.join(':')}
                      </Text>
                    </VStack>
                  )}
                  {analysisResult.winratePercentage && (
                    <VStack align="start" gap={2}>
                      <Text fontSize="sm" color="gray.400" textTransform="uppercase">
                        Win Rate
                      </Text>
                      <Text fontSize="xl" fontWeight="bold" color="blue.400">
                        {analysisResult.winratePercentage.toFixed(0)}%
                      </Text>
                    </VStack>
                  )}
                </SimpleGrid>
              </Card>

              {/* Key Levels Card */}
              {analysisResult.keySupportResistanceLevels && analysisResult.keySupportResistanceLevels.length > 0 && (
                <Card gridColumn={{ base: 1, lg: "1 / -1" }}>
                  <Heading size="lg" mb={4}>Key Levels</Heading>
                  <HStack gap={2} flexWrap="wrap">
                    {analysisResult.keySupportResistanceLevels.map((level, index) => (
                      <Badge
                        key={index}
                        colorScheme="blue"
                        px={4}
                        py={2}
                      >
                        {level.toFixed(3)}
                      </Badge>
                    ))}
                  </HStack>
                </Card>
              )}

              {/* Analysis Card */}
              <Card gridColumn={{ base: 1, lg: "1 / -1" }}>
                <Heading size="lg" mb={4}>Analysis</Heading>
                <Text color="gray.300" lineHeight="1.7" whiteSpace="pre-wrap">
                  {analysisResult.rationale}
                </Text>
              </Card>
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
