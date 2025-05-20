import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, View, Dimensions, Button, FlatList, Text } from 'react-native';
import { useState } from 'react';

export default function RecommendationsScreen() {
    const [result, setResult] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const { width, height } = Dimensions.get('window');

    const recommendations = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://[ipaddress]/recommendations');
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
            <ThemedText style={styles.title} type="title">New Stock Recommendations</ThemedText>
        </ThemedView>
        <ThemedView style={styles.view1}>
        <Button
            title={loading ? 'Searching...' : 'New Recommendations'}
            onPress={recommendations}
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
        
                return (
                    <View
                        style={[
                        styles.card, { width: width * 0.17, height: height * 0.17, backgroundColor: '#f0f0f0'},
                        ]}
                    >
                        <Text style={styles.symbol}>{item.symbol}</Text>
                        <Text style={styles.body}>Industry: {item.industry}</Text>
                        <Text style={styles.body}>Price: {price}</Text>
                        <Text style={styles.body}>Buy Score: {Math.round(item.buyScore * 100)/100}</Text>

                    </View>
                );
            }}
        />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
    view1: {
        marginTop: 20,
        marginLeft: 10,
        marginBottom: 10,
        marginRight: 1070,
    },
    title: {
        marginBottom: 10,
        marginLeft: 10,
    },
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    card: {
        marginLeft: 10,
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        marginTop: 10,
    },
    symbol: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    body: {
        fontSize: 16,
    },
});