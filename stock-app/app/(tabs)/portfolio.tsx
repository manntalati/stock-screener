import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { StyleSheet, Button, View } from 'react-native';
import { useState, useEffect } from 'react';

export default function PortfolioScreen() {
    const [result, setResult] = useState<any[]>([]);

    useEffect(() => {
        const portfolio = async () => {
            try {
                const res = await fetch('http://196.168.86.45:8081/symbols');
                const data = await res.json();
                setResult(data);
            } catch (err) {
                console.error(err);
            }
        };
        portfolio();
    }, []);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={<View style={{ height: 0 }} />}>
        <ThemedView>
            <ThemedText type="title">Current Portfolio</ThemedText>

            {result.map((sym, i) => (
                <ThemedView key={i}>
                    <ThemedText style={styles.portfolio}>{sym}</ThemedText>
                </ThemedView>
            ))}
        </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
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