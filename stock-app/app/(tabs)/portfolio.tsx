import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, Button, View, FlatList, Text, Dimensions } from 'react-native';
import { useState } from 'react';

export default function PortfolioScreen() {
    const [result, setResult] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const { width, height } = Dimensions.get('window');

    const portfolio = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://192.168.86.45:8081/symbols');
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={<View style={{ height: 0 }} />}>
        <ThemedView>
            <ThemedText style={styles.title} type="title">Current Portfolio</ThemedText>
        <ThemedView style={styles.view1}>
        <Button
                title={loading ? 'Refreshing...' : 'Refresh Portfolio'}
                onPress={portfolio}
                disabled={loading}
        />
        </ThemedView>
        <FlatList
        data={result}
        keyExtractor={(_, i) => i.toString()}
        numColumns={5}
        renderItem={({ item }) => {
          const price = typeof item.price === 'number'
            ? `$${item.price.toFixed(2)}`
            : item.price;
          const pct = typeof item.percent_change === 'number'
            ? `${(item.percent_change * 100 / 100).toFixed(2)}%`
            : item.percent_change;
          const price_change = typeof item.price_change === 'number'
            ? `$${(item.price_change).toFixed(2)}`
            : item.price_change;

          return (
            <View
              style={[
                styles.card,
                {
                  width: width * 0.17,
                  height: height * 0.15,
                  backgroundColor:
                    (typeof item.percent_change === 'number' && item.percent_change > 0)
                      ? '#d4f8e8'
                      : (typeof item.percent_change === 'number' && item.percent_change < 0)
                      ? '#fde2e2'
                      : '#f0f0f0',
                },
              ]}
            >
              <Text style={styles.symbol}>{item.symbol}</Text>
              <Text style={styles.body}>Price: {price}</Text>
              <Text style={styles.body}>Price Change: {price_change}</Text>
              <Text style={styles.body}>Change: {pct}</Text>
            </View>
            );
            }}
        />
        </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    symbol: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    body: {
        fontSize: 16,
    },
    card: {
        marginLeft: 10,
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        marginTop: 10,
    },
    result: {
        marginTop: 20,
    },
    flatlist: {
        color: 'black',
        fontSize: 20,
    },
    title: {
        marginBottom: 10,
        marginLeft: 10,
    },
    view1: {
        marginTop: 20,
        marginLeft: 10,
        marginBottom: 10,
        marginRight: 1070,
    },
    portfolio: {
        fontSize: 20,
        color: 'white', 
    },
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
});