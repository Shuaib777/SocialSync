import { pipeline } from "@xenova/transformers";

let embedder;
export const getEmbedder = async () => {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
};

export const getEmbedding = async (text) => {
  const embedder = await getEmbedder();
  const output = await embedder(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
};

export const averageEmbeddings = (vectors) => {
  if (!Array.isArray(vectors) || vectors.length === 0) return null;

  const length = vectors[0].length;
  const sum = new Array(length).fill(0);

  vectors.forEach((vec) => {
    for (let i = 0; i < length; i++) {
      sum[i] += vec[i];
    }
  });

  return sum.map((val) => val / vectors.length);
};

export const weightedAverageEmbeddings = (weightedVectors) => {
  if (!weightedVectors.length) return null;

  const length = weightedVectors[0].vector.length;
  const result = new Array(length).fill(0);
  let totalWeight = 0;

  for (const { vector, weight } of weightedVectors) {
    for (let i = 0; i < length; i++) {
      result[i] += vector[i] * weight;
    }
    totalWeight += weight;
  }

  return result.map((val) => val / totalWeight);
};
