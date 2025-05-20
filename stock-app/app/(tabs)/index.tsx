import { Image } from 'expo-image';
import { Platform, StyleSheet, View } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<View style={{ height: 0 }} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to Stock Screener!</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
      <Collapsible title="News on Current Stocks">
        <ThemedText>
            <ThemedText style={styles.text}>
              Gain access to the lastest news articles on your current invested stocks. 
              There will be provided information regarding the sentiment, news, and information on the company.
              With updated information, you can make better decisions on your investments.
            </ThemedText>
        </ThemedText>    
      </Collapsible>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Collapsible title="Stock Portfolio">
        <ThemedText>
            <ThemedText style={styles.text}>
              View your current stock portfolio and the performance of each stock. 
              The portfolio will be updated with the latest information on the stocks you are currently invested in when refreshed.
              With this information, you can make better decisions on your investments.
            </ThemedText>
        </ThemedText>    
        </Collapsible>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Collapsible title="New Stock Recommendations">
        <ThemedText>
            <ThemedText style={styles.text}>
              Get new stock recommendations based on the financial fundamentals. 
              The recommendations will be updated with the latest information on new stocks to invest in when refreshed. 
              With this information, you can make better decisions on your investments.
            </ThemedText>
        </ThemedText>    
        </Collapsible>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    marginLeft: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
