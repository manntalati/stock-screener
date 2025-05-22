import { StyleSheet, Button, Linking, View, FlatList, Dimensions } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useState } from 'react';

export default function TabTwoScreen() {
  const [result, setResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { width, height } = Dimensions.get('window');

  const news = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://192.168.86.45:8081/analyze');
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
      headerImage={<View style={{ height: 0 }} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">News On Current Stocks</ThemedText>
      </ThemedView>

      <ThemedView style={styles.view1}>
      <Button
        title={loading ? 'Fetching...' : 'Fetch Current News'}
        onPress={news}
        disabled={loading}
      />
      </ThemedView>
      <FlatList
        style={{ margin: 10 }}
        data={result}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <ThemedView style={[styles.result, 
          {backgroundColor: item.Sentiment === 'Positive' ? '#d4f8e8' : item.Sentiment === 'Negative' ? '#fde2e2' : '#f0f0f0'},
          {width: width * 0.9, height: height * 0.2}
          ]}>
            <ThemedText style={styles.flatlistTop}>{item['Company Name']} ({item['Stock Symbol']})</ThemedText>
            <ThemedText style={styles.flatlist}>Article Title: {item['Article Title']}</ThemedText>
            <ThemedText style={styles.flatlist}>Date Published: {item['Date Published']}</ThemedText>
            <ThemedText style={[styles.flatlist, styles.link]} onPress={() => Linking.openURL(item['Article URL'])}>{item['Article URL']} </ThemedText>
            <ThemedText style={styles.flatlist}>Sentiment: {item.Sentiment}</ThemedText>
            <ThemedText style={styles.flatListBottom}>Sentiment Score: {Math.round(item['Sentiment Score']*100)/100}</ThemedText>
          </ThemedView>
        )}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  flatlistTop: {
    color: 'black',
    fontSize: 20,
    marginBottom: 4,
    marginLeft: 5,
    fontWeight: 'bold',
    marginTop: 5,
  },
  flatListBottom: {
    marginLeft: 5,
    fontSize: 16,
    color: 'black',
  },
  view1: {
    marginTop: 10, 
    marginLeft: 10, 
    marginRight: 1070,
  },
  flatlist: {
    color: 'black',
    fontSize: 16,
    marginLeft: 5,
  },
  link: {
    color: 'black',
    textDecorationLine: 'underline',
  },
  news: {
    fontSize: 20,
    color: 'white', 
  },
  result: {
    marginTop: 20,
    borderRadius: 10,
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
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    flexDirection: 'row',
    gap: 8,
  },
});