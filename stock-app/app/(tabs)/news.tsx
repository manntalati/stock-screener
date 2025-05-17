import { StyleSheet, Button, Text, View, ActivityIndicator, FlatList } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useState } from 'react';

export default function TabTwoScreen() {
  const [result, setResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const news = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://192.168.86.43:8081/analyze');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">News On Current Stocks</ThemedText>
      </ThemedView>

      <Button
        title={loading ? 'Fetching...' : 'Fetch Current News'}
        onPress={news}
        disabled={loading}
      />

      {result.map((item: any, i: number) => (
        <View key={i}>
          <Text style={styles.news}>{item['Company Name']}</Text>
          <Text style={styles.news}>Article Title: {item['Article Title']}</Text>
          <Text style={styles.news}>Date Published: {item['Date Published']}</Text>
          <Text style={styles.news}>Article URL: {item['Article URL']}</Text>
          <Text style={styles.news}>Sentiment: {item.Sentiment}</Text>
        </View>
      ))}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  news: {
    fontSize: 20,
    color: 'white', 
  },
  result: {
    marginTop: 20,
  },
  error: {
    color: 'red',
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});